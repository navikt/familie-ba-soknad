import { ESvar } from '@navikt/familie-form-elements';
import { format, startOfMonth, subMonths } from 'date-fns';
import type { Alpha3Code } from 'i18n-iso-countries';

import { Dokumentasjonsbehov } from '../../common/typer/kontrakt/dokumentasjon';
import { ESivilstand, ESøknadstype, Slektsforhold } from '../../common/typer/kontrakt/generelle';
import { ArbeidsperiodeSpørsmålsId } from '../components/Felleskomponenter/Arbeidsperiode/spørsmål';
import { BarnetrygdperiodeSpørsmålId } from '../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import { UtenlandsoppholdSpørsmålId } from '../components/Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import type { IAndreForelder, IBarnMedISøknad } from '../typer/barn';
import { BeskrivelseSanityApiNavn, type IDokumentasjon } from '../typer/dokumentasjon';
import type { IArbeidsperiode, IEøsBarnetrygdsperiode, IUtenlandsperiode } from '../typer/perioder';
import type { IBarn, ISøker } from '../typer/person';
import { AlternativtSvarForInput } from '../typer/svar';
import type { ISøknad } from '../typer/søknad';
import { EUtenlandsoppholdÅrsak } from '../typer/utenlandsopphold';
import { Årsak } from '../typer/utvidet';
import {
    genererInitialBarnMedISøknad,
    genererInitiellAndreForelder,
    hentUid,
    skalViseBorMedOmsorgsperson,
} from '../utils/barn';

import { Avvik, Scenario } from './scenario';

export interface Preutfyllingsvalg {
    scenario: Scenario;
    avvik: Avvik[];
    /** Id-ene til barna fra folkeregisteret (søknad.søker.barn) som skal være med i søknaden. */
    valgteBarnIder: string[];
    /** Fødselsnummer til et barn som ikke er i listen fra folkeregisteret, f.eks. et barn med adressebeskyttelse. */
    ekstraBarnIdent?: string;
    /** Landet som brukes i EØS-scenarioene. Må være et EØS-land i kodeverket. */
    eøsLand: Alpha3Code;
}

/** Hva som skal svares i søknaden. Alt som er `false`, gir svaret fra «happy case». */
interface Svar {
    erUtvidet: boolean;
    søkerArbeiderIEøsLand: boolean;
    barnaFårBarnetrygdFraEøsLand: boolean;
    andreForelderArbeiderIEøsLand: boolean;
    harEøsSteg: boolean;
    deltBosted: boolean;
    borIkkeFastMedSøker: boolean;
    søkerErAsylsøker: boolean;
    barnaErAsylsøkere: boolean;
    adoptertFraUtlandet: boolean;
    fosterbarn: boolean;
    institusjon: boolean;
    søkerUtenforNorge: boolean;
    barnaUtenforNorge: boolean;
    eøsLand: Alpha3Code;
}

const utledSvar = ({ scenario, avvik, eøsLand }: Preutfyllingsvalg): Svar => ({
    erUtvidet: scenario === Scenario.UTVIDET,
    søkerArbeiderIEøsLand: scenario === Scenario.EØS_SØKER,
    barnaFårBarnetrygdFraEøsLand: scenario === Scenario.EØS_BARN,
    andreForelderArbeiderIEøsLand: scenario === Scenario.EØS_ANDRE_FORELDER,
    harEøsSteg: [Scenario.EØS_SØKER, Scenario.EØS_BARN, Scenario.EØS_ANDRE_FORELDER].includes(scenario),
    deltBosted: avvik.includes(Avvik.DELT_BOSTED),
    borIkkeFastMedSøker: avvik.includes(Avvik.BOR_IKKE_FAST_MED_SØKER),
    søkerErAsylsøker: avvik.includes(Avvik.SØKER_ER_ASYLSØKER),
    barnaErAsylsøkere: avvik.includes(Avvik.BARNA_ER_ASYLSØKERE),
    adoptertFraUtlandet: avvik.includes(Avvik.ADOPTERT_FRA_UTLANDET),
    fosterbarn: avvik.includes(Avvik.FOSTERBARN),
    institusjon: avvik.includes(Avvik.INSTITUSJON),
    søkerUtenforNorge: avvik.includes(Avvik.SØKER_UTENFOR_NORGE),
    barnaUtenforNorge: avvik.includes(Avvik.BARNA_UTENFOR_NORGE),
    eøsLand,
});

/**
 * Søknaden spør ikke om den andre forelderen for fosterbarn, så valg som handler om den andre forelderen kan ikke
 * kombineres med fosterbarn. Returnerer en forklaring hvis valgene ikke passer sammen.
 */
export const finnUgyldigKombinasjon = ({ scenario, avvik }: Pick<Preutfyllingsvalg, 'scenario' | 'avvik'>) => {
    if (!avvik.includes(Avvik.FOSTERBARN)) {
        return undefined;
    }
    if (scenario === Scenario.EØS_ANDRE_FORELDER) {
        return 'Fosterbarn kan ikke kombineres med scenarioet der den andre forelderen arbeider i et EØS-land.';
    }
    if (avvik.includes(Avvik.DELT_BOSTED)) {
        return 'Fosterbarn kan ikke kombineres med avtale om delt bosted.';
    }
    return undefined;
};

const NAVN_PÅ_EKSTRA_BARN = 'Barn Lagt Til Manuelt';
const NAVN_PÅ_ANDRE_FORELDER = 'Annen Forelder';
const ID_NUMMER = '010190-1234';
const ADRESSE_I_SØKEPERIODEN = 'Testveien 1, 0150 Oslo';
// Et land utenfor EØS, slik at et opphold der ikke gjør søknaden til en EØS-søknad.
const LAND_UTENFOR_EØS: Alpha3Code = 'USA';

const jaHvis = (betingelse: boolean) => (betingelse ? ESvar.JA : ESvar.NEI);

const førsteIMåneden = (antallMånederSiden: number) =>
    format(startOfMonth(subMonths(new Date(), antallMånederSiden)), 'yyyy-MM-dd');

const førsteJanuarIFjor = () => `${new Date().getFullYear() - 1}-01-01`;

const erEnkeEllerGjenlevende = (søker: ISøker) =>
    søker.sivilstand.type === ESivilstand.ENKE_ELLER_ENKEMANN ||
    søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER;

const lagArbeidsperiodeIUtlandet = (land: Alpha3Code): IArbeidsperiode => ({
    arbeidsperiodeAvsluttet: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet, svar: ESvar.NEI },
    arbeidsperiodeland: { id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand, svar: land },
    arbeidsgiver: { id: ArbeidsperiodeSpørsmålsId.arbeidsgiver, svar: 'Arbeidsgiver AS' },
    fraDatoArbeidsperiode: { id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode, svar: førsteJanuarIFjor() },
    tilDatoArbeidsperiode: {
        id: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
        svar: AlternativtSvarForInput.UKJENT,
    },
});

// Perioden starter forrige måned, slik at den ikke begynner før et nyfødt barn er født.
const lagEøsBarnetrygdsperiode = (land: Alpha3Code): IEøsBarnetrygdsperiode => ({
    mottarEøsBarnetrygdNå: { id: BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå, svar: ESvar.JA },
    barnetrygdsland: { id: BarnetrygdperiodeSpørsmålId.barnetrygdsland, svar: land },
    fraDatoBarnetrygdperiode: { id: BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode, svar: førsteIMåneden(1) },
    tilDatoBarnetrygdperiode: { id: BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode, svar: '' },
    månedligBeløp: { id: BarnetrygdperiodeSpørsmålId.månedligBeløp, svar: '1000' },
});

const lagAvsluttetOppholdUtenforNorge = (): IUtenlandsperiode => ({
    utenlandsoppholdÅrsak: {
        id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
        svar: EUtenlandsoppholdÅrsak.HAR_OPPHOLDT_SEG_UTENFOR_NORGE,
    },
    oppholdsland: { id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold, svar: LAND_UTENFOR_EØS },
    oppholdslandFraDato: { id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold, svar: førsteIMåneden(3) },
    oppholdslandTilDato: { id: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold, svar: førsteIMåneden(1) },
});

const lagEkstraBarn = (ident: string): IBarn => ({
    id: hentUid(),
    navn: NAVN_PÅ_EKSTRA_BARN,
    ident,
    borMedSøker: undefined,
    alder: null,
    adressebeskyttelse: false,
});

const lagAndreForelder = (svar: Svar): IAndreForelder => {
    const initiell = genererInitiellAndreForelder(null, false);

    return {
        ...initiell,
        navn: { ...initiell.navn, svar: NAVN_PÅ_ANDRE_FORELDER },
        fnr: { ...initiell.fnr, svar: AlternativtSvarForInput.UKJENT },
        fødselsdato: { ...initiell.fødselsdato, svar: AlternativtSvarForInput.UKJENT },
        arbeidUtlandet: { ...initiell.arbeidUtlandet, svar: jaHvis(svar.andreForelderArbeiderIEøsLand) },
        arbeidsperioderUtland: svar.andreForelderArbeiderIEøsLand ? [lagArbeidsperiodeIUtlandet(svar.eøsLand)] : [],
        pensjonUtland: { ...initiell.pensjonUtland, svar: ESvar.NEI },
        skriftligAvtaleOmDeltBosted: { ...initiell.skriftligAvtaleOmDeltBosted, svar: jaHvis(svar.deltBosted) },
        utvidet: {
            ...initiell.utvidet,
            søkerHarBoddMedAndreForelder: {
                ...initiell.utvidet.søkerHarBoddMedAndreForelder,
                svar: svar.erUtvidet ? ESvar.NEI : null,
            },
        },
        ...(svar.harEøsSteg && {
            idNummer: svar.andreForelderArbeiderIEøsLand
                ? [{ land: svar.eøsLand, idnummer: AlternativtSvarForInput.UKJENT }]
                : [],
            adresse: { ...initiell.adresse, svar: AlternativtSvarForInput.UKJENT },
            arbeidNorge: { ...initiell.arbeidNorge, svar: ESvar.NEI },
            pensjonNorge: { ...initiell.pensjonNorge, svar: ESvar.NEI },
            andreUtbetalinger: { ...initiell.andreUtbetalinger, svar: ESvar.NEI },
            pågåendeSøknadFraAnnetEøsLand: { ...initiell.pågåendeSøknadFraAnnetEøsLand, svar: ESvar.NEI },
            barnetrygdFraEøs: { ...initiell.barnetrygdFraEøs, svar: ESvar.NEI },
        }),
    };
};

const lagBarnMedISøknad = (barn: IBarn, indeks: number, svar: Svar): IBarnMedISøknad => {
    const initielt = genererInitialBarnMedISøknad(barn);
    const borFastMedSøker = jaHvis(!svar.borIkkeFastMedSøker);
    const oppholderSegIInstitusjon = jaHvis(svar.institusjon);
    // Spørsmålet stilles ikke for fosterbarn og barn i institusjon, se useEøsForBarn.
    const borMedAndreForelder = svar.fosterbarn || svar.institusjon ? null : ESvar.NEI;
    const spørOmOmsorgsperson = skalViseBorMedOmsorgsperson(
        borMedAndreForelder,
        borFastMedSøker,
        oppholderSegIInstitusjon,
        ESvar.NEI,
        jaHvis(svar.fosterbarn)
    );

    return {
        ...initielt,
        barnErFyltUt: true,
        triggetEøs: svar.barnaFårBarnetrygdFraEøsLand || svar.andreForelderArbeiderIEøsLand,
        erFosterbarn: { ...initielt.erFosterbarn, svar: jaHvis(svar.fosterbarn) },
        erIBeredskapshjem: { ...initielt.erIBeredskapshjem, svar: ESvar.NEI },
        erAdoptertFraUtland: { ...initielt.erAdoptertFraUtland, svar: jaHvis(svar.adoptertFraUtlandet) },
        erAsylsøker: { ...initielt.erAsylsøker, svar: jaHvis(svar.barnaErAsylsøkere) },
        andreForelderErDød: { ...initielt.andreForelderErDød, svar: ESvar.NEI },
        borFastMedSøker: { ...initielt.borFastMedSøker, svar: borFastMedSøker },
        barnetrygdFraAnnetEøsland: {
            ...initielt.barnetrygdFraAnnetEøsland,
            svar: jaHvis(svar.barnaFårBarnetrygdFraEøsLand),
        },
        oppholderSegIInstitusjon: { ...initielt.oppholderSegIInstitusjon, svar: oppholderSegIInstitusjon },
        ...(svar.institusjon && {
            institusjonsnavn: { ...initielt.institusjonsnavn, svar: 'Testinstitusjonen' },
            institusjonsadresse: { ...initielt.institusjonsadresse, svar: 'Institusjonsveien 1' },
            institusjonspostnummer: { ...initielt.institusjonspostnummer, svar: '0150' },
            institusjonOppholdStartdato: { ...initielt.institusjonOppholdStartdato, svar: førsteIMåneden(1) },
            institusjonOppholdSluttdato: {
                ...initielt.institusjonOppholdSluttdato,
                svar: AlternativtSvarForInput.UKJENT,
            },
        }),
        boddMindreEnn12MndINorge: { ...initielt.boddMindreEnn12MndINorge, svar: jaHvis(svar.barnaUtenforNorge) },
        ...(svar.barnaUtenforNorge && {
            utenlandsperioder: [lagAvsluttetOppholdUtenforNorge()],
            planleggerÅBoINorge12Mnd: { ...initielt.planleggerÅBoINorge12Mnd, svar: ESvar.JA },
        }),
        // Søknaden spør ikke om den andre forelderen for fosterbarn, se genererOppdaterteBarn i OmBarnaDine.
        andreForelder: svar.fosterbarn ? null : lagAndreForelder(svar),
        // Spørsmålet om samme forelder vises for alle barn etter det første, se useOmBarnet.
        sammeForelderSomAnnetBarnMedId: {
            ...initielt.sammeForelderSomAnnetBarnMedId,
            svar: indeks === 0 || svar.fosterbarn ? null : AlternativtSvarForInput.ANNEN_FORELDER,
        },
        ...(svar.barnaFårBarnetrygdFraEøsLand && {
            pågåendeSøknadFraAnnetEøsLand: { ...initielt.pågåendeSøknadFraAnnetEøsLand, svar: ESvar.NEI },
            mottarEllerMottokEøsBarnetrygd: { ...initielt.mottarEllerMottokEøsBarnetrygd, svar: ESvar.JA },
            eøsBarnetrygdsperioder: [lagEøsBarnetrygdsperiode(svar.eøsLand)],
            idNummer: [{ land: svar.eøsLand, idnummer: AlternativtSvarForInput.UKJENT }],
        }),
        ...(svar.harEøsSteg && {
            søkersSlektsforhold: {
                ...initielt.søkersSlektsforhold,
                svar: svar.fosterbarn ? '' : Slektsforhold.FORELDER,
            },
            borMedAndreForelder: { ...initielt.borMedAndreForelder, svar: borMedAndreForelder },
            borMedOmsorgsperson: { ...initielt.borMedOmsorgsperson, svar: spørOmOmsorgsperson ? ESvar.NEI : null },
            // Barnets adresse spørres det bare om for fosterbarn, se useEøsForBarn.
            adresse: { ...initielt.adresse, svar: svar.fosterbarn ? AlternativtSvarForInput.UKJENT : '' },
        }),
    };
};

const lagSøker = (søker: ISøker, svar: Svar): ISøker => {
    const spørsmålOmAdresseVises = !!søker.adresse && !søker.adressebeskyttelse;

    return {
        ...søker,
        triggetEøs: svar.søkerArbeiderIEøsLand,
        borPåRegistrertAdresse: {
            ...søker.borPåRegistrertAdresse,
            svar: spørsmålOmAdresseVises ? ESvar.JA : null,
        },
        værtINorgeITolvMåneder: { ...søker.værtINorgeITolvMåneder, svar: jaHvis(!svar.søkerUtenforNorge) },
        utenlandsperioder: svar.søkerUtenforNorge ? [lagAvsluttetOppholdUtenforNorge()] : [],
        planleggerÅBoINorgeTolvMnd: {
            ...søker.planleggerÅBoINorgeTolvMnd,
            svar: svar.søkerUtenforNorge ? ESvar.JA : null,
        },
        erAsylsøker: { ...søker.erAsylsøker, svar: jaHvis(svar.søkerErAsylsøker) },
        arbeidIUtlandet: { ...søker.arbeidIUtlandet, svar: jaHvis(svar.søkerArbeiderIEøsLand) },
        arbeidsperioderUtland: svar.søkerArbeiderIEøsLand ? [lagArbeidsperiodeIUtlandet(svar.eøsLand)] : [],
        mottarUtenlandspensjon: { ...søker.mottarUtenlandspensjon, svar: ESvar.NEI },
        pensjonsperioderUtland: [],
        arbeidINorge: { ...søker.arbeidINorge, svar: svar.harEøsSteg ? ESvar.NEI : null },
        arbeidsperioderNorge: [],
        pensjonNorge: { ...søker.pensjonNorge, svar: svar.harEøsSteg ? ESvar.NEI : null },
        pensjonsperioderNorge: [],
        andreUtbetalinger: { ...søker.andreUtbetalinger, svar: svar.harEøsSteg ? ESvar.NEI : null },
        andreUtbetalingsperioder: [],
        idNummer: svar.søkerArbeiderIEøsLand ? [{ land: svar.eøsLand, idnummer: ID_NUMMER }] : [],
        adresseISøkeperiode: {
            ...søker.adresseISøkeperiode,
            svar: svar.søkerArbeiderIEøsLand ? ADRESSE_I_SØKEPERIODEN : '',
        },
        utvidet: {
            ...søker.utvidet,
            spørsmål: {
                ...søker.utvidet.spørsmål,
                årsak: { ...søker.utvidet.spørsmål.årsak, svar: svar.erUtvidet ? Årsak.SKILT : '' },
                separertEnkeSkilt: {
                    ...søker.utvidet.spørsmål.separertEnkeSkilt,
                    // Spørsmålet vises bare for søkere som er registrert som gift, se useDinLivssituasjon.
                    svar: svar.erUtvidet && søker.sivilstand.type === ESivilstand.GIFT ? ESvar.NEI : null,
                },
                separertEnkeSkiltUtland: { ...søker.utvidet.spørsmål.separertEnkeSkiltUtland, svar: null },
                separertEnkeSkiltDato: { ...søker.utvidet.spørsmål.separertEnkeSkiltDato, svar: '' },
                harSamboerNå: { ...søker.utvidet.spørsmål.harSamboerNå, svar: svar.erUtvidet ? ESvar.NEI : null },
                hattAnnenSamboerForSøktPeriode: {
                    ...søker.utvidet.spørsmål.hattAnnenSamboerForSøktPeriode,
                    svar: svar.erUtvidet ? ESvar.NEI : null,
                },
            },
            nåværendeSamboer: null,
            tidligereSamboere: [],
        },
    };
};

/** Samme regler for vedleggskrav som stegene i søknaden bruker når søkeren går videre fra dem. */
const lagDokumentasjon = (dokumentasjon: IDokumentasjon, barna: IBarnMedISøknad[], svar: Svar): IDokumentasjon => {
    const alleBarnHvis = (betingelse: boolean) => (betingelse ? barna.map(barn => barn.id) : []);
    const tom = {
        ...dokumentasjon,
        gjelderForSøker: false,
        gjelderForBarnId: [],
        harSendtInn: false,
        opplastedeVedlegg: [],
    };

    switch (dokumentasjon.dokumentasjonsbehov) {
        case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
            return { ...tom, gjelderForBarnId: alleBarnHvis(svar.deltBosted) };
        case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
            return {
                ...tom,
                gjelderForSøker: svar.søkerErAsylsøker,
                gjelderForBarnId: alleBarnHvis(svar.barnaErAsylsøkere),
            };
        case Dokumentasjonsbehov.ADOPSJON_DATO:
            return { ...tom, gjelderForBarnId: alleBarnHvis(svar.adoptertFraUtlandet) };
        case Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN:
            return {
                ...tom,
                gjelderForBarnId: alleBarnHvis(svar.fosterbarn),
                beskrivelseSanityApiNavn: BeskrivelseSanityApiNavn.bekreftelseFraBarnevernetBarnetrygd,
            };
        case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
            return {
                ...tom,
                // Bekreftelse kreves når barnet bor fast hos søker uten å være registrert på søkerens adresse.
                gjelderForBarnId: svar.borIkkeFastMedSøker
                    ? []
                    : barna.filter(barn => !barn.borMedSøker).map(barn => barn.id),
            };
        default:
            return tom;
    }
};

/**
 * Lager en ferdig utfylt søknad for den innloggede søkeren, med svar som passer til det valgte scenarioet og avvikene.
 *
 * `søknad` må være søknaden fra AppContext, slik at søkeren og barna fra folkeregisteret er med.
 */
export const byggPreutfyltSøknad = (søknad: ISøknad, valg: Preutfyllingsvalg): ISøknad => {
    const svar = utledSvar(valg);

    const ekstraBarn = valg.ekstraBarnIdent ? [lagEkstraBarn(valg.ekstraBarnIdent)] : [];
    const barna = [...søknad.søker.barn.filter(barn => valg.valgteBarnIder.includes(barn.id)), ...ekstraBarn].map(
        (barn, indeks) => lagBarnMedISøknad(barn, indeks, svar)
    );
    const søker = lagSøker(søknad.søker, svar);

    return {
        ...søknad,
        søknadstype: svar.erUtvidet ? ESøknadstype.UTVIDET : ESøknadstype.ORDINÆR,
        erEøs: svar.harEøsSteg,
        lestOgForståttBekreftelse: true,
        søker,
        barnInkludertISøknaden: barna,
        barnRegistrertManuelt: ekstraBarn,
        erNoenAvBarnaFosterbarn: { ...søknad.erNoenAvBarnaFosterbarn, svar: jaHvis(svar.fosterbarn) },
        erNoenAvBarnaIBeredskapshjem: { ...søknad.erNoenAvBarnaIBeredskapshjem, svar: ESvar.NEI },
        oppholderBarnSegIInstitusjon: { ...søknad.oppholderBarnSegIInstitusjon, svar: jaHvis(svar.institusjon) },
        erBarnAdoptertFraUtland: { ...søknad.erBarnAdoptertFraUtland, svar: jaHvis(svar.adoptertFraUtlandet) },
        søktAsylForBarn: { ...søknad.søktAsylForBarn, svar: jaHvis(svar.barnaErAsylsøkere) },
        barnOppholdtSegTolvMndSammenhengendeINorge: {
            ...søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
            svar: jaHvis(!svar.barnaUtenforNorge),
        },
        mottarBarnetrygdForBarnFraAnnetEøsland: {
            ...søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
            svar: jaHvis(svar.barnaFårBarnetrygdFraEøsLand),
        },
        // Spørsmålet vises bare for søkere som er registrert som enke, enkemann eller gjenlevende partner.
        erAvdødPartnerForelder: {
            id:
                søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER
                    ? OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                    : OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder,
            svar: erEnkeEllerGjenlevende(søker) ? ESvar.NEI : null,
        },
        dokumentasjon: søknad.dokumentasjon.map(dokumentasjon => lagDokumentasjon(dokumentasjon, barna, svar)),
    };
};

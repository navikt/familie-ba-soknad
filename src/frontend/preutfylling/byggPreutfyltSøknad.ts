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
    erBarnIFosterhjemEllerBeredskapshjem,
    genererInitialBarnMedISøknad,
    genererInitiellAndreForelder,
    hentUid,
    skalViseBorMedOmsorgsperson,
} from '../utils/barn';

import { Avvik, Scenario } from './scenario';

export interface Preutfyllingsvalg {
    scenario: Scenario;
    avvik: Avvik[];
    /** Barna fra folkeregisteret (søknad.søker.barn) som skal være med i søknaden. */
    barn: IBarn[];
    /** Fødselsnummer til et barn som ikke er i listen fra folkeregisteret, f.eks. et barn med adressebeskyttelse. */
    ekstraBarnIdent?: string;
    /** Landet som brukes i EØS-scenarioene. Må være et EØS-land i kodeverket. */
    eøsLand: Alpha3Code;
}

type Valg = Pick<Preutfyllingsvalg, 'scenario' | 'avvik' | 'eøsLand'>;

const EØS_SCENARIOER = [Scenario.EØS_SØKER, Scenario.EØS_BARN, Scenario.EØS_ANDRE_FORELDER];

export const erEøsScenario = (scenario: Scenario) => EØS_SCENARIOER.includes(scenario);

const harAvvik = (valg: Valg, avvik: Avvik) => valg.avvik.includes(avvik);

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
// En årsak som ikke utløser krav om dokumentasjon på separasjon, skilsmisse eller dødsfall (se useOmBarnet).
const ÅRSAK_TIL_UTVIDET = Årsak.BODD_ALENE;

const jaHvis = (betingelse: boolean) => (betingelse ? ESvar.JA : ESvar.NEI);

const førsteIMåneden = (antallMånederSiden: number) =>
    format(startOfMonth(subMonths(new Date(), antallMånederSiden)), 'yyyy-MM-dd');

const førsteJanuarIFjor = () => `${new Date().getFullYear() - 1}-01-01`;

const erEnkeEllerGjenlevende = (søker: ISøker) =>
    søker.sivilstand.type === ESivilstand.ENKE_ELLER_ENKEMANN ||
    søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER;

/*
 * Periodene valideres bare i dialogene der søkeren legger dem til, ikke på oppsummeringen. Datoene er valgt slik at de
 * er gyldige i dialogene uansett hvilken dag verktøyet brukes, men de tar ikke hensyn til når barnet er født.
 */

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

const lagAndreForelder = (valg: Valg): IAndreForelder => {
    const initiell = genererInitiellAndreForelder(null, false);
    const arbeiderIEøsLand = valg.scenario === Scenario.EØS_ANDRE_FORELDER;

    return {
        ...initiell,
        navn: { ...initiell.navn, svar: NAVN_PÅ_ANDRE_FORELDER },
        fnr: { ...initiell.fnr, svar: AlternativtSvarForInput.UKJENT },
        fødselsdato: { ...initiell.fødselsdato, svar: AlternativtSvarForInput.UKJENT },
        arbeidUtlandet: { ...initiell.arbeidUtlandet, svar: jaHvis(arbeiderIEøsLand) },
        arbeidsperioderUtland: arbeiderIEøsLand ? [lagArbeidsperiodeIUtlandet(valg.eøsLand)] : [],
        pensjonUtland: { ...initiell.pensjonUtland, svar: ESvar.NEI },
        skriftligAvtaleOmDeltBosted: {
            ...initiell.skriftligAvtaleOmDeltBosted,
            svar: jaHvis(harAvvik(valg, Avvik.DELT_BOSTED)),
        },
        utvidet: {
            ...initiell.utvidet,
            søkerHarBoddMedAndreForelder: {
                ...initiell.utvidet.søkerHarBoddMedAndreForelder,
                svar: valg.scenario === Scenario.UTVIDET ? ESvar.NEI : null,
            },
        },
        ...(erEøsScenario(valg.scenario) && {
            idNummer: arbeiderIEøsLand ? [{ land: valg.eøsLand, idnummer: AlternativtSvarForInput.UKJENT }] : [],
            adresse: { ...initiell.adresse, svar: AlternativtSvarForInput.UKJENT },
            arbeidNorge: { ...initiell.arbeidNorge, svar: ESvar.NEI },
            pensjonNorge: { ...initiell.pensjonNorge, svar: ESvar.NEI },
            andreUtbetalinger: { ...initiell.andreUtbetalinger, svar: ESvar.NEI },
            pågåendeSøknadFraAnnetEøsLand: { ...initiell.pågåendeSøknadFraAnnetEøsLand, svar: ESvar.NEI },
            barnetrygdFraEøs: { ...initiell.barnetrygdFraEøs, svar: ESvar.NEI },
        }),
    };
};

const lagBarnMedISøknad = (barn: IBarn, indeks: number, valg: Valg): IBarnMedISøknad => {
    const initielt = genererInitialBarnMedISøknad(barn);
    const erFosterbarn = harAvvik(valg, Avvik.FOSTERBARN);
    const borIInstitusjon = harAvvik(valg, Avvik.INSTITUSJON);
    const harVærtUtenforNorge = harAvvik(valg, Avvik.BARNA_UTENFOR_NORGE);
    const fårBarnetrygdFraEøsLand = valg.scenario === Scenario.EØS_BARN;

    const borFastMedSøker = jaHvis(!harAvvik(valg, Avvik.BOR_IKKE_FAST_MED_SØKER));
    // Spørsmålet stilles ikke for fosterbarn og barn i institusjon, se useEøsForBarn.
    const borMedAndreForelder = erFosterbarn || borIInstitusjon ? null : ESvar.NEI;
    const spørOmOmsorgsperson = skalViseBorMedOmsorgsperson(
        borMedAndreForelder,
        borFastMedSøker,
        jaHvis(borIInstitusjon),
        ESvar.NEI,
        jaHvis(erFosterbarn)
    );

    return {
        ...initielt,
        barnErFyltUt: true,
        triggetEøs: fårBarnetrygdFraEøsLand || valg.scenario === Scenario.EØS_ANDRE_FORELDER,
        erFosterbarn: { ...initielt.erFosterbarn, svar: jaHvis(erFosterbarn) },
        erIBeredskapshjem: { ...initielt.erIBeredskapshjem, svar: ESvar.NEI },
        erAdoptertFraUtland: {
            ...initielt.erAdoptertFraUtland,
            svar: jaHvis(harAvvik(valg, Avvik.ADOPTERT_FRA_UTLANDET)),
        },
        erAsylsøker: { ...initielt.erAsylsøker, svar: jaHvis(harAvvik(valg, Avvik.BARNA_ER_ASYLSØKERE)) },
        andreForelderErDød: { ...initielt.andreForelderErDød, svar: ESvar.NEI },
        borFastMedSøker: { ...initielt.borFastMedSøker, svar: borFastMedSøker },
        barnetrygdFraAnnetEøsland: { ...initielt.barnetrygdFraAnnetEøsland, svar: jaHvis(fårBarnetrygdFraEøsLand) },
        oppholderSegIInstitusjon: { ...initielt.oppholderSegIInstitusjon, svar: jaHvis(borIInstitusjon) },
        ...(borIInstitusjon && {
            institusjonsnavn: { ...initielt.institusjonsnavn, svar: 'Testinstitusjonen' },
            institusjonsadresse: { ...initielt.institusjonsadresse, svar: 'Institusjonsveien 1' },
            institusjonspostnummer: { ...initielt.institusjonspostnummer, svar: '0150' },
            institusjonOppholdStartdato: { ...initielt.institusjonOppholdStartdato, svar: førsteIMåneden(1) },
            institusjonOppholdSluttdato: {
                ...initielt.institusjonOppholdSluttdato,
                svar: AlternativtSvarForInput.UKJENT,
            },
        }),
        boddMindreEnn12MndINorge: { ...initielt.boddMindreEnn12MndINorge, svar: jaHvis(harVærtUtenforNorge) },
        ...(harVærtUtenforNorge && {
            utenlandsperioder: [lagAvsluttetOppholdUtenforNorge()],
            planleggerÅBoINorge12Mnd: { ...initielt.planleggerÅBoINorge12Mnd, svar: ESvar.JA },
        }),
        // Søknaden spør ikke om den andre forelderen for fosterbarn, se genererOppdaterteBarn i OmBarnaDine.
        andreForelder: erFosterbarn ? null : lagAndreForelder(valg),
        // Spørsmålet om samme forelder vises for alle barn etter det første, se useOmBarnet.
        sammeForelderSomAnnetBarnMedId: {
            ...initielt.sammeForelderSomAnnetBarnMedId,
            svar: indeks === 0 || erFosterbarn ? null : AlternativtSvarForInput.ANNEN_FORELDER,
        },
        ...(fårBarnetrygdFraEøsLand && {
            pågåendeSøknadFraAnnetEøsLand: { ...initielt.pågåendeSøknadFraAnnetEøsLand, svar: ESvar.NEI },
            mottarEllerMottokEøsBarnetrygd: { ...initielt.mottarEllerMottokEøsBarnetrygd, svar: ESvar.JA },
            eøsBarnetrygdsperioder: [lagEøsBarnetrygdsperiode(valg.eøsLand)],
            idNummer: [{ land: valg.eøsLand, idnummer: AlternativtSvarForInput.UKJENT }],
        }),
        ...(erEøsScenario(valg.scenario) && {
            søkersSlektsforhold: { ...initielt.søkersSlektsforhold, svar: erFosterbarn ? '' : Slektsforhold.FORELDER },
            borMedAndreForelder: { ...initielt.borMedAndreForelder, svar: borMedAndreForelder },
            borMedOmsorgsperson: { ...initielt.borMedOmsorgsperson, svar: spørOmOmsorgsperson ? ESvar.NEI : null },
            // Barnets adresse spørres det bare om for fosterbarn, se useEøsForBarn.
            adresse: { ...initielt.adresse, svar: erFosterbarn ? AlternativtSvarForInput.UKJENT : '' },
        }),
    };
};

const lagSøker = (søker: ISøker, valg: Valg): ISøker => {
    const erUtvidet = valg.scenario === Scenario.UTVIDET;
    const arbeiderIEøsLand = valg.scenario === Scenario.EØS_SØKER;
    const harEøsSteg = erEøsScenario(valg.scenario);
    const harVærtUtenforNorge = harAvvik(valg, Avvik.SØKER_UTENFOR_NORGE);
    // Spørsmålet om adresse vises ikke for søkere uten registrert adresse eller med adressebeskyttelse, se useOmdeg.
    const spørOmAdresse = !!søker.adresse && !søker.adressebeskyttelse;

    return {
        ...søker,
        triggetEøs: arbeiderIEøsLand,
        borPåRegistrertAdresse: { ...søker.borPåRegistrertAdresse, svar: spørOmAdresse ? ESvar.JA : null },
        værtINorgeITolvMåneder: { ...søker.værtINorgeITolvMåneder, svar: jaHvis(!harVærtUtenforNorge) },
        utenlandsperioder: harVærtUtenforNorge ? [lagAvsluttetOppholdUtenforNorge()] : [],
        planleggerÅBoINorgeTolvMnd: {
            ...søker.planleggerÅBoINorgeTolvMnd,
            svar: harVærtUtenforNorge ? ESvar.JA : null,
        },
        erAsylsøker: { ...søker.erAsylsøker, svar: jaHvis(harAvvik(valg, Avvik.SØKER_ER_ASYLSØKER)) },
        arbeidIUtlandet: { ...søker.arbeidIUtlandet, svar: jaHvis(arbeiderIEøsLand) },
        arbeidsperioderUtland: arbeiderIEøsLand ? [lagArbeidsperiodeIUtlandet(valg.eøsLand)] : [],
        mottarUtenlandspensjon: { ...søker.mottarUtenlandspensjon, svar: ESvar.NEI },
        pensjonsperioderUtland: [],
        arbeidINorge: { ...søker.arbeidINorge, svar: harEøsSteg ? ESvar.NEI : null },
        arbeidsperioderNorge: [],
        pensjonNorge: { ...søker.pensjonNorge, svar: harEøsSteg ? ESvar.NEI : null },
        pensjonsperioderNorge: [],
        andreUtbetalinger: { ...søker.andreUtbetalinger, svar: harEøsSteg ? ESvar.NEI : null },
        andreUtbetalingsperioder: [],
        idNummer: arbeiderIEøsLand ? [{ land: valg.eøsLand, idnummer: ID_NUMMER }] : [],
        adresseISøkeperiode: {
            ...søker.adresseISøkeperiode,
            svar: arbeiderIEøsLand ? ADRESSE_I_SØKEPERIODEN : '',
        },
        utvidet: {
            ...søker.utvidet,
            spørsmål: {
                ...søker.utvidet.spørsmål,
                årsak: { ...søker.utvidet.spørsmål.årsak, svar: erUtvidet ? ÅRSAK_TIL_UTVIDET : '' },
                separertEnkeSkilt: {
                    ...søker.utvidet.spørsmål.separertEnkeSkilt,
                    // Spørsmålet vises bare for søkere som er registrert som gift, se useDinLivssituasjon.
                    svar: erUtvidet && søker.sivilstand.type === ESivilstand.GIFT ? ESvar.NEI : null,
                },
                separertEnkeSkiltUtland: { ...søker.utvidet.spørsmål.separertEnkeSkiltUtland, svar: null },
                separertEnkeSkiltDato: { ...søker.utvidet.spørsmål.separertEnkeSkiltDato, svar: '' },
                harSamboerNå: { ...søker.utvidet.spørsmål.harSamboerNå, svar: erUtvidet ? ESvar.NEI : null },
                hattAnnenSamboerForSøktPeriode: {
                    ...søker.utvidet.spørsmål.hattAnnenSamboerForSøktPeriode,
                    svar: erUtvidet ? ESvar.NEI : null,
                },
            },
            nåværendeSamboer: null,
            tidligereSamboere: [],
        },
    };
};

/**
 * Vedleggskravene søknaden ville satt for de samme svarene. Reglene er kopiert fra oppdaterSøknad i
 * useDinLivssituasjon, useOmBarnaDine og useOmBarnet, og leser svarene som er satt over. Kravene til meklingsattest og
 * dokumentasjon på separasjon, skilsmisse eller dødsfall utløses aldri av svarene verktøyet gir.
 */
const lagDokumentasjon = (dokumentasjon: IDokumentasjon, søker: ISøker, barna: IBarnMedISøknad[]): IDokumentasjon => {
    const barnDer = (gjelder: (barn: IBarnMedISøknad) => boolean) => barna.filter(gjelder).map(barn => barn.id);
    const ingenKrav = {
        ...dokumentasjon,
        gjelderForSøker: false,
        gjelderForBarnId: [],
        harSendtInn: false,
        opplastedeVedlegg: [],
    };

    switch (dokumentasjon.dokumentasjonsbehov) {
        case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
            return {
                ...ingenKrav,
                gjelderForBarnId: barnDer(barn => barn.andreForelder?.skriftligAvtaleOmDeltBosted.svar === ESvar.JA),
            };
        case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
            return {
                ...ingenKrav,
                gjelderForSøker: søker.erAsylsøker.svar === ESvar.JA,
                gjelderForBarnId: barnDer(barn => barn.erAsylsøker.svar === ESvar.JA),
            };
        case Dokumentasjonsbehov.ADOPSJON_DATO:
            return { ...ingenKrav, gjelderForBarnId: barnDer(barn => barn.erAdoptertFraUtland.svar === ESvar.JA) };
        case Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN:
            return {
                ...ingenKrav,
                gjelderForBarnId: barnDer(erBarnIFosterhjemEllerBeredskapshjem),
                beskrivelseSanityApiNavn: BeskrivelseSanityApiNavn.bekreftelseFraBarnevernetBarnetrygd,
            };
        case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
            return {
                ...ingenKrav,
                // Bekreftelse kreves når barnet bor fast hos søker uten å være registrert på søkerens adresse.
                gjelderForBarnId: barnDer(barn => barn.borFastMedSøker.svar === ESvar.JA && !barn.borMedSøker),
            };
        default:
            return ingenKrav;
    }
};

/**
 * Lager en ferdig utfylt søknad for den innloggede søkeren, med svar som passer til det valgte scenarioet og avvikene.
 *
 * `søknad` må være søknaden fra AppContext, slik at opplysningene om søkeren fra folkeregisteret er med.
 */
export const byggPreutfyltSøknad = (søknad: ISøknad, valg: Preutfyllingsvalg): ISøknad => {
    const ugyldigKombinasjon = finnUgyldigKombinasjon(valg);
    if (ugyldigKombinasjon) {
        throw new Error(ugyldigKombinasjon);
    }

    const ekstraBarn = valg.ekstraBarnIdent ? [lagEkstraBarn(valg.ekstraBarnIdent)] : [];
    const barna = [...valg.barn, ...ekstraBarn].map((barn, indeks) => lagBarnMedISøknad(barn, indeks, valg));
    const søker = lagSøker(søknad.søker, valg);

    // Spørsmålene i «Om barna dine» gjelder barna samlet, så svarene følger av det som er svart for hvert barn.
    const gjelderNoenAvBarna = (svaret: (barn: IBarnMedISøknad) => ESvar | null) =>
        jaHvis(barna.some(barn => svaret(barn) === ESvar.JA));

    return {
        ...søknad,
        søknadstype: valg.scenario === Scenario.UTVIDET ? ESøknadstype.UTVIDET : ESøknadstype.ORDINÆR,
        erEøs: erEøsScenario(valg.scenario),
        lestOgForståttBekreftelse: true,
        søker,
        barnInkludertISøknaden: barna,
        barnRegistrertManuelt: ekstraBarn,
        erNoenAvBarnaFosterbarn: {
            ...søknad.erNoenAvBarnaFosterbarn,
            svar: gjelderNoenAvBarna(barn => barn.erFosterbarn.svar),
        },
        erNoenAvBarnaIBeredskapshjem: {
            ...søknad.erNoenAvBarnaIBeredskapshjem,
            svar: gjelderNoenAvBarna(barn => barn.erIBeredskapshjem.svar),
        },
        oppholderBarnSegIInstitusjon: {
            ...søknad.oppholderBarnSegIInstitusjon,
            svar: gjelderNoenAvBarna(barn => barn.oppholderSegIInstitusjon.svar),
        },
        erBarnAdoptertFraUtland: {
            ...søknad.erBarnAdoptertFraUtland,
            svar: gjelderNoenAvBarna(barn => barn.erAdoptertFraUtland.svar),
        },
        søktAsylForBarn: { ...søknad.søktAsylForBarn, svar: gjelderNoenAvBarna(barn => barn.erAsylsøker.svar) },
        // Spørsmålet er om barna har vært sammenhengende i Norge, altså det motsatte av svaret for hvert barn.
        barnOppholdtSegTolvMndSammenhengendeINorge: {
            ...søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
            svar: jaHvis(!barna.some(barn => barn.boddMindreEnn12MndINorge.svar === ESvar.JA)),
        },
        mottarBarnetrygdForBarnFraAnnetEøsland: {
            ...søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
            svar: gjelderNoenAvBarna(barn => barn.barnetrygdFraAnnetEøsland.svar),
        },
        // Spørsmålet vises bare for søkere som er registrert som enke, enkemann eller gjenlevende partner.
        erAvdødPartnerForelder: {
            id:
                søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER
                    ? OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                    : OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder,
            svar: erEnkeEllerGjenlevende(søker) ? ESvar.NEI : null,
        },
        dokumentasjon: søknad.dokumentasjon.map(dokumentasjon => lagDokumentasjon(dokumentasjon, søker, barna)),
    };
};

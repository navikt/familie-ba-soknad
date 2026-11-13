import { ESvar } from '@navikt/familie-form-elements';
import type { Alpha3Code } from 'i18n-iso-countries';

import { Dokumentasjonsbehov } from '../../common/typer/kontrakt/dokumentasjon';
import { ESivilstand, ESøknadstype, Slektsforhold } from '../../common/typer/kontrakt/generelle';
import { ArbeidsperiodeSpørsmålsId } from '../components/Felleskomponenter/Arbeidsperiode/spørsmål';
import { BarnetrygdperiodeSpørsmålId } from '../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import type { IAndreForelder, IBarnMedISøknad } from '../typer/barn';
import type { IArbeidsperiode, IEøsBarnetrygdsperiode } from '../typer/perioder';
import type { IBarn, ISøker } from '../typer/person';
import { AlternativtSvarForInput } from '../typer/svar';
import type { ISøknad } from '../typer/søknad';
import { Årsak } from '../typer/utvidet';
import { genererInitialBarnMedISøknad, genererInitiellAndreForelder, hentUid } from '../utils/barn';

import { Scenario } from './scenario';

export interface Preutfyllingsvalg {
    scenario: Scenario;
    /** Id-ene til barna fra folkeregisteret (søknad.søker.barn) som skal være med i søknaden. */
    valgteBarnIder: string[];
    /** Fødselsnummer til et barn som ikke er i listen fra folkeregisteret, f.eks. et barn med adressebeskyttelse. */
    ekstraBarnIdent?: string;
    /** Landet som brukes i EØS-scenarioene. Må være et EØS-land i kodeverket. */
    eøsLand: Alpha3Code;
}

const NAVN_PÅ_EKSTRA_BARN = 'Barn Lagt Til Manuelt';
const NAVN_PÅ_ANDRE_FORELDER = 'Annen Forelder';
const ID_NUMMER = '010190-1234';
const ADRESSE_I_SØKEPERIODEN = 'Testveien 1, 0150 Oslo';

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

const lagEøsBarnetrygdsperiode = (land: Alpha3Code): IEøsBarnetrygdsperiode => ({
    mottarEøsBarnetrygdNå: { id: BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå, svar: ESvar.JA },
    barnetrygdsland: { id: BarnetrygdperiodeSpørsmålId.barnetrygdsland, svar: land },
    fraDatoBarnetrygdperiode: { id: BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode, svar: førsteJanuarIFjor() },
    tilDatoBarnetrygdperiode: { id: BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode, svar: '' },
    månedligBeløp: { id: BarnetrygdperiodeSpørsmålId.månedligBeløp, svar: '1000' },
});

const lagEkstraBarn = (ident: string): IBarn => ({
    id: hentUid(),
    navn: NAVN_PÅ_EKSTRA_BARN,
    ident,
    borMedSøker: undefined,
    alder: null,
    adressebeskyttelse: false,
});

const lagAndreForelder = ({ scenario, eøsLand }: Preutfyllingsvalg, harEøsSteg: boolean): IAndreForelder => {
    const initiell = genererInitiellAndreForelder(null, false);
    const arbeiderIUtlandet = scenario === Scenario.EØS_ANDRE_FORELDER;

    return {
        ...initiell,
        navn: { ...initiell.navn, svar: NAVN_PÅ_ANDRE_FORELDER },
        fnr: { ...initiell.fnr, svar: AlternativtSvarForInput.UKJENT },
        fødselsdato: { ...initiell.fødselsdato, svar: AlternativtSvarForInput.UKJENT },
        arbeidUtlandet: { ...initiell.arbeidUtlandet, svar: arbeiderIUtlandet ? ESvar.JA : ESvar.NEI },
        arbeidsperioderUtland: arbeiderIUtlandet ? [lagArbeidsperiodeIUtlandet(eøsLand)] : [],
        pensjonUtland: { ...initiell.pensjonUtland, svar: ESvar.NEI },
        skriftligAvtaleOmDeltBosted: { ...initiell.skriftligAvtaleOmDeltBosted, svar: ESvar.NEI },
        utvidet: {
            ...initiell.utvidet,
            søkerHarBoddMedAndreForelder: {
                ...initiell.utvidet.søkerHarBoddMedAndreForelder,
                svar: scenario === Scenario.UTVIDET ? ESvar.NEI : null,
            },
        },
        ...(harEøsSteg && {
            idNummer: arbeiderIUtlandet ? [{ land: eøsLand, idnummer: AlternativtSvarForInput.UKJENT }] : [],
            adresse: { ...initiell.adresse, svar: AlternativtSvarForInput.UKJENT },
            arbeidNorge: { ...initiell.arbeidNorge, svar: ESvar.NEI },
            pensjonNorge: { ...initiell.pensjonNorge, svar: ESvar.NEI },
            andreUtbetalinger: { ...initiell.andreUtbetalinger, svar: ESvar.NEI },
            pågåendeSøknadFraAnnetEøsLand: { ...initiell.pågåendeSøknadFraAnnetEøsLand, svar: ESvar.NEI },
            barnetrygdFraEøs: { ...initiell.barnetrygdFraEøs, svar: ESvar.NEI },
        }),
    };
};

const lagBarnMedISøknad = (barn: IBarn, indeks: number, valg: Preutfyllingsvalg): IBarnMedISøknad => {
    const { scenario, eøsLand } = valg;
    const initielt = genererInitialBarnMedISøknad(barn);
    const fårBarnetrygdFraAnnetEøsland = scenario === Scenario.EØS_BARN;
    const triggetEøs = scenario === Scenario.EØS_BARN || scenario === Scenario.EØS_ANDRE_FORELDER;
    const harEøsSteg = triggetEøs || scenario === Scenario.EØS_SØKER;

    return {
        ...initielt,
        barnErFyltUt: true,
        triggetEøs,
        erFosterbarn: { ...initielt.erFosterbarn, svar: ESvar.NEI },
        erIBeredskapshjem: { ...initielt.erIBeredskapshjem, svar: ESvar.NEI },
        erAdoptertFraUtland: { ...initielt.erAdoptertFraUtland, svar: ESvar.NEI },
        erAsylsøker: { ...initielt.erAsylsøker, svar: ESvar.NEI },
        oppholderSegIInstitusjon: { ...initielt.oppholderSegIInstitusjon, svar: ESvar.NEI },
        boddMindreEnn12MndINorge: { ...initielt.boddMindreEnn12MndINorge, svar: ESvar.NEI },
        andreForelderErDød: { ...initielt.andreForelderErDød, svar: ESvar.NEI },
        borFastMedSøker: { ...initielt.borFastMedSøker, svar: ESvar.JA },
        barnetrygdFraAnnetEøsland: {
            ...initielt.barnetrygdFraAnnetEøsland,
            svar: fårBarnetrygdFraAnnetEøsland ? ESvar.JA : ESvar.NEI,
        },
        // Spørsmålet om samme forelder vises for alle barn etter det første, se useOmBarnet.
        sammeForelderSomAnnetBarnMedId: {
            ...initielt.sammeForelderSomAnnetBarnMedId,
            svar: indeks === 0 ? null : AlternativtSvarForInput.ANNEN_FORELDER,
        },
        andreForelder: lagAndreForelder(valg, harEøsSteg),
        ...(fårBarnetrygdFraAnnetEøsland && {
            pågåendeSøknadFraAnnetEøsLand: { ...initielt.pågåendeSøknadFraAnnetEøsLand, svar: ESvar.NEI },
            mottarEllerMottokEøsBarnetrygd: { ...initielt.mottarEllerMottokEøsBarnetrygd, svar: ESvar.JA },
            eøsBarnetrygdsperioder: [lagEøsBarnetrygdsperiode(eøsLand)],
            idNummer: [{ land: eøsLand, idnummer: AlternativtSvarForInput.UKJENT }],
        }),
        ...(harEøsSteg && {
            søkersSlektsforhold: { ...initielt.søkersSlektsforhold, svar: Slektsforhold.FORELDER },
            borMedAndreForelder: { ...initielt.borMedAndreForelder, svar: ESvar.NEI },
            borMedOmsorgsperson: { ...initielt.borMedOmsorgsperson, svar: ESvar.NEI },
        }),
    };
};

const lagSøker = (søker: ISøker, { scenario, eøsLand }: Preutfyllingsvalg): ISøker => {
    const arbeiderIUtlandet = scenario === Scenario.EØS_SØKER;
    const harEøsSteg = scenario !== Scenario.ORDINÆR && scenario !== Scenario.UTVIDET;
    const erUtvidet = scenario === Scenario.UTVIDET;
    const spørsmålOmAdresseVises = !!søker.adresse && !søker.adressebeskyttelse;

    return {
        ...søker,
        triggetEøs: arbeiderIUtlandet,
        borPåRegistrertAdresse: {
            ...søker.borPåRegistrertAdresse,
            svar: spørsmålOmAdresseVises ? ESvar.JA : null,
        },
        værtINorgeITolvMåneder: { ...søker.værtINorgeITolvMåneder, svar: ESvar.JA },
        planleggerÅBoINorgeTolvMnd: { ...søker.planleggerÅBoINorgeTolvMnd, svar: null },
        utenlandsperioder: [],
        erAsylsøker: { ...søker.erAsylsøker, svar: ESvar.NEI },
        arbeidIUtlandet: { ...søker.arbeidIUtlandet, svar: arbeiderIUtlandet ? ESvar.JA : ESvar.NEI },
        arbeidsperioderUtland: arbeiderIUtlandet ? [lagArbeidsperiodeIUtlandet(eøsLand)] : [],
        mottarUtenlandspensjon: { ...søker.mottarUtenlandspensjon, svar: ESvar.NEI },
        pensjonsperioderUtland: [],
        arbeidINorge: { ...søker.arbeidINorge, svar: harEøsSteg ? ESvar.NEI : null },
        arbeidsperioderNorge: [],
        pensjonNorge: { ...søker.pensjonNorge, svar: harEøsSteg ? ESvar.NEI : null },
        pensjonsperioderNorge: [],
        andreUtbetalinger: { ...søker.andreUtbetalinger, svar: harEøsSteg ? ESvar.NEI : null },
        andreUtbetalingsperioder: [],
        idNummer: arbeiderIUtlandet ? [{ land: eøsLand, idnummer: ID_NUMMER }] : [],
        adresseISøkeperiode: {
            ...søker.adresseISøkeperiode,
            svar: arbeiderIUtlandet ? ADRESSE_I_SØKEPERIODEN : '',
        },
        utvidet: {
            ...søker.utvidet,
            spørsmål: {
                ...søker.utvidet.spørsmål,
                årsak: { ...søker.utvidet.spørsmål.årsak, svar: erUtvidet ? Årsak.SKILT : '' },
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
 * Lager en ferdig utfylt søknad for den innloggede søkeren, med svar som passer til det valgte scenarioet.
 *
 * `søknad` må være søknaden fra AppContext, slik at søkeren og barna fra folkeregisteret er med.
 */
export const byggPreutfyltSøknad = (søknad: ISøknad, valg: Preutfyllingsvalg): ISøknad => {
    const { scenario, valgteBarnIder, ekstraBarnIdent } = valg;

    const ekstraBarn = ekstraBarnIdent ? [lagEkstraBarn(ekstraBarnIdent)] : [];
    const barnMedISøknad = [...søknad.søker.barn.filter(barn => valgteBarnIder.includes(barn.id)), ...ekstraBarn].map(
        (barn, indeks) => lagBarnMedISøknad(barn, indeks, valg)
    );

    const søker = lagSøker(søknad.søker, valg);
    const fårBarnetrygdFraAnnetEøsland = scenario === Scenario.EØS_BARN;

    return {
        ...søknad,
        søknadstype: scenario === Scenario.UTVIDET ? ESøknadstype.UTVIDET : ESøknadstype.ORDINÆR,
        erEøs: scenario !== Scenario.ORDINÆR && scenario !== Scenario.UTVIDET,
        lestOgForståttBekreftelse: true,
        søker,
        barnInkludertISøknaden: barnMedISøknad,
        barnRegistrertManuelt: ekstraBarn,
        erNoenAvBarnaFosterbarn: { ...søknad.erNoenAvBarnaFosterbarn, svar: ESvar.NEI },
        erNoenAvBarnaIBeredskapshjem: { ...søknad.erNoenAvBarnaIBeredskapshjem, svar: ESvar.NEI },
        oppholderBarnSegIInstitusjon: { ...søknad.oppholderBarnSegIInstitusjon, svar: ESvar.NEI },
        erBarnAdoptertFraUtland: { ...søknad.erBarnAdoptertFraUtland, svar: ESvar.NEI },
        søktAsylForBarn: { ...søknad.søktAsylForBarn, svar: ESvar.NEI },
        barnOppholdtSegTolvMndSammenhengendeINorge: {
            ...søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
            svar: ESvar.JA,
        },
        mottarBarnetrygdForBarnFraAnnetEøsland: {
            ...søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
            svar: fårBarnetrygdFraAnnetEøsland ? ESvar.JA : ESvar.NEI,
        },
        // Spørsmålet vises bare for søkere som er registrert som enke, enkemann eller gjenlevende partner.
        erAvdødPartnerForelder: {
            id:
                søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER
                    ? OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder
                    : OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder,
            svar: erEnkeEllerGjenlevende(søker) ? ESvar.NEI : null,
        },
        dokumentasjon: søknad.dokumentasjon.map(dokumentasjon => ({
            ...dokumentasjon,
            gjelderForSøker: false,
            harSendtInn: false,
            opplastedeVedlegg: [],
            // Samme regel som i useOmBarnet: bekreftelse kreves når barnet ikke er registrert på søkerens adresse.
            gjelderForBarnId:
                dokumentasjon.dokumentasjonsbehov === Dokumentasjonsbehov.BOR_FAST_MED_SØKER
                    ? barnMedISøknad.filter(barn => !barn.borMedSøker).map(barn => barn.id)
                    : [],
        })),
    };
};

import { IDinLivssituasjonTekstinnhold } from '../../components/SøknadsSteg/DinLivssituasjon/innholdTyper';
import { IDokumentasjonTekstinnhold } from '../../components/SøknadsSteg/Dokumentasjon/innholdTyper';
import { IEøsForBarnTekstinnhold } from '../../components/SøknadsSteg/EøsSteg/Barn/innholdTyper';
import { IEøsForSøkerTekstinnhold } from '../../components/SøknadsSteg/EøsSteg/Søker/innholdTyper';
import { IKvitteringTekstinnhold } from '../../components/SøknadsSteg/Kvittering/innholdTyper';
import { IOmBarnaTekstinnhold } from '../../components/SøknadsSteg/OmBarnaDine/innholdTyper';
import { IOmBarnetTekstinnhold } from '../../components/SøknadsSteg/OmBarnet/innholdTyper';
import { IOmDegTekstinnhold } from '../../components/SøknadsSteg/OmDeg/innholdTyper';
import { IOppsummeringTekstinnhold } from '../../components/SøknadsSteg/Oppsummering/innholdTyper';
import { IVelgBarnTekstinnhold } from '../../components/SøknadsSteg/VelgBarn/innholdTyper';

import { IAndreUtbetalingerTekstinnhold } from './modaler/andreUtbetalinger';
import { IArbeidsperiodeTekstinnhold } from './modaler/arbeidsperiode';
import { IBarnetrygdsperiodeTekstinnhold } from './modaler/barnetrygdperiode';
import { IBlokkerTilbakeknappTekstinnhold } from './modaler/blokkerTilbakeknapp';
import { ILeggTilBarnTekstinnhold } from './modaler/leggTilBarn';
import { IPensjonsperiodeTekstinnhold } from './modaler/pensjonsperiode';
import { IStartPåNyttModal } from './modaler/startPåNytt';
import { ISvalbardOppholdTekstinnhold } from './modaler/svalbardOpphold';
import { ITidligereSamoboereTekstinnhold } from './modaler/tidligereSamboere';
import { IUtenlandsoppholdTekstinnhold } from './modaler/utenlandsopphold';
import {
    ESanitySteg,
    ISanitySpørsmålDokument,
    LocaleRecordBlock,
    LocaleRecordString,
} from './sanity';

export enum SanityPersonType {
    ANDRE_FORELDER = 'ANDRE_FORELDER',
    SOKER = 'SOKER',
    OMSORGSPERSON = 'OMSORGSPERSON',
    BARN = 'BARN',
}

export enum SanityModalPrefix {
    ARBEIDSPERIODE = 'MODAL_ARBEIDSPERIODE',
    BARNETRYGDSPERIODE = 'MODAL_BARNETRYGDSPERIODE',
    PENSJONSPERIODE = 'MODAL_PENSJONSPERIODE',
    ANDRE_UTBETALINGER = 'MODAL_ANDRE_UTBETALINGER',
    TIDLIGERE_SAMBOERE = 'MODAL_TIDLIGERE_SAMBOERE',
    UTENLANDSOPPHOLD = 'MODAL_UTENLANDSOPPHOLD',
    START_PAA_NYTT = 'MODAL_START_PAA_NYTT',
    LEGG_TIL_BARN = 'MODAL_LEGG_TIL_BARN',
    SVALBARDOPPHOLD = 'MODAL_SVALBARDOPPHOLD',
    BLOKKER_TILBAKEKNAPP = 'MODAL_BLOKKER_TILBAKE_KNAPP',
}

export interface ITekstinnhold {
    [ESanitySteg.FORSIDE]: IForsideTekstinnhold;
    [ESanitySteg.OM_DEG]: IOmDegTekstinnhold;
    [ESanitySteg.DIN_LIVSSITUASJON]: IDinLivssituasjonTekstinnhold;
    [ESanitySteg.VELG_BARN]: IVelgBarnTekstinnhold;
    [ESanitySteg.OM_BARNET]: IOmBarnetTekstinnhold;
    [ESanitySteg.OM_BARNA]: IOmBarnaTekstinnhold;
    [ESanitySteg.EØS_FOR_SØKER]: IEøsForSøkerTekstinnhold;
    [ESanitySteg.EØS_FOR_BARN]: IEøsForBarnTekstinnhold;
    [ESanitySteg.OPPSUMMERING]: IOppsummeringTekstinnhold;
    [ESanitySteg.DOKUMENTASJON]: IDokumentasjonTekstinnhold;
    [ESanitySteg.KVITTERING]: IKvitteringTekstinnhold;
    [ESanitySteg.FELLES]: IFellesTekstInnhold;
}

export interface IFellesTekstInnhold {
    frittståendeOrd: IFrittståendeOrdTekstinnhold;
    modaler: IModalerTekstinnhold;
    navigasjon: INavigasjonTekstinnhold;
    formateringsfeilmeldinger: IFormateringsfeilmeldingerTekstinnhold;
    vedlikeholdsarbeid: IVedlikeholdsarbeidTekstinnhold;
    kanIkkeBrukeSoeknad: IKanIkkeBrukeSoeknadTekstinnhold;
    hjelpeteksterForInput: IHjelpeteksterForInputTekstInnhold;
}

export interface IFrittståendeOrdTekstinnhold {
    i: LocaleRecordString;
    utenfor: LocaleRecordString;
    barn: LocaleRecordString;
    navn: LocaleRecordString;
    utlandet: LocaleRecordString;
    norge: LocaleRecordString;
    ja: LocaleRecordString;
    nei: LocaleRecordString;
    jegVetIkke: LocaleRecordString;
    barnetrygd: LocaleRecordString;
    skjult: LocaleRecordString;
    av: LocaleRecordString;
    steg: LocaleRecordString;
    visAlleSteg: LocaleRecordString;
    skjulAlleSteg: LocaleRecordString;
    fra: LocaleRecordString;
    utenlandsopphold: LocaleRecordString;
    arbeidsperioder: LocaleRecordString;
    pensjonsperioder: LocaleRecordString;
    tidligereSamboere: LocaleRecordString;
    barnetrygdperioder: LocaleRecordString;
    utbetalingsperioder: LocaleRecordString;
    vedlegg: LocaleRecordString;
    vedleggMedFeil: LocaleRecordString;
    slipp: LocaleRecordString;
    eller: LocaleRecordString;
    og: LocaleRecordString;
    soeker: LocaleRecordString;
}

export interface INavigasjonTekstinnhold {
    startKnapp: LocaleRecordString;
    fortsettKnapp: LocaleRecordString;
    startPaaNyttKnapp: LocaleRecordString;
    duMaaRetteOppFoelgende: LocaleRecordString;
    avbrytSoeknad: LocaleRecordString;
    tilbakeKnapp: LocaleRecordString;
    gaaVidereKnapp: LocaleRecordString;
    sendSoeknadKnapp: LocaleRecordString;
    slettSoeknadKnapp: LocaleRecordString;
    fortsettSenereKnapp: LocaleRecordString;
}

export interface IFormateringsfeilmeldingerTekstinnhold {
    ugyldigIDnummer: LocaleRecordString;
    ugyldigFoedselsnummer: LocaleRecordString;
    ugyldigRelasjon: LocaleRecordString;
    ugyldigPostnummer: LocaleRecordString;
    ugyldigDato: LocaleRecordString;
    datoKanIkkeVaereFremITid: LocaleRecordString;
    datoKanIkkeVaereDagensDatoEllerFremITid: LocaleRecordString;
    periodeAvsluttesForTidlig: LocaleRecordString;
    datoKanIkkeVaereTilbakeITid: LocaleRecordString;
    datoKanIkkeVaere12MndTilbake: LocaleRecordString;
    ugyldigManed: LocaleRecordString;
    datoErForForsteGyldigeTidspunkt: LocaleRecordString;
    datoErEtterSisteGyldigeTidspunkt: LocaleRecordString;
    datoKanIkkeVareIFortid: LocaleRecordString;
    datoKanIkkeVareIFremtid: LocaleRecordString;
}

export interface IModalerTekstinnhold {
    arbeidsperiode: {
        søker: IArbeidsperiodeTekstinnhold;
        andreForelder: IArbeidsperiodeTekstinnhold;
        omsorgsperson: IArbeidsperiodeTekstinnhold;
    };
    barnetrygdsperiode: {
        søker: IBarnetrygdsperiodeTekstinnhold;
        andreForelder: IBarnetrygdsperiodeTekstinnhold;
        omsorgsperson: IBarnetrygdsperiodeTekstinnhold;
    };
    pensjonsperiode: {
        søker: IPensjonsperiodeTekstinnhold;
        andreForelder: IPensjonsperiodeTekstinnhold;
        omsorgsperson: IPensjonsperiodeTekstinnhold;
    };
    andreUtbetalinger: {
        søker: IAndreUtbetalingerTekstinnhold;
        andreForelder: IAndreUtbetalingerTekstinnhold;
        omsorgsperson: IAndreUtbetalingerTekstinnhold;
    };
    tidligereSamboere: {
        søker: ITidligereSamoboereTekstinnhold;
    };
    utenlandsopphold: {
        søker: IUtenlandsoppholdTekstinnhold;
        barn: IUtenlandsoppholdTekstinnhold;
        andreForelder: IUtenlandsoppholdTekstinnhold;
    };
    svalbardOpphold: {
        søker: ISvalbardOppholdTekstinnhold;
        barn: ISvalbardOppholdTekstinnhold;
    };
    startPåNytt: IStartPåNyttModal;
    leggTilBarn: ILeggTilBarnTekstinnhold;
    blokkerTilbakeknapp: IBlokkerTilbakeknappTekstinnhold;
}

export interface IForsideTekstinnhold {
    bekreftelsesboksTittel: LocaleRecordString;
    bekreftelsesboksBroedtekst: LocaleRecordBlock;
    bekreftelsesboksErklaering: LocaleRecordString;
    bekreftelsesboksFeilmelding: LocaleRecordString;
    soeknadstittelBarnetrygd: LocaleRecordBlock;
    veilederHei: LocaleRecordBlock;
    veilederIntro: LocaleRecordBlock;
    foerDuSoekerTittel: LocaleRecordBlock;
    foerDuSoeker: LocaleRecordBlock;
    informasjonOmPlikter: LocaleRecordBlock;
    informasjonOmPlikterTittel: LocaleRecordBlock;
    informasjonOmPersonopplysninger: LocaleRecordBlock;
    informasjonOmPersonopplysningerTittel: LocaleRecordBlock;
    informasjonOmLagringAvSvar: LocaleRecordBlock;
    informasjonOmLagringAvSvarTittel: LocaleRecordBlock;
    utvidetBarnetrygdAlert: LocaleRecordBlock;
    soekerDuUtvidet: ISanitySpørsmålDokument;
    mellomlagretAlert: LocaleRecordBlock;
}

export interface IVedlikeholdsarbeidTekstinnhold {
    vedlikeholdTittel: LocaleRecordBlock;
    vedlikeholdBroedtekst: LocaleRecordBlock;
    vedlikeholdVeileder: LocaleRecordBlock;
}

export interface IKanIkkeBrukeSoeknadTekstinnhold {
    brukPDFKontantstoette: LocaleRecordBlock;
}

export interface IHjelpeteksterForInputTekstInnhold {
    datoformatHjelpetekst: LocaleRecordBlock;
    datoformatPlaceholder: LocaleRecordBlock;
    manedformatHjelpetekst: LocaleRecordBlock;
    manedformatPlaceholder: LocaleRecordBlock;
    velgLandPlaceholder: LocaleRecordBlock;
}

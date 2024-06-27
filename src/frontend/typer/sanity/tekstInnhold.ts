import { IAndreUtbetalingerTekstinnhold } from './modaler/andreUtbetalinger';
import { IArbeidsperiodeTekstinnhold } from './modaler/arbeidsperiode';
import { IBarnetrygdsperiodeTekstinnhold } from './modaler/barnetrygdperiode';
import { IPensjonsperiodeTekstinnhold } from './modaler/pensjonsperiode';
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
}

export enum SanityModalPrefix {
    ARBEIDSPERIODE = 'MODAL_ARBEIDSPERIODE',
    BARNETRYGDSPERIODE = 'MODAL_BARNETRYGDSPERIODE',
    PENSJONSPERIODE = 'MODAL_PENSJONSPERIODE',
    ANDRE_UTBETALINGER = 'MODAL_ANDRE_UTBETALINGER',
    TIDLIGERE_SAMBOERE = 'MODAL_TIDLIGERE_SAMBOERE',
    UTENLANDSOPPHOLD = 'MODAL_UTENLANDSOPPHOLD',
}

export interface ITekstinnhold {
    [ESanitySteg.FORSIDE]: IForsideTekstinnhold;
    [ESanitySteg.FELLES]: IFellesTekstInnhold;
}

export interface IFellesTekstInnhold {
    frittståendeOrd: IFrittståendeOrdTekstinnhold;
    modaler: IModalerTekstinnhold;
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
    barnetrygd: LocaleRecordString;
}

export interface IModalerTekstinnhold {
    arbeidsperiode: {
        søker: IArbeidsperiodeTekstinnhold;
        andreForelder: IArbeidsperiodeTekstinnhold;
        omsorgsperson: IArbeidsperiodeTekstinnhold;
    };
    // TODO: Må legge til Modaler i Sanity
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
    // TODO: Må legge til Modaler i Sanity
    tidligereSamboere: {
        søker: ITidligereSamoboereTekstinnhold;
    };
    utenlandsopphold: {
        søker: IUtenlandsoppholdTekstinnhold;
        barn: IUtenlandsoppholdTekstinnhold;
        andreForelder: IUtenlandsoppholdTekstinnhold;
    };
}

export interface IForsideTekstinnhold {
    soeknadstittelBarnetrygd: LocaleRecordBlock;
    veilederHei: LocaleRecordBlock;
    veilederIntro: LocaleRecordBlock;
    informasjonOmPlikter: LocaleRecordBlock;
    informasjonOmPlikterTittel: LocaleRecordBlock;
    informasjonOmPersonopplysninger: LocaleRecordBlock;
    informasjonOmPersonopplysningerTittel: LocaleRecordBlock;
    utvidetBarnetrygdAlert: LocaleRecordBlock;
    soekerDuUtvidet: ISanitySpørsmålDokument;
}

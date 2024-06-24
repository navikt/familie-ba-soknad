import { IAndreUtbetalingerTekstinnhold } from './modaler/andreUtbetalinger';
import { IArbeidsperiodeTekstinnhold } from './modaler/arbeidsperiode';
import { IPensjonsperiodeTekstinnhold } from './modaler/pensjonsperiode';
import {
    ESanitySteg,
    ISanitySpørsmålDokument,
    LocaleRecordBlock,
    LocaleRecordString,
} from './sanity';

export enum SanityPersonType {
    SOKER = 'SOKER',
}

export enum SanityModalPrefix {
    ARBEIDSPERIODE = 'MODAL_ARBEIDSPERIODE',
    ANDRE_UTBETALINGER = 'MODAL_ANDRE_UTBETALINGER',
    PENSJONSPERIODE = 'MODAL_PENSJONSPERIODE',
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
    ja: LocaleRecordString;
    nei: LocaleRecordString;
    barnetrygd: LocaleRecordString;
}

export interface IModalerTekstinnhold {
    arbeidsperiode: {
        søker: IArbeidsperiodeTekstinnhold;
    };
    pensjonsperiode: {
        søker: IPensjonsperiodeTekstinnhold;
    };
    andreUtbetalinger: {
        søker: IAndreUtbetalingerTekstinnhold;
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

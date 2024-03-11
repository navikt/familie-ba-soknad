import { ESanitySteg, ISanitySpørsmålDokument, LocaleRecordBlock } from './sanity';

export interface ITekstinnhold {
    [ESanitySteg.FORSIDE]: IForsideTekstinnhold;
    [ESanitySteg.FELLES]: IFellesTekstInnhold;
}

export interface IFellesTekstInnhold {
    frittståendeOrd: IFrittståendeOrdTekstinnhold;
}

export interface IFrittståendeOrdTekstinnhold {
    ja: LocaleRecordBlock;
    nei: LocaleRecordBlock;
    utenfor: LocaleRecordBlock;
    i: LocaleRecordBlock;
    utlandet: LocaleRecordBlock;
    norge: LocaleRecordBlock;
}

export interface IForsideTekstinnhold {
    soekerDuUtvidet: ISanitySpørsmålDokument;
}

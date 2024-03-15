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
    barnetrygd: LocaleRecordBlock;
}

export interface IForsideTekstinnhold {
    veilederHei: LocaleRecordBlock;
    veilederIntro: LocaleRecordBlock;
    informasjonOmPlikter: LocaleRecordBlock;
    informasjonOmPlikterTittel: LocaleRecordBlock;
    informasjonOmPersonopplysninger: LocaleRecordBlock;
    informasjonOmPersonopplysningerTittel: LocaleRecordBlock;
    utvidetBarnetrygdAlert: LocaleRecordBlock;
    soekerDuUtvidet: ISanitySpørsmålDokument;
    bekreftelsesboksBroedtekst: LocaleRecordBlock;
    bekreftelsesboksErklaering: LocaleRecordBlock;
    bekreftelsesboksTittel: LocaleRecordBlock;
    bekreftelsesboksFeilmelding: LocaleRecordBlock;
}

import {
    ESanitySteg,
    ISanitySpørsmålDokument,
    LocaleRecordBlock,
    LocaleRecordString,
} from './sanity';

export interface ITekstinnhold {
    [ESanitySteg.FORSIDE]: IForsideTekstinnhold;
    [ESanitySteg.FELLES]: IFellesTekstInnhold;
}

export interface IFellesTekstInnhold {
    frittståendeOrd: IFrittståendeOrdTekstinnhold;
    formateringsfeilmeldinger: IFormateringsfeilmeldingerTekstinnhold;
}

export interface IFrittståendeOrdTekstinnhold {
    ja: LocaleRecordString;
    nei: LocaleRecordString;
    barnetrygd: LocaleRecordString;
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

export interface IFormateringsfeilmeldingerTekstinnhold {
    datoErEtterSisteGyldigeTidspunkt: LocaleRecordString;
    datoErForForsteGyldigeTidspunkt: LocaleRecordString;
    ugyldigManed: LocaleRecordString;
}

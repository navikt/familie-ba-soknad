import {
    ERegistrertBostedType,
    IAndreForelderIKontraktFormat,
    ISøknadsfelt,
    IUtenlandsperiodeIKontraktFormat,
    SpørsmålMap,
} from './generelle';

export interface ISøknadKontraktBarn {
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    registrertBostedType: ISøknadsfelt<ERegistrertBostedType>;
    alder: ISøknadsfelt<string>;
    spørsmål: SpørsmålMap;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];
    andreForelder: IAndreForelderIKontraktFormat | null;
}

export enum Slektsforhold {
    FORELDER = 'FORELDER',
    ONKEL_ELLER_TANTE = 'ONKEL_ELLER_TANTE',
    BESTEFORELDER = 'BESTEFORELDER',
    ANNEN_FAMILIERELASJON = 'ANNEN_FAMILIERELASJON',
    ANNEN_RELASJON = 'ANNEN_RELASJON',
}

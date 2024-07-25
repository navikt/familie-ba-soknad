import { IBarnMedISøknad } from './barn';

export enum PersonType {
    AndreForelder = 'andreForelder',
    Omsorgsperson = 'omsorgsperson',
    Søker = 'søker',
    Barn = 'barn',
}

export type PeriodePersonTypeMedBarnProps =
    | { personType: PersonType.Søker; erDød?: boolean; barn?: IBarnMedISøknad | undefined }
    | { personType: PersonType.Omsorgsperson; erDød?: boolean; barn: IBarnMedISøknad | undefined }
    | { personType: PersonType.AndreForelder; erDød?: boolean; barn: IBarnMedISøknad | undefined }
    | { personType: PersonType.Barn; erDød?: boolean; barn?: IBarnMedISøknad | undefined };

export type PeriodePersonTypeProps =
    | { personType: PersonType.Søker; erDød?: never }
    | { personType: PersonType.Omsorgsperson; erDød?: never }
    | { personType: PersonType.AndreForelder; erDød: boolean };

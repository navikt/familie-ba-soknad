import { ISøknadKontraktDokumentasjon } from '../typer/dokumentasjon';
import {
    ESøknadstype,
    IKontraktNåværendeSamboer,
    IKontraktTidligereSamboer,
    ISøknadKontrakt,
    ISøknadKontraktBarn,
    ISøknadKontraktSøker,
    ISøknadsfelt,
    SpørsmålMap,
} from '../typer/søknad';

const utvidetForSøkerErGyldig = (
    input?: ISøknadsfelt<{
        tidligereSamboere: IKontraktTidligereSamboer[];
        nåværendeSamboer: IKontraktNåværendeSamboer | null;
        spørsmål: SpørsmålMap;
    }>
): boolean => !!(input && input.verdi);

export const erGyldigISøknadKontraktSøker = (
    input: ISøknadKontraktSøker
): input is ISøknadKontraktSøker =>
    !!(input.ident && input.navn && input.statsborgerskap && input.adresse && input.sivilstand);

export const erGyldigSøkerForUtvidet = (
    input: ISøknadKontraktSøker
): input is ISøknadKontraktSøker =>
    input && erGyldigISøknadKontraktSøker(input) && utvidetForSøkerErGyldig(input.utvidet);

export const erGyldigISøknadsKontraktBarn = (
    input: ISøknadKontraktBarn
): input is ISøknadKontraktBarn =>
    !!(input && input.ident && input.navn && input.borMedSøker && input.alder && input.spørsmål);

export const erGyldigISøknadsKontraktBarnUtvidet = (
    input: ISøknadKontraktBarn
): input is ISøknadKontraktBarn => {
    return !!(input && erGyldigISøknadsKontraktBarn(input) && input.utvidet);
};

export const erGyldigeBarnUtvidet = (
    input: ISøknadKontraktBarn[]
): input is ISøknadKontraktBarn[] =>
    input &&
    Array.isArray(input) &&
    input.map(erGyldigISøknadsKontraktBarnUtvidet).reduce((prev, curr) => !!(prev && curr), true);

export const erGyldigDokumentasjonUtvidet = (
    input: ISøknadKontraktDokumentasjon[]
): input is ISøknadKontraktDokumentasjon[] => {
    // TODO
    return true;
};

export const erGyldigUtvidetISøknadKontrakt = (input: ISøknadKontrakt): input is ISøknadKontrakt =>
    !!(
        input &&
        input.søknadstype &&
        input.søknadstype === ESøknadstype.UTVIDET &&
        erGyldigSøkerForUtvidet(input.søker) &&
        erGyldigeBarnUtvidet(input.barn) &&
        erGyldigDokumentasjonUtvidet(input.dokumentasjon)
    );

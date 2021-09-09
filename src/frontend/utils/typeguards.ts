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

interface ISøkerUtvidetFelter {
    tidligereSamboere: ISøknadsfelt<IKontraktTidligereSamboer>[];
    nåværendeSamboer: ISøknadsfelt<IKontraktNåværendeSamboer> | null;
    spørsmål: SpørsmålMap;
}

export const erGyldigIKontraktNåværendeSamboer = (
    input: IKontraktNåværendeSamboer
): input is IKontraktNåværendeSamboer =>
    !!(input && input.navn && input.ident && input.fødselsdato && input.samboerFraDato);

export const erGyldigNåværendeSamboer = (
    harSamboerNå: ISøknadsfelt<string>,
    nåværendeSamboer: ISøknadsfelt<IKontraktNåværendeSamboer> | null
): boolean => {
    if (harSamboerNå.verdi === 'NEI') {
        return true;
    }
    if (
        harSamboerNå.verdi === 'JA' &&
        nåværendeSamboer &&
        nåværendeSamboer.verdi &&
        erGyldigIKontraktNåværendeSamboer(nåværendeSamboer.verdi)
    ) {
        return true;
    }
    return false;
};

export const erGyldigIKontraktTidligereSamboer = (
    input: IKontraktTidligereSamboer
): input is IKontraktTidligereSamboer =>
    !!(input && erGyldigIKontraktNåværendeSamboer(input) && input.samboerTilDato);

export const erGyldigTidligereSamboere = (input: ISøkerUtvidetFelter): boolean =>
    input &&
    input.tidligereSamboere &&
    Array.isArray(input.tidligereSamboere) &&
    input.tidligereSamboere
        .map(tidligereSamboerSøknadsfelt =>
            erGyldigIKontraktTidligereSamboer(tidligereSamboerSøknadsfelt.verdi)
        )
        .reduce((prev, curr) => !!(prev && curr), true);

export const utvidetForSøkerErGyldig = (input?: ISøknadsfelt<ISøkerUtvidetFelter>): boolean =>
    !!(
        input &&
        input.verdi &&
        input.verdi.spørsmål &&
        input.verdi.spørsmål.harSamboerNå &&
        erGyldigNåværendeSamboer(input.verdi.spørsmål.harSamboerNå, input.verdi.nåværendeSamboer) &&
        erGyldigTidligereSamboere(input.verdi)
    );

export const erGyldigISøknadKontraktSøker = (
    input: ISøknadKontraktSøker
): input is ISøknadKontraktSøker =>
    !!(input.ident && input.navn && input.statsborgerskap && input.adresse && input.sivilstand);

export const erGyldigISøknadKontraktSøkerUtvidet = (
    input: ISøknadKontraktSøker
): input is ISøknadKontraktSøker =>
    input && erGyldigISøknadKontraktSøker(input) && utvidetForSøkerErGyldig(input.utvidet);

export const erGyldigISøknadsKontraktBarn = (
    input: ISøknadKontraktBarn
): input is ISøknadKontraktBarn =>
    !!(input && input.ident && input.navn && input.borMedSøker && input.alder && input.spørsmål);

export const erGyldigISøknadsKontraktBarnUtvidet = (
    input: ISøknadKontraktBarn
): input is ISøknadKontraktBarn =>
    !!(input && erGyldigISøknadsKontraktBarn(input) && input.utvidet);

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

export const erGyldigISøknadKontraktUtvidet = (input: ISøknadKontrakt): input is ISøknadKontrakt =>
    !!(
        input &&
        input.søknadstype &&
        input.søknadstype === ESøknadstype.UTVIDET &&
        erGyldigISøknadKontraktSøkerUtvidet(input.søker) &&
        erGyldigeBarnUtvidet(input.barn) &&
        erGyldigDokumentasjonUtvidet(input.dokumentasjon)
    );

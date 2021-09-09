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

export const erGyldigIKontraktNåværendeSamboer = (input): input is IKontraktNåværendeSamboer =>
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

export const erGyldigIKontraktTidligereSamboer = (input): input is IKontraktTidligereSamboer =>
    !!(input && input.samboerTilDato && erGyldigIKontraktNåværendeSamboer(input));

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

export const erGyldigISøknadKontraktSøker = (input): input is ISøknadKontraktSøker =>
    !!(input.ident && input.navn && input.statsborgerskap && input.adresse && input.sivilstand);

export const erGyldigISøknadKontraktSøkerUtvidet = (input): input is ISøknadKontraktSøker =>
    input && erGyldigISøknadKontraktSøker(input) && utvidetForSøkerErGyldig(input.utvidet);

export const erGyldigISøknadsKontraktBarn = (input): input is ISøknadKontraktBarn =>
    !!(input && input.ident && input.navn && input.borMedSøker && input.alder && input.spørsmål);

export const erGyldigISøknadsKontraktBarnUtvidet = (input): input is ISøknadKontraktBarn =>
    !!(input && erGyldigISøknadsKontraktBarn(input) && input.utvidet);

export const erGyldigeBarnUtvidet = (input): input is ISøknadKontraktBarn[] =>
    input &&
    Array.isArray(input) &&
    input.map(erGyldigISøknadsKontraktBarnUtvidet).reduce((prev, curr) => !!(prev && curr), true);

export const erGyldigISøknadKontraktDokumentasjon = (
    input
): input is ISøknadKontraktDokumentasjon =>
    input.dokumentasjonsbehov && input.harSendtInn !== undefined && input.opplastedeVedlegg;

export const erGyldigDokumentasjonUtvidet = (input): input is ISøknadKontraktDokumentasjon[] =>
    input &&
    Array.isArray(input) &&
    input.map(erGyldigISøknadKontraktDokumentasjon).reduce((prev, curr) => !!(prev && curr), true);

export const erGyldigISøknadKontraktUtvidet = (input): input is ISøknadKontrakt =>
    !!(
        input &&
        input.søknadstype &&
        input.søknadstype === ESøknadstype.UTVIDET &&
        erGyldigISøknadKontraktSøkerUtvidet(input.søker) &&
        erGyldigeBarnUtvidet(input.barn) &&
        erGyldigDokumentasjonUtvidet(input.dokumentasjon)
    );

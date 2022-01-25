import { Alpha3Code, getAlpha3Codes } from 'i18n-iso-countries';

import {
    ESøknadstype,
    IKontraktNåværendeSamboer,
    IKontraktTidligereSamboer,
    ISøknadKontrakt,
    ISøknadKontraktBarn,
    ISøknadKontraktDokumentasjon,
    ISøknadKontraktSøker,
    ISøknadsfelt,
} from '../typer/kontrakt/generelle';
import { ISamboer, ITidligereSamboer } from '../typer/person';

export const erGyldigIKontraktNåværendeSamboer = (input): input is IKontraktNåværendeSamboer =>
    !!(input && input.navn && input.ident && input.fødselsdato && input.samboerFraDato);

export const erGyldigNåværendeSamboer = (
    harSamboerNå: ISøknadsfelt<string>,
    nåværendeSamboer: ISøknadsfelt<IKontraktNåværendeSamboer> | null
): boolean => {
    if (harSamboerNå.verdi['nb'] === 'NEI') {
        return true;
    }
    if (
        harSamboerNå.verdi['nb'] === 'JA' &&
        nåværendeSamboer &&
        nåværendeSamboer.verdi &&
        erGyldigIKontraktNåværendeSamboer(nåværendeSamboer.verdi['nb'])
    ) {
        return true;
    }
    return false;
};

export const erTidligereSamboer = (
    samboer: ISamboer | ITidligereSamboer
): samboer is ITidligereSamboer => {
    return 'samboerTilDato' in samboer;
};

export const erGyldigIKontraktTidligereSamboer = (input): input is IKontraktTidligereSamboer =>
    !!(input && input.samboerTilDato && erGyldigIKontraktNåværendeSamboer(input));

export const erGyldigTidligereSamboere = (input: ISøknadKontraktSøker): boolean =>
    input &&
    input.tidligereSamboere &&
    Array.isArray(input.tidligereSamboere) &&
    input.tidligereSamboere
        .map(tidligereSamboerSøknadsfelt =>
            erGyldigIKontraktTidligereSamboer(tidligereSamboerSøknadsfelt.verdi['nb'])
        )
        .reduce((prev, curr) => !!(prev && curr), true);

export const erGyldigISøknadKontraktSøker = (input): input is ISøknadKontraktSøker =>
    !!(
        input.ident &&
        input.navn &&
        input.statsborgerskap &&
        input.adresse &&
        input.sivilstand &&
        erGyldigTidligereSamboere(input) &&
        erGyldigNåværendeSamboer(input?.spørsmål?.harSamboerNå, input.nåværendeSamboer)
    );

export const erGyldigISøknadsKontraktBarn = (input): input is ISøknadKontraktBarn =>
    !!(
        input &&
        input.ident &&
        input.navn &&
        input.registrertBostedType &&
        input.alder &&
        input.spørsmål
    );

export const erGyldigeBarnUtvidet = (input): input is ISøknadKontraktBarn[] =>
    input &&
    Array.isArray(input) &&
    input.map(erGyldigISøknadsKontraktBarn).reduce((prev, curr) => !!(prev && curr), true);

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
        erGyldigISøknadKontraktSøker(input.søker) &&
        erGyldigeBarnUtvidet(input.barn) &&
        erGyldigDokumentasjonUtvidet(input.dokumentasjon)
    );

export const isAlpha3Code = (code: string): code is Alpha3Code => {
    return code in getAlpha3Codes();
};

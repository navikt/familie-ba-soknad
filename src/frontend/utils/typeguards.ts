import { Alpha3Code, getAlpha3Codes } from 'i18n-iso-countries';

import { ISøknadKontraktDokumentasjon } from '../typer/kontrakt/dokumentasjon';
import {
    IKontraktNåværendeSamboer,
    IKontraktTidligereSamboer,
    ISøknadsfelt,
} from '../typer/kontrakt/generelle';
import {
    IAndreForelderIKontraktFormatV8,
    IAndreForelderUtvidetIKontraktFormat,
    IOmsorgspersonIKontraktFormatV8,
    ISøknadIKontraktBarnV8,
    ISøknadKontraktSøker,
    ISøknadKontraktV8,
} from '../typer/kontrakt/v8';
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

    return !!(
        harSamboerNå.verdi['nb'] === 'JA' &&
        nåværendeSamboer &&
        nåværendeSamboer.verdi &&
        erGyldigIKontraktNåværendeSamboer(nåværendeSamboer.verdi['nb'])
    );
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
    'harEøsSteg' in input &&
    'ident' in input &&
    'navn' in input &&
    'statsborgerskap' in input &&
    'adresse' in input &&
    'adressebeskyttelse' in input &&
    'sivilstand' in input &&
    'spørsmål' in input &&
    'tidligereSamboere' in input &&
    'nåværendeSamboer' in input &&
    'utenlandsperioder' in input &&
    'arbeidsperioderUtland' in input &&
    'pensjonsperioderUtland' in input &&
    'arbeidsperioderNorge' in input &&
    'pensjonsperioderNorge' in input &&
    'andreUtbetalingsperioder' in input &&
    'idNummer' in input &&
    erGyldigTidligereSamboere(input) &&
    erGyldigNåværendeSamboer(input?.spørsmål?.harSamboerNå, input.nåværendeSamboer);

export const erGyldigISøknadKontraktOmsorgsperson = (
    input
): input is IOmsorgspersonIKontraktFormatV8 =>
    input === null ||
    (input &&
        'navn' in input &&
        'slektsforhold' in input &&
        'slektsforholdSpesifisering' in input &&
        'idNummer' in input &&
        'adresse' in input &&
        'arbeidUtland' in input &&
        'arbeidsperioderUtland' in input &&
        'arbeidNorge' in input &&
        'arbeidsperioderNorge' in input &&
        'pensjonUtland' in input &&
        'pensjonsperioderUtland' in input &&
        'pensjonNorge' in input &&
        'pensjonsperioderNorge' in input &&
        'andreUtbetalinger' in input &&
        'andreUtbetalingsperioder' in input &&
        'pågåendeSøknadFraAnnetEøsLand' in input &&
        'pågåendeSøknadHvilketLand' in input &&
        'barnetrygdFraEøs' in input &&
        'eøsBarnetrygdsperioder' in input);

export const erGyldigISøknadKontraktAndreForelder = (
    input
): input is IAndreForelderIKontraktFormatV8 =>
    input === null ||
    (input &&
        'kanIkkeGiOpplysninger' in input &&
        'navn' in input &&
        'fnr' in input &&
        'fødselsdato' in input &&
        'pensjonUtland' in input &&
        'arbeidUtlandet' in input &&
        'skriftligAvtaleOmDeltBosted' in input &&
        'pensjonNorge' in input &&
        'arbeidNorge' in input &&
        'andreUtbetalinger' in input &&
        'barnetrygdFraEøs' in input &&
        'arbeidsperioderUtland' in input &&
        'pensjonsperioderUtland' in input &&
        'arbeidsperioderNorge' in input &&
        'pensjonsperioderNorge' in input &&
        'pågåendeSøknadFraAnnetEøsLand' in input &&
        'pågåendeSøknadHvilketLand' in input &&
        'eøsBarnetrygdsperioder' in input &&
        'andreUtbetalingsperioder' in input &&
        'idNummer' in input &&
        'utvidet' in input &&
        erGyldigISøknadKontraktAndreForelderUtvidet(input.utvidet));

export const erGyldigISøknadKontraktAndreForelderUtvidet = (
    input
): input is IAndreForelderUtvidetIKontraktFormat =>
    input && 'søkerHarBoddMedAndreForelder' in input && 'søkerFlyttetFraAndreForelderDato' in input;

export const erGyldigISøknadsKontraktBarn = (input): input is ISøknadIKontraktBarnV8 =>
    input &&
    'harEøsSteg' in input &&
    'ident' in input &&
    'navn' in input &&
    'registrertBostedType' in input &&
    'alder' in input &&
    'utenlandsperioder' in input &&
    'eøsBarnetrygdsperioder' in input &&
    'idNummer' in input &&
    'spørsmål' in input &&
    'omsorgsperson' in input &&
    'andreForelder' in input &&
    erGyldigISøknadKontraktOmsorgsperson(input.omsorgsperson) &&
    erGyldigISøknadKontraktAndreForelder(input.andreForelder);

export const erGyldigISøknadKontraktBarnListe = (input): input is ISøknadIKontraktBarnV8[] =>
    input &&
    Array.isArray(input) &&
    input.map(erGyldigISøknadsKontraktBarn).reduce((prev, curr) => !!(prev && curr), true);

export const erGyldigISøknadKontraktDokumentasjon = (
    input
): input is ISøknadKontraktDokumentasjon =>
    input.dokumentasjonsbehov && input.harSendtInn !== undefined && input.opplastedeVedlegg;

export const erGyldigDokumentasjon = (input): input is ISøknadKontraktDokumentasjon[] =>
    input &&
    Array.isArray(input) &&
    input.map(erGyldigISøknadKontraktDokumentasjon).reduce((prev, curr) => !!(prev && curr), true);

export const erGyldigISøknadKontrakt = (input): input is ISøknadKontraktV8 => {
    return !!(
        input &&
        'søknadstype' in input &&
        'kontraktVersjon' in input &&
        'antallEøsSteg' in input &&
        'teksterUtenomSpørsmål' in input &&
        'spørsmål' in input &&
        'originalSpråk' in input &&
        erGyldigISøknadKontraktBarnListe(input.barn) &&
        erGyldigISøknadKontraktSøker(input.søker) &&
        erGyldigDokumentasjon(input.dokumentasjon)
    );
};

export const isAlpha3Code = (code: string): code is Alpha3Code => {
    return code in getAlpha3Codes();
};

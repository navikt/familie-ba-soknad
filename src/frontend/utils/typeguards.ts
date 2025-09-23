import { Alpha3Code, getAlpha3Codes } from 'i18n-iso-countries';

import { ISøknadKontraktDokumentasjon } from '../typer/kontrakt/dokumentasjon';
import { IKontraktNåværendeSamboer, IKontraktTidligereSamboer, ISøknadsfelt } from '../typer/kontrakt/generelle';
import {
    IAndreForelderIKontraktFormat,
    IAndreForelderUtvidetIKontraktFormat,
    IOmsorgspersonIKontraktFormat,
    ISøknadIKontraktBarn,
    ISøknadKontraktSøker,
    ISøknadKontrakt,
} from '../typer/kontrakt/kontrakt';

const erGyldigIKontraktNåværendeSamboer = (input): input is IKontraktNåværendeSamboer =>
    !!(input && input.navn && input.ident && input.fødselsdato && input.samboerFraDato);

const erGyldigNåværendeSamboer = (
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

const erGyldigIKontraktTidligereSamboer = (input): input is IKontraktTidligereSamboer =>
    !!(input && input.samboerTilDato && erGyldigIKontraktNåværendeSamboer(input));

const erGyldigTidligereSamboere = (input: ISøknadKontraktSøker): boolean =>
    input &&
    input.tidligereSamboere &&
    Array.isArray(input.tidligereSamboere) &&
    input.tidligereSamboere
        .map(tidligereSamboerSøknadsfelt => erGyldigIKontraktTidligereSamboer(tidligereSamboerSøknadsfelt.verdi['nb']))
        .reduce((prev, curr) => !!(prev && curr), true);

const erGyldigISøknadKontraktSøker = (input): input is ISøknadKontraktSøker =>
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
    'svalbardOppholdPerioder' in input &&
    'utenlandsperioder' in input &&
    'arbeidsperioderUtland' in input &&
    'pensjonsperioderUtland' in input &&
    'arbeidsperioderNorge' in input &&
    'pensjonsperioderNorge' in input &&
    'andreUtbetalingsperioder' in input &&
    'idNummer' in input &&
    erGyldigTidligereSamboere(input) &&
    erGyldigNåværendeSamboer(input?.spørsmål?.harSamboerNå, input.nåværendeSamboer);

const erGyldigISøknadKontraktOmsorgsperson = (input): input is IOmsorgspersonIKontraktFormat =>
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

const erGyldigISøknadKontraktAndreForelder = (input): input is IAndreForelderIKontraktFormat =>
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

const erGyldigISøknadKontraktAndreForelderUtvidet = (input): input is IAndreForelderUtvidetIKontraktFormat =>
    input && 'søkerHarBoddMedAndreForelder' in input && 'søkerFlyttetFraAndreForelderDato' in input;

const erGyldigISøknadsKontraktBarn = (input): input is ISøknadIKontraktBarn =>
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

const erGyldigISøknadKontraktBarnListe = (input): input is ISøknadIKontraktBarn[] =>
    input &&
    Array.isArray(input) &&
    input.map(erGyldigISøknadsKontraktBarn).reduce((prev, curr) => !!(prev && curr), true);

const erGyldigISøknadKontraktDokumentasjon = (input): input is ISøknadKontraktDokumentasjon =>
    input.dokumentasjonsbehov && input.harSendtInn !== undefined && input.opplastedeVedlegg;

const erGyldigDokumentasjon = (input): input is ISøknadKontraktDokumentasjon[] =>
    input &&
    Array.isArray(input) &&
    input.map(erGyldigISøknadKontraktDokumentasjon).reduce((prev, curr) => !!(prev && curr), true);

export const erGyldigISøknadKontrakt = (input): input is ISøknadKontrakt => {
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

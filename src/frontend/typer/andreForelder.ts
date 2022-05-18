import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput, DatoMedUkjent } from './common';
import { IArbeidsperiode, IPensjonsperiode, IUtbetalingsperiode } from './perioder';
import { IIdNummer } from './person';
import { ISøknadSpørsmål } from './spørsmål';

export enum andreForelderDataKeySpørsmål {
    navn = 'navn',
    fnr = 'fnr',
    fødselsdato = 'fødselsdato',
    arbeidUtlandet = 'arbeidUtlandet',
    arbeidUtlandetHvilketLand = 'arbeidUtlandetHvilketLand',
    pensjonUtland = 'pensjonUtland',
    pensjonHvilketLand = 'pensjonHvilketLand',
    skriftligAvtaleOmDeltBosted = 'skriftligAvtaleOmDeltBosted',
    søkerHarBoddMedAndreForelder = 'søkerHarBoddMedAndreForelder',
    søkerFlyttetFraAndreForelderDato = 'søkerFlyttetFraAndreForelderDato',
    adresse = 'adresse',

    // EØS
    pensjonNorge = 'pensjonNorge',
    arbeidNorge = 'arbeidNorge',
    andreUtbetalinger = 'andreUtbetalinger',
}

export interface IAndreForelder {
    arbeidsperioderUtland: IArbeidsperiode[];
    pensjonsperioderUtland: IPensjonsperiode[];
    kanIkkeGiOpplysninger: boolean;
    [andreForelderDataKeySpørsmål.navn]: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    [andreForelderDataKeySpørsmål.fnr]: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    [andreForelderDataKeySpørsmål.fødselsdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [andreForelderDataKeySpørsmål.arbeidUtlandet]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [andreForelderDataKeySpørsmål.pensjonUtland]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.pensjonHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: ISøknadSpørsmål<ESvar | null>;

    //EØS
    arbeidsperioderNorge: IArbeidsperiode[];
    pensjonsperioderNorge: IPensjonsperiode[];
    andreUtbetalingsperioder: IUtbetalingsperiode[];
    idNummer: IIdNummer[];
    [andreForelderDataKeySpørsmål.adresse]: ISøknadSpørsmål<
        string | AlternativtSvarForInput.UKJENT
    >;
    [andreForelderDataKeySpørsmål.pensjonNorge]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.arbeidNorge]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.andreUtbetalinger]: ISøknadSpørsmål<ESvar | null>;

    utvidet: {
        [andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]: ISøknadSpørsmål<ESvar | null>;
        [andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]: ISøknadSpørsmål<DatoMedUkjent>;
    };
}

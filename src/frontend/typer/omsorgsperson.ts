import type { ESvar } from '@navikt/familie-form-elements';
import type { Alpha3Code } from 'i18n-iso-countries';

import type { Slektsforhold } from '../../common/typer/kontrakt/generelle';

import type { IArbeidsperiode, IEøsBarnetrygdsperiode, IPensjonsperiode, IUtbetalingsperiode } from './perioder';
import type { ISøknadSpørsmål } from './spørsmål';
import type { AlternativtSvarForInput } from './svar';

export interface IOmsorgsperson {
    navn: ISøknadSpørsmål<string>;
    slektsforhold: ISøknadSpørsmål<Slektsforhold | ''>;
    slektsforholdSpesifisering: ISøknadSpørsmål<string>;
    idNummer: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    adresse: ISøknadSpørsmål<string>;
    arbeidUtland: ISøknadSpørsmål<ESvar | null>;
    arbeidsperioderUtland: IArbeidsperiode[];
    arbeidNorge: ISøknadSpørsmål<ESvar | null>;
    arbeidsperioderNorge: IArbeidsperiode[];
    pensjonUtland: ISøknadSpørsmål<ESvar | null>;
    pensjonsperioderUtland: IPensjonsperiode[];
    pensjonNorge: ISøknadSpørsmål<ESvar | null>;
    pensjonsperioderNorge: IPensjonsperiode[];
    andreUtbetalinger: ISøknadSpørsmål<ESvar | null>;
    andreUtbetalingsperioder: IUtbetalingsperiode[];
    barnetrygdFraEøs: ISøknadSpørsmål<ESvar | null>;
    eøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
    pågåendeSøknadFraAnnetEøsLand: ISøknadSpørsmål<ESvar | null>;
    pågåendeSøknadHvilketLand: ISøknadSpørsmål<Alpha3Code | ''>;
}

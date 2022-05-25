import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput } from './common';
import { Slektsforhold } from './kontrakt/barn';
import { IArbeidsperiode, IEøsBarnetrygdsperiode, IPensjonsperiode } from './perioder';
import { ISøknadSpørsmål } from './spørsmål';

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
    barnetrygdFraEøs: ISøknadSpørsmål<ESvar | null>;
    eøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
}

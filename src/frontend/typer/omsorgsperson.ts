import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput } from './common';
import { Slektsforhold } from './kontrakt/barn';
import { IArbeidsperiode } from './perioder';
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
}

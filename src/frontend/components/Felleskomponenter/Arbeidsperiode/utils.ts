import { ISODateString } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import {
    dagenEtterDato,
    dagensDato,
    erSammeDatoSomDagensDato,
    morgendagensDato,
} from '../../../utils/dato';

export const minAvgrensningArbeidsperiodeTilDato = (
    tilbakeITid: boolean,
    arbeidsperiodeFraDato: Felt<ISODateString>
) => {
    if (tilbakeITid) {
        return dagenEtterDato(arbeidsperiodeFraDato.verdi);
    } else if (erSammeDatoSomDagensDato(arbeidsperiodeFraDato.verdi)) {
        return morgendagensDato();
    } else {
        return dagensDato();
    }
};

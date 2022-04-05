import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import {
    dagenEtterDato,
    dagensDato,
    erSammeDatoSomDagensDato,
    morgendagensDato,
} from '../../../utils/dato';

export const minAvgrensningArbeidsperiodeTilDato = (
    arbeidperiodeErAvsluttet: Felt<ESvar | null>,
    andreForelderErDød: boolean,
    arbeidsperiodeFraDato: Felt<ISODateString>
) => {
    if (arbeidperiodeErAvsluttet.verdi === ESvar.JA || andreForelderErDød) {
        return dagenEtterDato(arbeidsperiodeFraDato.verdi);
    } else if (erSammeDatoSomDagensDato(arbeidsperiodeFraDato.verdi)) {
        return morgendagensDato();
    } else {
        return dagensDato();
    }
};

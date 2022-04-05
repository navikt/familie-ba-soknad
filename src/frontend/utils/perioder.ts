import { ISODateString } from '@navikt/familie-form-elements';

import { dagenEtterDato, dagensDato, erSammeDatoSomDagensDato, morgendagensDato } from './dato';

export const minTilDatoForUtbetalingEllerArbeidsperiode = (
    tilbakeITid: boolean,
    dato: ISODateString
) => {
    if (tilbakeITid) {
        return dagenEtterDato(dato);
    } else if (erSammeDatoSomDagensDato(dato)) {
        return morgendagensDato();
    } else {
        return dagensDato();
    }
};

import { useEffect } from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { validerDato } from '../../../utils/dato';

const useDatovelgerFeltMedUkjent = (
    feltId,
    initiellVerdi,
    avhengighet: Felt<ESvar>,
    skalFeltetVises: boolean
) => {
    const datoFelt = useFelt<ISODateString>({
        feltId: feltId,
        verdi: initiellVerdi,
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter) => {
            if (
                avhengigheter &&
                avhengigheter.vetIkkeCheckbox &&
                avhengigheter.vetIkkeCheckbox.verdi === ESvar.JA
            ) {
                return ok(felt);
            }
            return validerDato(felt, false);
        },
        avhengigheter: { vetIkkeCheckbox: avhengighet, skalFeltetVises },
        skalFeltetVises: avhengigheter => avhengigheter && avhengigheter.skalFeltetVises,
    });
    useEffect(() => {
        datoFelt.validerOgSettFelt(datoFelt.verdi, avhengighet);
    }, [avhengighet]);

    useEffect(() => {
        !skalFeltetVises && datoFelt.validerOgSettFelt('', avhengighet);
    }, [skalFeltetVises]);

    return datoFelt;
};

export default useDatovelgerFeltMedUkjent;

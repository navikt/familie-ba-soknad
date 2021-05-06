import { useEffect } from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { AlternativtSvarForInput, DatoMedUkjent } from '../../../typer/person';
import { ISøknadSpørsmål } from '../../../typer/søknad';
import { validerDato } from '../../../utils/dato';

const useDatovelgerFeltMedUkjent = (
    søknadsfelt: ISøknadSpørsmål<DatoMedUkjent>,
    avhengighet: Felt<ESvar>,
    skalFeltetVises: boolean
) => {
    const datoFelt = useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar !== AlternativtSvarForInput.UKJENT ? søknadsfelt.svar : '',
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

    return datoFelt;
};

export default useDatovelgerFeltMedUkjent;

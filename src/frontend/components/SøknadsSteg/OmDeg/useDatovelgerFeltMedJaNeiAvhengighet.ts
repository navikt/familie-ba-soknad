import { useEffect } from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, useFelt } from '@navikt/familie-skjema';

import { ISøknadSpørsmål } from '../../../typer/søknad';
import { validerDato } from '../../../utils/dato';

const useDatovelgerFeltMedJaNeiAvhengighet = (
    søknadsfelt: ISøknadSpørsmål<ISODateString>,
    avhengigSvarCondition: ESvar,
    avhengighet: Felt<ESvar | undefined>,
    avgrensDatoFremITid = false
) => {
    const skalFeltetVises = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;

    const dato = useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: felt => {
            return validerDato(felt, avgrensDatoFremITid);
        },
        skalFeltetVises: avhengigheter => {
            return avhengigheter && (avhengigheter.jaNeiSpm as Felt<ESvar | undefined>)
                ? skalFeltetVises(avhengigheter.jaNeiSpm.verdi)
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet },
    });

    useEffect(() => {
        const skalVises = skalFeltetVises(avhengighet.verdi);

        skalVises && dato.verdi !== '' && dato.validerOgSettFelt(dato.verdi);

        return () => {
            !skalFeltetVises(avhengighet.verdi) && dato.validerOgSettFelt('');
        };
    }, [avhengighet]);

    return dato;
};

export default useDatovelgerFeltMedJaNeiAvhengighet;

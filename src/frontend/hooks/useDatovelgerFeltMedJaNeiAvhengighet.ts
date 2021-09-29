import { useEffect } from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, useFelt, ValiderFelt } from '@navikt/familie-skjema';

import { validerDato } from '../../../utils/validering';
import { AlternativtSvarForInput, DatoMedUkjent } from '../typer/person';
import { ISøknadSpørsmål } from '../typer/søknad';

const useDatovelgerFeltMedJaNeiAvhengighet = (
    søknadsfelt: ISøknadSpørsmål<ISODateString> | ISøknadSpørsmål<DatoMedUkjent>,
    avhengigSvarCondition: ESvar,
    avhengighet: Felt<ESvar | null>,
    feilmeldingSpråkId: string,
    valideringsfunksjon?: ValiderFelt<ISODateString | DatoMedUkjent>,
    avgrensDatoFremITid = false
) => {
    const skalFeltetVises = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;

    const dato = useFelt<ISODateString | DatoMedUkjent>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar === AlternativtSvarForInput.UKJENT ? '' : søknadsfelt.svar,
        valideringsfunksjon,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: felt => {
            return validerDato(felt, avgrensDatoFremITid, feilmeldingSpråkId);
        },
        skalFeltetVises: avhengigheter => {
            return avhengigheter && (avhengigheter.jaNeiSpm as Felt<ESvar | null>)
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

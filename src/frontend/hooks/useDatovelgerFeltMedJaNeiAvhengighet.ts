import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, useFelt } from '@navikt/familie-skjema';

import { ISODateString } from '../typer/common';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { validerDato } from '../utils/dato';

const useDatovelgerFeltMedJaNeiAvhengighet = ({
    søknadsfelt,
    avhengigSvarCondition,
    avhengighet,
    feilmeldingSpråkId,
    sluttdatoAvgrensning = undefined,
    startdatoAvgrensning = undefined,
}: {
    søknadsfelt: ISøknadSpørsmål<ISODateString>;
    avhengigSvarCondition: ESvar;
    avhengighet: Felt<ESvar | null>;
    feilmeldingSpråkId: string;
    sluttdatoAvgrensning?: Date;
    startdatoAvgrensning?: Date;
}) => {
    const skalFeltetVises = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;

    const dato = useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: felt => {
            return validerDato(
                felt,
                feilmeldingSpråkId,
                startdatoAvgrensning,
                sluttdatoAvgrensning
            );
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

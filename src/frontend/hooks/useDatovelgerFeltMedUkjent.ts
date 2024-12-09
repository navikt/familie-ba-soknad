import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { type Avhengigheter, type Felt, type FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { ISODateString } from '../typer/common';
import { validerDato } from '../utils/dato';

const useDatovelgerFeltMedUkjent = ({
    feltId,
    initiellVerdi,
    vetIkkeCheckbox,
    feilmeldingSpråkId,
    skalFeltetVises,
    nullstillVedAvhengighetEndring = true,
    sluttdatoAvgrensning = undefined,
    startdatoAvgrensning = undefined,
    customStartdatoFeilmelding = '',
    avhengigheter,
}: {
    feltId;
    initiellVerdi: ISODateString;
    vetIkkeCheckbox: Felt<ESvar>;
    feilmeldingSpråkId: string;
    skalFeltetVises: boolean;
    nullstillVedAvhengighetEndring?: boolean;
    sluttdatoAvgrensning?: Date;
    startdatoAvgrensning?: Date;
    customStartdatoFeilmelding?: string;
    avhengigheter?: Avhengigheter;
}) => {
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

            const feilmeldingSpråkId = avhengigheter && avhengigheter.feilmeldingSpråkId;
            const customStartdatoFeilmelding =
                avhengigheter && avhengigheter.customStartdatoFeilmelding;

            const startdatoAvgrensningOppdatert =
                avhengigheter && avhengigheter.startdatoAvgrensning;

            return validerDato(
                felt,
                feilmeldingSpråkId,
                startdatoAvgrensningOppdatert,
                sluttdatoAvgrensning,
                customStartdatoFeilmelding
            );
        },
        avhengigheter: {
            vetIkkeCheckbox,
            skalFeltetVises,
            customStartdatoFeilmelding,
            feilmeldingSpråkId,
            startdatoAvgrensning,
            ...avhengigheter,
        },
        nullstillVedAvhengighetEndring,
        skalFeltetVises: avhengigheter => avhengigheter && avhengigheter.skalFeltetVises,
    });

    useEffect(() => {
        if (vetIkkeCheckbox.verdi === ESvar.JA) {
            datoFelt.validerOgSettFelt(datoFelt.verdi, vetIkkeCheckbox);
        }
    }, [vetIkkeCheckbox]);

    useEffect(() => {
        if (skalFeltetVises && datoFelt.verdi !== '') {
            datoFelt.validerOgSettFelt(datoFelt.verdi, vetIkkeCheckbox);
        }

        return () => {
            if (!skalFeltetVises) datoFelt.validerOgSettFelt('', vetIkkeCheckbox);
        };
    }, [skalFeltetVises, vetIkkeCheckbox]);

    return datoFelt;
};

export default useDatovelgerFeltMedUkjent;

import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { type Avhengigheter, type Felt, type FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../context/AppContext';
import { ISODateString } from '../typer/common';
import { LocaleRecordBlock } from '../typer/sanity/sanity';
import { validerDatoForSanity } from '../utils/dato';

const useDatovelgerFeltMedUkjentForSanity = ({
    feltId,
    initiellVerdi,
    vetIkkeCheckbox,
    feilmelding,
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
    feilmelding: LocaleRecordBlock;
    skalFeltetVises: boolean;
    nullstillVedAvhengighetEndring?: boolean;
    sluttdatoAvgrensning?: Date;
    startdatoAvgrensning?: Date;
    customStartdatoFeilmelding?: string;
    avhengigheter?: Avhengigheter;
}) => {
    const { plainTekst, tekster } = useApp();
    const datoFelt = useFelt<ISODateString>({
        feltId: feltId,
        verdi: initiellVerdi,
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter) => {
            if (avhengigheter?.vetIkkeCheckbox?.verdi === ESvar.JA) {
                return ok(felt);
            }

            const customStartdatoFeilmelding = avhengigheter?.customStartdatoFeilmelding;

            return validerDatoForSanity(
                tekster().FELLES.formateringsfeilmeldinger,
                plainTekst,
                felt,
                feilmelding,
                startdatoAvgrensning,
                sluttdatoAvgrensning,
                customStartdatoFeilmelding
            );
        },
        avhengigheter: {
            vetIkkeCheckbox,
            skalFeltetVises,
            customStartdatoFeilmelding,
            ...avhengigheter,
        },
        nullstillVedAvhengighetEndring,
        skalFeltetVises: avhengigheter => avhengigheter?.skalFeltetVises,
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

export default useDatovelgerFeltMedUkjentForSanity;
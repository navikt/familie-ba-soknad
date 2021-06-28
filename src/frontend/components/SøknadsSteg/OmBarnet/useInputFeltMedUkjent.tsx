import React, { useEffect } from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { DatoMedUkjent } from '../../../typer/person';
import { ISøknadSpørsmål } from '../../../typer/søknad';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { formaterInitVerdiForInputMedUkjent } from './utils';

const useInputFeltMedUkjent = (
    søknadsfelt: ISøknadSpørsmål<DatoMedUkjent>,
    avhengighet: Felt<ESvar>,
    feilmeldingSpråkId: string,
    erFnrInput = false,
    skalVises = true
) => {
    const inputFelt = useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: formaterInitVerdiForInputMedUkjent(søknadsfelt.svar),
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter) => {
            if (
                avhengigheter &&
                avhengigheter.vetIkkeCheckbox &&
                avhengigheter.vetIkkeCheckbox.verdi === ESvar.JA
            ) {
                return ok(felt);
            }

            if (erFnrInput) {
                return felt.verdi === '' || idnr(felt.verdi).status !== 'valid'
                    ? feil(felt, <SpråkTekst id={feilmeldingSpråkId} />)
                    : ok(felt);
            } else {
                return felt.verdi && felt.verdi !== ''
                    ? ok(felt)
                    : feil(felt, <SpråkTekst id={feilmeldingSpråkId} />);
            }
        },
        avhengigheter: { vetIkkeCheckbox: avhengighet, skalVises },
        skalFeltetVises: avhengigheter => avhengigheter && avhengigheter.skalVises,
    });
    useEffect(() => {
        if (avhengighet.verdi === ESvar.JA) {
            inputFelt.validerOgSettFelt('', avhengighet);
        }
    }, [avhengighet]);

    return inputFelt;
};

export default useInputFeltMedUkjent;

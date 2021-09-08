import React, { useEffect } from 'react';

import { guid } from 'nav-frontend-js-utils';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { formaterInitVerdiForInputMedUkjent } from '../components/SøknadsSteg/OmBarnet/utils';
import { DatoMedUkjent } from '../typer/person';
import { ISøknadSpørsmål } from '../typer/søknad';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';

const useInputFeltMedUkjent = (
    søknadsfelt: ISøknadSpørsmål<DatoMedUkjent> | null,
    avhengighet: Felt<ESvar>,
    feilmeldingSpråkId: string,
    erFnrInput = false,
    skalVises = true
) => {
    const inputFelt = useFelt<ISODateString>({
        feltId: søknadsfelt ? søknadsfelt.id : guid(),
        verdi: søknadsfelt
            ? trimWhiteSpace(formaterInitVerdiForInputMedUkjent(søknadsfelt.svar))
            : '',
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter) => {
            const feltVerdi = trimWhiteSpace(felt.verdi);

            if (
                avhengigheter &&
                avhengigheter.vetIkkeCheckbox &&
                avhengigheter.vetIkkeCheckbox.verdi === ESvar.JA
            ) {
                return ok(felt);
            }

            if (erFnrInput) {
                return feltVerdi === '' || idnr(feltVerdi).status !== 'valid'
                    ? feil(felt, <SpråkTekst id={feilmeldingSpråkId} />)
                    : ok(felt);
            } else {
                return feltVerdi !== ''
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
        } else {
            inputFelt.verdi && inputFelt.validerOgSettFelt(inputFelt.verdi);
        }
    }, [avhengighet]);

    return inputFelt;
};

export default useInputFeltMedUkjent;

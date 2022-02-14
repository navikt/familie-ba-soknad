import React, { useEffect } from 'react';

import { guid } from 'nav-frontend-js-utils';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { DatoMedUkjent } from '../typer/common';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent } from '../utils/input';

const useInputFeltMedUkjent = ({
    søknadsfelt,
    avhengighet,
    feilmeldingSpråkId = '',
    erFnrInput = false,
    skalVises = true,
    customValidering = undefined,
}: {
    søknadsfelt: ISøknadSpørsmål<DatoMedUkjent> | { id: string; svar: string } | null;
    avhengighet: Felt<ESvar>;
    feilmeldingSpråkId?: string;
    erFnrInput?: boolean;
    skalVises?: boolean;
    customValidering?: ((felt: FeltState<string>) => FeltState<string>) | undefined;
}) => {
    const inputFelt = useFelt<string>({
        feltId: søknadsfelt ? søknadsfelt.id : guid(),
        verdi: søknadsfelt
            ? trimWhiteSpace(formaterInitVerdiForInputMedUkjent(søknadsfelt.svar))
            : '',
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter): FeltState<string> => {
            const feltVerdi = trimWhiteSpace(felt.verdi);

            if (
                avhengigheter &&
                avhengigheter.vetIkkeCheckbox &&
                avhengigheter.vetIkkeCheckbox.verdi === ESvar.JA
            ) {
                return ok(felt);
            }

            if (erFnrInput) {
                if (feltVerdi === '') {
                    return feil(felt, <SpråkTekst id={feilmeldingSpråkId} />);
                } else if (idnr(feltVerdi).status !== 'valid') {
                    return feil(felt, <SpråkTekst id={'felles.fnr.feil-format.feilmelding'} />);
                } else {
                    return customValidering ? customValidering(felt) : ok(felt);
                }
            } else {
                return feltVerdi !== ''
                    ? customValidering
                        ? customValidering(felt)
                        : ok(felt)
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

import React, { ReactNode, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, type Felt, type FeltState, ok, useFelt } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { useAppContext } from '../context/AppContext';
import { DatoMedUkjent } from '../typer/common';
import { FlettefeltVerdier, LocaleRecordBlock, LocaleRecordString } from '../typer/sanity/sanity';
import { IdNummerKey } from '../typer/skjema';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent } from '../utils/input';

const useInputFeltMedUkjent = ({
    søknadsfelt,
    avhengighet,
    feilmelding,
    feilmeldingSpråkId,
    erFnrInput = false,
    skalVises = true,
    customValidering = undefined,
    språkVerdier = {},
    flettefelter,
    nullstillVedAvhengighetEndring = true,
}: {
    søknadsfelt: ISøknadSpørsmål<DatoMedUkjent> | { id: IdNummerKey; svar: string } | null;
    feilmelding?: LocaleRecordBlock | LocaleRecordString;
    avhengighet: Felt<ESvar>;
    feilmeldingSpråkId: string;
    erFnrInput?: boolean;
    skalVises?: boolean;
    customValidering?: ((felt: FeltState<string>) => FeltState<string>) | undefined;
    flettefelter?: FlettefeltVerdier;
    språkVerdier?: Record<string, ReactNode>;
    nullstillVedAvhengighetEndring?: boolean;
}) => {
    const { tekster, plainTekst } = useAppContext();
    const formateringsfeilmeldinger = tekster().FELLES.formateringsfeilmeldinger;

    const inputFelt = useFelt<string>({
        feltId: søknadsfelt ? søknadsfelt.id : uuidv4(),
        verdi: søknadsfelt ? trimWhiteSpace(formaterInitVerdiForInputMedUkjent(søknadsfelt.svar)) : '',
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter): FeltState<string> => {
            const feltVerdi = trimWhiteSpace(felt.verdi);
            if (avhengigheter?.vetIkkeCheckbox?.verdi === ESvar.JA) {
                return ok(felt);
            }

            if (erFnrInput) {
                if (feltVerdi === '') {
                    return feil(
                        felt,
                        feilmelding ? (
                            plainTekst(feilmelding, flettefelter)
                        ) : (
                            <SpråkTekst id={feilmeldingSpråkId} values={språkVerdier} />
                        )
                    );
                } else if (idnr(feltVerdi).status !== 'valid') {
                    return feil(felt, plainTekst(formateringsfeilmeldinger.ugyldigFoedselsnummer));
                } else {
                    return customValidering ? customValidering(felt) : ok(felt);
                }
            } else {
                return feltVerdi !== ''
                    ? customValidering
                        ? customValidering(felt)
                        : ok(felt)
                    : feil(
                          felt,
                          feilmelding ? (
                              plainTekst(feilmelding, flettefelter)
                          ) : (
                              <SpråkTekst id={feilmeldingSpråkId} values={språkVerdier} />
                          )
                      );
            }
        },
        avhengigheter: { vetIkkeCheckbox: avhengighet, skalVises },
        skalFeltetVises: avhengigheter => avhengigheter && avhengigheter.skalVises,
        nullstillVedAvhengighetEndring,
    });
    useEffect(() => {
        if (avhengighet.verdi === ESvar.JA) {
            inputFelt.validerOgSettFelt('', avhengighet);
        } else if (inputFelt.verdi) {
            inputFelt.validerOgSettFelt(inputFelt.verdi);
        }
    }, [avhengighet]);

    return inputFelt;
};

export default useInputFeltMedUkjent;

import { useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, type Felt, type FeltState, ok, useFelt } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { FlettefeltVerdier, LocaleRecordBlock, LocaleRecordString } from '../../common/sanity';
import { useAppContext } from '../context/AppContext';
import { IdNummerKey } from '../typer/skjema';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { DatoMedUkjent } from '../typer/svar';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent } from '../utils/input';

const useInputFeltMedUkjent = ({
    søknadsfelt,
    avhengighet,
    feilmelding,
    erFnrInput = false,
    skalVises = true,
    customValidering = undefined,
    nullstillVedAvhengighetEndring = true,
    flettefelter,
}: {
    søknadsfelt: ISøknadSpørsmål<DatoMedUkjent> | { id: IdNummerKey; svar: string } | null;
    feilmelding: LocaleRecordBlock | LocaleRecordString;
    avhengighet: Felt<ESvar>;
    erFnrInput?: boolean;
    skalVises?: boolean;
    customValidering?: ((felt: FeltState<string>) => FeltState<string>) | undefined;
    nullstillVedAvhengighetEndring?: boolean;
    flettefelter?: FlettefeltVerdier;
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
                    return feil(felt, plainTekst(feilmelding, flettefelter));
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
                    : feil(felt, plainTekst(feilmelding, flettefelter));
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

import { ReactNode } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { feil, type FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { FlettefeltVerdier, LocaleRecordBlock } from '../../common/typer/sanity';
import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { useAppContext } from '../context/AppContext';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';

const useInputFelt = ({
    søknadsfelt,
    feilmelding,
    feilmeldingSpråkId,
    skalVises = true,
    customValidering = undefined,
    nullstillVedAvhengighetEndring = true,
    flettefelter,
    feilmeldingSpråkVerdier,
}: {
    søknadsfelt: ISøknadSpørsmål<string> | null;
    feilmelding?: LocaleRecordBlock;
    feilmeldingSpråkId: string;
    skalVises?: boolean;
    customValidering?: ((felt: FeltState<string>) => FeltState<string>) | undefined;
    nullstillVedAvhengighetEndring?: boolean;
    flettefelter?: FlettefeltVerdier;
    feilmeldingSpråkVerdier?: { [key: string]: ReactNode };
}) => {
    const { plainTekst } = useAppContext();

    return useFelt<string>({
        feltId: søknadsfelt?.id ?? uuidv4(),
        verdi: søknadsfelt ? trimWhiteSpace(søknadsfelt.svar) : '',
        valideringsfunksjon: (felt: FeltState<string>) => {
            const feltVerdi = trimWhiteSpace(felt.verdi);
            return feltVerdi !== ''
                ? customValidering
                    ? customValidering(felt)
                    : ok(felt)
                : feil(
                      felt,
                      feilmelding ? (
                          plainTekst(feilmelding, { ...flettefelter })
                      ) : (
                          <SpråkTekst id={feilmeldingSpråkId} values={feilmeldingSpråkVerdier} />
                      )
                  );
        },
        avhengigheter: { skalVises },
        skalFeltetVises: avhengigheter => avhengigheter.skalVises,
        nullstillVedAvhengighetEndring,
    });
};

export default useInputFelt;

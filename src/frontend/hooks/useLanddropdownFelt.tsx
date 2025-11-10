import { ReactNode } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { feil, type FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { LocaleRecordBlock } from '../../common/typer/sanity';
import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { useAppContext } from '../context/AppContext';
import { ISøknadSpørsmål } from '../typer/spørsmål';

const useLanddropdownFelt = ({
    søknadsfelt,
    feilmelding,
    feilmeldingSpråkId,
    skalFeltetVises,
    nullstillVedAvhengighetEndring = false,
    feilmeldingSpråkVerdier,
}: {
    søknadsfelt: ISøknadSpørsmål<Alpha3Code | ''>;
    feilmelding?: LocaleRecordBlock;
    feilmeldingSpråkId: string;
    skalFeltetVises: boolean;
    nullstillVedAvhengighetEndring?: boolean;
    feilmeldingSpråkVerdier?: { [key: string]: ReactNode };
}) => {
    const { plainTekst } = useAppContext();
    return useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        skalFeltetVises: avhengigheter => {
            return avhengigheter && avhengigheter.skalFeltetVises;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | ''>, avhengigheter) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(
                      felt,
                      avhengigheter?.feilmeldingSpråkId ? (
                          avhengigheter?.feilmelding ? (
                              plainTekst(avhengigheter?.feilmelding)
                          ) : (
                              <SpråkTekst id={avhengigheter.feilmeldingSpråkId} values={feilmeldingSpråkVerdier} />
                          )
                      ) : (
                          ''
                      )
                  );
        },
        nullstillVedAvhengighetEndring,
        avhengigheter: { skalFeltetVises, feilmelding, feilmeldingSpråkId },
    });
};

export default useLanddropdownFelt;

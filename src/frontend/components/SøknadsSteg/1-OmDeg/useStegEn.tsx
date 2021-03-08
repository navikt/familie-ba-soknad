import React from 'react';

import { FormattedMessage } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, FeltState, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';

export interface IStegEnFeltTyper {
    borPåRegistrertAdresse: ESvar | undefined;
    telefonnummer: string;
}

export const useStegEn = () => {
    const { søknad } = useApp();
    const søker = søknad.søker;

    const borPåRegistrertAdresse = useFelt<ESvar | undefined>({
        verdi: undefined,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi === ESvar.JA
                ? ok(felt)
                : feil(
                      felt,
                      <FormattedMessage
                          id={'personopplysninger.feilmelding.borpåregistrertadresse'}
                      />
                  );
        },
    });

    const telefonnummer = useFelt<string>({
        verdi: søker.kontakttelefon,
        valideringsfunksjon: (felt: FeltState<string>) => {
            return felt.verdi.length >= 8 && /^[+\d\s]+$/.test(felt.verdi)
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'personopplysninger.feilmelding.telefonnr'} />);
        },
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            const { søkerMåOppgiTlf } = avhengigheter;
            return søkerMåOppgiTlf;
        },
        avhengigheter: {
            søkerMåOppgiTlf: borPåRegistrertAdresse.verdi === ESvar.JA,
        },
    });

    const { skjema, kanSendeSkjema } = useSkjema<IStegEnFeltTyper, string>({
        felter: {
            borPåRegistrertAdresse,
            telefonnummer,
        },
        skjemanavn: 'steg1',
    });

    return {
        skjema,
        kanSendeSkjema,
    };
};

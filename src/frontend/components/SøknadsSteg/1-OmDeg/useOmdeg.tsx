import React from 'react';

import { FormattedMessage } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import {
    Avhengigheter,
    feil,
    FeltState,
    ISkjema,
    ok,
    useFelt,
    useSkjema,
} from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';

export interface IStegEnFeltTyper {
    borPåRegistrertAdresse: ESvar | undefined;
    telefonnummer: string;
    oppholderSegINorge: ESvar | undefined;
}

export const useOmdeg = (): {
    skjema: ISkjema<IStegEnFeltTyper, string>;
    kanSendeSkjema: () => boolean;
} => {
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

    const oppholderSegINorge = useFelt<ESvar | undefined>({
        verdi: undefined,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.borPåRegistrertAdresse.verdi === ESvar.JA;
        },
        avhengigheter: {
            borPåRegistrertAdresse,
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
            oppholderSegINorge,
        },
        skjemanavn: 'omdeg',
    });

    return {
        skjema,
        kanSendeSkjema,
    };
};

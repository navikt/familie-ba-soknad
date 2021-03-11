import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
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
    oppholdsLand: Alpha3Code | undefined;
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
            /**
             * Hvis man svarer nei setter vi felt til Feil-state slik at man ikke kan gå videre,
             * og setter feilmelding til en tom string, siden personopplysningskomponenten har egen
             * feilmelding for det tilfellet.
             * Hvis man ikke svarer vises vanlig feilmelding.
             */
            return felt.verdi === ESvar.JA
                ? ok(felt)
                : feil(
                      felt,
                      felt.verdi === undefined ? (
                          <FormattedMessage id={'personopplysninger.feilmelding.janei'} />
                      ) : (
                          ''
                      )
                  );
        },
    });

    const oppholderSegINorge = useFelt<ESvar | undefined>({
        verdi: undefined,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.borPåRegistrertAdresse.verdi === ESvar.JA;
        },
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'personopplysninger.feilmelding.janei'} />);
        },
        avhengigheter: {
            borPåRegistrertAdresse,
        },
    });

    const oppholdsLand = useFelt<Alpha3Code | undefined>({
        verdi: undefined,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.oppholderSegINorge.verdi === ESvar.NEI;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'personopplysninger.feilmelding.velgland'} />);
        },
        avhengigheter: {
            oppholderSegINorge,
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
            oppholdsLand,
        },
        skjemanavn: 'omdeg',
    });

    return {
        skjema,
        kanSendeSkjema,
    };
};

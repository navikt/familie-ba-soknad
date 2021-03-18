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

export type ESvarMedUbesvart = ESvar | undefined;

export interface IOmDegFeltTyper {
    borPåRegistrertAdresse: ESvarMedUbesvart;
    telefonnummer: string;
    oppholderSegINorge: ESvarMedUbesvart;
    oppholdsLand: Alpha3Code | undefined;
    værtINorgeITolvMåneder: ESvarMedUbesvart;
    erAsylsøker: ESvarMedUbesvart;
    jobberPåBåt: ESvarMedUbesvart;
    arbeidsLand: Alpha3Code | undefined;
    mottarUtlandsPensjon: ESvarMedUbesvart;
    pensjonsLand: Alpha3Code | undefined;
}

export const useOmdeg = (): {
    skjema: ISkjema<IOmDegFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
} => {
    const { søknad } = useApp();
    const søker = søknad.søker;

    const borPåRegistrertAdresse = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
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

    const oppholderSegINorge = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.borPåRegistrertAdresse.verdi === ESvar.JA;
        },
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
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

    const værtINorgeITolvMåneder = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.borPåRegistrertAdresse.verdi === ESvar.JA;
        },
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'personopplysninger.feilmelding.janei'} />);
        },
        avhengigheter: {
            borPåRegistrertAdresse,
        },
    });

    const erAsylsøker = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.værtINorgeITolvMåneder.verdi !== undefined;
        },
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'personopplysninger.feilmelding.janei'} />);
        },
        avhengigheter: {
            værtINorgeITolvMåneder,
        },
    });

    const jobberPåBåt = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
        skalFeltetVises: avhengigheter => {
            return avhengigheter.erAsylsøker.verdi !== undefined;
        },
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'personopplysninger.feilmelding.janei'} />);
        },
        avhengigheter: {
            erAsylsøker,
        },
    });

    const arbeidsLand = useFelt<Alpha3Code | undefined>({
        verdi: undefined,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.jobberPåBåt.verdi === ESvar.JA;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'personopplysninger.feilmelding.velgland'} />);
        },
        avhengigheter: {
            jobberPåBåt,
        },
    });

    const mottarUtlandsPensjon = useFelt<ESvarMedUbesvart>({
        verdi: undefined,
        skalFeltetVises: avhengigheter => {
            return avhengigheter.erAsylsøker.verdi !== undefined;
        },
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'personopplysninger.feilmelding.janei'} />);
        },
        avhengigheter: {
            erAsylsøker,
        },
    });

    const pensjonsLand = useFelt<Alpha3Code | undefined>({
        verdi: undefined,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.mottarUtlandsPensjon.verdi === ESvar.JA;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'personopplysninger.feilmelding.velgland'} />);
        },
        avhengigheter: {
            mottarUtlandsPensjon,
        },
    });

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IOmDegFeltTyper, string>({
        felter: {
            borPåRegistrertAdresse,
            telefonnummer,
            oppholderSegINorge,
            oppholdsLand,
            værtINorgeITolvMåneder,
            erAsylsøker,
            jobberPåBåt,
            arbeidsLand,
            mottarUtlandsPensjon,
            pensjonsLand,
        },
        skjemanavn: 'omdeg',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
    };
};

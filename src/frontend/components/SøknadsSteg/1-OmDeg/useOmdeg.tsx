import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

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
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

export type ESvarMedUbesvart = ESvar | undefined;

export interface IOmDegFeltTyper {
    borPåRegistrertAdresse: ESvarMedUbesvart;
    telefonnummer: string;
    oppholderSegINorge: ESvarMedUbesvart;
    oppholdsland: Alpha3Code | undefined;
    værtINorgeITolvMåneder: ESvarMedUbesvart;
    erAsylsøker: ESvarMedUbesvart;
    jobberPåBåt: ESvarMedUbesvart;
    arbeidsland: Alpha3Code | undefined;
    mottarUtenlandspensjon: ESvarMedUbesvart;
    pensjonsland: Alpha3Code | undefined;
}

export const useOmdeg = (): {
    skjema: ISkjema<IOmDegFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
} => {
    const { søknad, settSøknad } = useApp();
    const søker = søknad.søker;

    const borPåRegistrertAdresse = useFelt<ESvarMedUbesvart>({
        feltId: søker.borPåRegistrertAdresse.id,
        verdi: søker.borPåRegistrertAdresse.svar,
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
                          <SpråkTekst id={'personopplysninger.feilmelding.janei'} />
                      ) : (
                          ''
                      )
                  );
        },
    });

    const oppholderSegINorge = useFelt<ESvarMedUbesvart>({
        feltId: søker.oppholderSegINorge.id,
        verdi: søker.oppholderSegINorge.svar,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.borPåRegistrertAdresse.verdi === ESvar.JA;
        },
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
        avhengigheter: {
            borPåRegistrertAdresse,
        },
    });

    const oppholdsland = useFelt<Alpha3Code | undefined>({
        feltId: søker.oppholdsland.id,
        verdi: søker.oppholdsland.svar,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.oppholderSegINorge.verdi === ESvar.NEI;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.velgland'} />);
        },
        avhengigheter: {
            oppholderSegINorge,
        },
    });

    const telefonnummer = useFelt<string>({
        feltId: søker.telefonnummer.id,
        verdi: søker.telefonnummer.svar,
        valideringsfunksjon: (felt: FeltState<string>) => {
            return felt.verdi.length >= 8 && /^[+\d\s]+$/.test(felt.verdi)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.telefonnr'} />);
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
        feltId: søker.værtINorgeITolvMåneder.id,
        verdi: søker.værtINorgeITolvMåneder.svar,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.borPåRegistrertAdresse.verdi === ESvar.JA;
        },
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
        avhengigheter: {
            borPåRegistrertAdresse,
        },
    });

    const erAsylsøker = useFelt<ESvarMedUbesvart>({
        feltId: søker.erAsylsøker.id,
        verdi: søker.erAsylsøker.svar,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.værtINorgeITolvMåneder.verdi !== undefined;
        },
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
        avhengigheter: {
            værtINorgeITolvMåneder,
        },
    });

    const jobberPåBåt = useFelt<ESvarMedUbesvart>({
        feltId: søker.jobberPåBåt.id,
        verdi: søker.jobberPåBåt.svar,
        skalFeltetVises: avhengigheter => {
            return avhengigheter.erAsylsøker.verdi !== undefined;
        },
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
        avhengigheter: {
            erAsylsøker,
        },
    });

    const arbeidsland = useFelt<Alpha3Code | undefined>({
        feltId: søker.arbeidsland.id,
        verdi: søker.arbeidsland.svar,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.jobberPåBåt.verdi === ESvar.JA;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.velgland'} />);
        },
        avhengigheter: {
            jobberPåBåt,
        },
    });

    const mottarUtenlandspensjon = useFelt<ESvarMedUbesvart>({
        feltId: søker.mottarUtenlandspensjon.id,
        verdi: søker.mottarUtenlandspensjon.svar,
        skalFeltetVises: avhengigheter => {
            return avhengigheter.erAsylsøker.verdi !== undefined;
        },
        valideringsfunksjon: (felt: FeltState<ESvarMedUbesvart>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
        avhengigheter: {
            erAsylsøker,
        },
    });

    const pensjonsland = useFelt<Alpha3Code | undefined>({
        feltId: søker.pensjonsland.id,
        verdi: søker.pensjonsland.svar,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.mottarUtenlandspensjon.verdi === ESvar.JA;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.velgland'} />);
        },
        avhengigheter: {
            mottarUtenlandspensjon,
        },
    });

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            søker: {
                ...søknad.søker,
                borPåRegistrertAdresse: {
                    ...søknad.søker.borPåRegistrertAdresse,
                    svar: skjema.felter.borPåRegistrertAdresse.verdi,
                },
                telefonnummer: {
                    ...søknad.søker.telefonnummer,
                    svar: skjema.felter.telefonnummer.verdi,
                },
                oppholderSegINorge: {
                    ...søknad.søker.oppholderSegINorge,
                    svar: skjema.felter.oppholderSegINorge.verdi,
                },
                oppholdsland: {
                    ...søknad.søker.oppholdsland,
                    svar: skjema.felter.oppholdsland.verdi,
                },
                værtINorgeITolvMåneder: {
                    ...søknad.søker.værtINorgeITolvMåneder,
                    svar: skjema.felter.værtINorgeITolvMåneder.verdi,
                },
                erAsylsøker: {
                    ...søknad.søker.erAsylsøker,
                    svar: skjema.felter.erAsylsøker.verdi,
                },
                jobberPåBåt: {
                    ...søknad.søker.jobberPåBåt,
                    svar: skjema.felter.jobberPåBåt.verdi,
                },
                arbeidsland: {
                    ...søknad.søker.arbeidsland,
                    svar: skjema.felter.arbeidsland.verdi,
                },
                mottarUtenlandspensjon: {
                    ...søknad.søker.mottarUtenlandspensjon,
                    svar: skjema.felter.mottarUtenlandspensjon.verdi,
                },
                pensjonsland: {
                    ...søknad.søker.pensjonsland,
                    svar: skjema.felter.pensjonsland.verdi,
                },
            },
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IOmDegFeltTyper, string>({
        felter: {
            borPåRegistrertAdresse,
            telefonnummer,
            oppholderSegINorge,
            oppholdsland,
            værtINorgeITolvMåneder,
            erAsylsøker,
            jobberPåBåt,
            arbeidsland,
            mottarUtenlandspensjon,
            pensjonsland,
        },
        skjemanavn: 'omdeg',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        oppdaterSøknad,
    };
};

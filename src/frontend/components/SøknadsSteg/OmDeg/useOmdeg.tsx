import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { Dokumentasjonsbehov } from '../../../typer/dokumentasjon';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import useDatovelgerFeltMedJaNeiAvhengighet from './useDatovelgerFeltMedJaNeiAvhengighet';
import useLanddropdownFeltMedJaNeiAvhengighet from './useLanddropdownFeltMedJaNeiAvhengighet';

export type ESvarMedUbesvart = ESvar | null;

export interface IOmDegFeltTyper {
    borPåRegistrertAdresse: ESvar | null;
    oppholderSegINorge: ESvar | null;
    oppholdsland: Alpha3Code | '';
    oppholdslandDato: ISODateString;
    værtINorgeITolvMåneder: ESvar | null;
    komTilNorgeDato: ISODateString;
    planleggerÅBoINorgeTolvMnd: ESvar | null;
    erAsylsøker: ESvar | null;
    jobberPåBåt: ESvar | null;
    arbeidsland: Alpha3Code | '';
    mottarUtenlandspensjon: ESvar | null;
    pensjonsland: Alpha3Code | '';
}

export const useOmdeg = (): {
    skjema: ISkjema<IOmDegFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad } = useApp();
    const søker = søknad.søker;

    const borPåRegistrertAdresse = useFelt<ESvar | null>({
        feltId: søker.borPåRegistrertAdresse.id,
        verdi: søker.borPåRegistrertAdresse.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | null>) => {
            /**
             * Hvis man svarer nei setter vi felt til Feil-state slik at man ikke kan gå videre,
             * og setter feilmelding til en tom string, siden personopplysningskomponenten har egen
             * feilmelding for det tilfellet.
             * Hvis man ikke svarer vises vanlig feilmelding.
             */

            if (felt.verdi === ESvar.JA) {
                return ok(felt);
            }

            let feilmeldingId;

            if (felt.verdi === ESvar.NEI) feilmeldingId = 'omdeg.du-kan-ikke-søke.feilmelding';
            else if (!søker.adressebeskyttelse && !søker.adresse)
                feilmeldingId = 'omdeg.personopplysninger.ikke-registrert.feilmelding';
            else feilmeldingId = 'omdeg.borpådenneadressen.feilmelding';

            return feil(felt, <SpråkTekst id={feilmeldingId} />);
        },
        skalFeltetVises: () => søker.adressebeskyttelse === false,
    });

    const oppholderSegINorge = useJaNeiSpmFelt(
        søker.oppholderSegINorge,
        'omdeg.opphold-i-norge.feilmelding',
        {
            ...(!søker.adressebeskyttelse && {
                borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresse },
            }),
        },
        borPåRegistrertAdresse.verdi === ESvar.NEI
    );

    const oppholdsland = useLanddropdownFeltMedJaNeiAvhengighet(
        søker.oppholdsland,
        ESvar.NEI,
        oppholderSegINorge
    );

    const oppholdslandDato = useDatovelgerFeltMedJaNeiAvhengighet(
        søker.oppholdslandDato,
        ESvar.NEI,
        oppholderSegINorge,
        true
    );

    const værtINorgeITolvMåneder = useJaNeiSpmFelt(
        søker.værtINorgeITolvMåneder,
        'omdeg.opphold-sammenhengende.feilmelding',
        {
            ...(!søker.adressebeskyttelse && {
                borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresse },
            }),
        },
        borPåRegistrertAdresse.verdi === ESvar.NEI
    );

    const komTilNorgeDato = useDatovelgerFeltMedJaNeiAvhengighet(
        søker.komTilNorgeDato,
        ESvar.NEI,
        værtINorgeITolvMåneder,
        true
    );

    const planleggerÅBoINorgeTolvMnd = useFelt<ESvar | null>({
        feltId: søker.planleggerÅBoINorgeTolvMnd.id,
        verdi: søker.planleggerÅBoINorgeTolvMnd.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | null>) => {
            return felt.verdi
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst id={'omdeg.planlagt-opphold-sammenhengende.feilmelding'} />
                  );
        },
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter.værtINorgeITolvMåneder &&
                avhengigheter.værtINorgeITolvMåneder.verdi === ESvar.NEI
            );
        },
        avhengigheter: { værtINorgeITolvMåneder },
    });

    const erAsylsøker = useJaNeiSpmFelt(
        søker.erAsylsøker,
        'omdeg.asylsøker.feilmelding',
        {
            ...(!søker.adressebeskyttelse && {
                borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresse },
            }),
            værtINorgeITolvMåneder: {
                hovedSpørsmål: værtINorgeITolvMåneder,
            },
            oppholderSegINorge: {
                hovedSpørsmål: oppholderSegINorge,
                tilhørendeFelter: [oppholdsland, oppholdslandDato],
            },
        },
        borPåRegistrertAdresse.verdi === ESvar.NEI
    );

    const jobberPåBåt = useJaNeiSpmFelt(
        søker.jobberPåBåt,
        'omdeg.arbeid-utland.feilmelding',
        {
            ...(!søker.adressebeskyttelse && {
                borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresse },
            }),
            værtINorgeITolvMåneder: {
                hovedSpørsmål: værtINorgeITolvMåneder,
            },
            oppholderSegINorge: {
                hovedSpørsmål: oppholderSegINorge,
                tilhørendeFelter: [oppholdsland, oppholdslandDato],
            },
        },
        borPåRegistrertAdresse.verdi === ESvar.NEI
    );

    const arbeidsland = useLanddropdownFeltMedJaNeiAvhengighet(
        søker.arbeidsland,
        ESvar.JA,
        jobberPåBåt
    );

    const mottarUtenlandspensjon = useJaNeiSpmFelt(
        søker.mottarUtenlandspensjon,
        'omdeg.utenlandspensjon.feilmelding',
        {
            ...(!søker.adressebeskyttelse && {
                borPåRegistrertAdresse: { hovedSpørsmål: borPåRegistrertAdresse },
            }),

            værtINorgeITolvMåneder: {
                hovedSpørsmål: værtINorgeITolvMåneder,
            },
            oppholderSegINorge: {
                hovedSpørsmål: oppholderSegINorge,
                tilhørendeFelter: [oppholdsland, oppholdslandDato],
            },
        },
        borPåRegistrertAdresse.verdi === ESvar.NEI
    );

    const pensjonsland = useLanddropdownFeltMedJaNeiAvhengighet(
        søker.pensjonsland,
        ESvar.JA,
        mottarUtenlandspensjon
    );

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            søker: {
                ...søknad.søker,
                borPåRegistrertAdresse: {
                    ...søker.borPåRegistrertAdresse,
                    svar: skjema.felter.borPåRegistrertAdresse.verdi,
                },

                oppholderSegINorge: {
                    ...søker.oppholderSegINorge,
                    svar: skjema.felter.oppholderSegINorge.verdi,
                },
                oppholdsland: {
                    ...søker.oppholdsland,
                    svar: skjema.felter.oppholdsland.verdi,
                },
                oppholdslandDato: {
                    ...søker.oppholdslandDato,
                    svar: skjema.felter.oppholdslandDato.verdi,
                },
                værtINorgeITolvMåneder: {
                    ...søker.værtINorgeITolvMåneder,
                    svar: skjema.felter.værtINorgeITolvMåneder.verdi,
                },
                komTilNorgeDato: {
                    ...søker.komTilNorgeDato,
                    svar: skjema.felter.komTilNorgeDato.verdi,
                },
                planleggerÅBoINorgeTolvMnd: {
                    ...søker.planleggerÅBoINorgeTolvMnd,
                    svar: skjema.felter.planleggerÅBoINorgeTolvMnd.verdi,
                },
                erAsylsøker: {
                    ...søker.erAsylsøker,
                    svar: skjema.felter.erAsylsøker.verdi,
                },
                jobberPåBåt: {
                    ...søker.jobberPåBåt,
                    svar: skjema.felter.jobberPåBåt.verdi,
                },
                arbeidsland: {
                    ...søker.arbeidsland,
                    svar: skjema.felter.arbeidsland.verdi,
                },
                mottarUtenlandspensjon: {
                    ...søker.mottarUtenlandspensjon,
                    svar: skjema.felter.mottarUtenlandspensjon.verdi,
                },
                pensjonsland: {
                    ...søker.pensjonsland,
                    svar: skjema.felter.pensjonsland.verdi,
                },
            },
            dokumentasjon: søknad.dokumentasjon.map(dok =>
                dok.dokumentasjonsbehov === Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE
                    ? { ...dok, gjelderForSøker: erAsylsøker.verdi === ESvar.JA }
                    : dok
            ),
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmDegFeltTyper,
        string
    >({
        felter: {
            borPåRegistrertAdresse,
            oppholderSegINorge,
            oppholdsland,
            oppholdslandDato,
            værtINorgeITolvMåneder,
            komTilNorgeDato,
            planleggerÅBoINorgeTolvMnd,
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
        validerAlleSynligeFelter,
        valideringErOk,
        oppdaterSøknad,
    };
};

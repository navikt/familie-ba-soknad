import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useDatovelgerFeltMedJaNeiAvhengighet from '../../../hooks/useDatovelgerFeltMedJaNeiAvhengighet';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFeltMedJaNeiAvhengighet from '../../../hooks/useLanddropdownFeltMedJaNeiAvhengighet';
import { Dokumentasjonsbehov } from '../../../typer/dokumentasjon';
import { AlternativtSvarForInput, DatoMedUkjent } from '../../../typer/person';
import { dagensDato } from '../../../utils/dato';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmDegSpørsmålId } from './spørsmål';

export type ESvarMedUbesvart = ESvar | null;

export interface IOmDegFeltTyper {
    borPåRegistrertAdresse: ESvar | null;
    oppholderSegINorge: ESvar | null;
    oppholdsland: Alpha3Code | '';
    oppholdslandDato: ISODateString;
    værtINorgeITolvMåneder: ESvar | null;
    komTilNorgeDato: DatoMedUkjent;
    komTilNorgeDatoVetIkke: ESvar;
    reistFraNorgeDato: DatoMedUkjent;
    reistFraNorgeDatoVetIkke: ESvar;
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
        'omdeg.opphold-i-norge.land.feilmelding',
        ESvar.NEI,
        oppholderSegINorge
    );

    const oppholdslandDato = useDatovelgerFeltMedJaNeiAvhengighet(
        søker.oppholdslandDato,
        ESvar.NEI,
        oppholderSegINorge,
        'omdeg.opphold-i-norge.dato.feilmelding',
        dagensDato()
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

    const komTilNorgeDatoVetIkke = useFelt<ESvar>({
        verdi: søker.komTilNorgeDato.svar === AlternativtSvarForInput.UKJENT ? ESvar.JA : ESvar.NEI,
        feltId: OmDegSpørsmålId.komTilNorgeDatoVetIkke,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.værtINorgeITolvMåneder &&
                avhengigheter.værtINorgeITolvMåneder.verdi === ESvar.NEI
            );
        },
        avhengigheter: { værtINorgeITolvMåneder },
    });

    const komTilNorgeDato = useDatovelgerFeltMedUkjent(
        søker.komTilNorgeDato,
        søker.komTilNorgeDato.svar === AlternativtSvarForInput.UKJENT
            ? ''
            : søker.komTilNorgeDato.svar,
        komTilNorgeDatoVetIkke,
        'omdeg.opphold-sammenhengende.dato.feilmelding',
        værtINorgeITolvMåneder.verdi === ESvar.NEI,
        false,
        dagensDato()
    );

    const reistFraNorgeDatoVetIkke = useFelt<ESvar>({
        verdi:
            søker.reistFraNorgeDato.svar === AlternativtSvarForInput.UKJENT ? ESvar.JA : ESvar.NEI,
        feltId: OmDegSpørsmålId.reistFraNorgeDatoVetIkke,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.værtINorgeITolvMåneder &&
                avhengigheter.værtINorgeITolvMåneder.verdi === ESvar.NEI
            );
        },
        avhengigheter: { værtINorgeITolvMåneder },
    });

    const reistFraNorgeDato = useDatovelgerFeltMedUkjent(
        søker.reistFraNorgeDato,
        søker.reistFraNorgeDato.svar === AlternativtSvarForInput.UKJENT
            ? ''
            : søker.reistFraNorgeDato.svar,
        reistFraNorgeDatoVetIkke,
        'TODO',
        værtINorgeITolvMåneder.verdi === ESvar.NEI,
        false,
        dagensDato()
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
        'omdeg.arbeid-utland.land.feilmelding',
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
        'omdeg.utenlandspensjon.land.feilmelding',
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
                    svar: svarForSpørsmålMedUkjent(
                        skjema.felter.komTilNorgeDatoVetIkke,
                        skjema.felter.komTilNorgeDato
                    ),
                },
                reistFraNorgeDato: {
                    ...søker.reistFraNorgeDato,
                    svar: svarForSpørsmålMedUkjent(
                        skjema.felter.reistFraNorgeDatoVetIkke,
                        skjema.felter.reistFraNorgeDato
                    ),
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
            komTilNorgeDatoVetIkke,
            reistFraNorgeDato,
            reistFraNorgeDatoVetIkke,
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

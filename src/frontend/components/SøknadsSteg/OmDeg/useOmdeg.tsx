import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useDatovelgerFeltMedJaNeiAvhengighet from '../../../hooks/useDatovelgerFeltMedJaNeiAvhengighet';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFeltMedJaNeiAvhengighet from '../../../hooks/useLanddropdownFeltMedJaNeiAvhengighet';
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
    reistFraNorgeVetIkke: ESvar;
    planleggerÅBoINorgeTolvMnd: ESvar | null;
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

    const reistFraNorgeVetIkke = useFelt<ESvar>({
        verdi:
            søker.reistFraNorgeDato.svar === AlternativtSvarForInput.UKJENT ? ESvar.JA : ESvar.NEI,
        feltId: OmDegSpørsmålId.reistFraNorgeVetIkke,
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
        reistFraNorgeVetIkke,
        'omdeg.opphold-sammenhengende.datoreist.feilmelding',
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
                        skjema.felter.reistFraNorgeVetIkke,
                        skjema.felter.reistFraNorgeDato
                    ),
                },
                planleggerÅBoINorgeTolvMnd: {
                    ...søker.planleggerÅBoINorgeTolvMnd,
                    svar: skjema.felter.planleggerÅBoINorgeTolvMnd.verdi,
                },
            },
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
            reistFraNorgeVetIkke: reistFraNorgeVetIkke,
            planleggerÅBoINorgeTolvMnd,
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

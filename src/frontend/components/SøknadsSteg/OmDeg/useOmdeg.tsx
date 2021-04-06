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
import { hentFiltrerteAvhengigheter } from '../../../utils/felthook';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import useJaNeiSpmFelt from '../OmBarnaDine/useJaNeiSpmFelt';
import useLandDropdownFelt from './useLanddropdownFelt';

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

    const telefonnummer = useFelt<string>({
        feltId: søker.telefonnummer.id,
        verdi: søker.telefonnummer.svar,
        valideringsfunksjon: (felt: FeltState<string>) => {
            return felt.verdi.length >= 8 && /^[+\d\s]+$/.test(felt.verdi)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.telefonnr'} />);
        },
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter.borPåRegistrertAdresse.verdi === ESvar.JA;
        },
        avhengigheter: {
            borPåRegistrertAdresse,
        },
    });

    const oppholderSegINorge = useJaNeiSpmFelt(
        søknad.søker.oppholderSegINorge,
        'personopplysninger.feilmelding.janei',
        { borPåRegistrertAdresse },
        true
    );

    const oppholdsland = useLandDropdownFelt(
        søker.oppholdsland,
        'personopplysninger.feilmelding.velgland',
        ESvar.NEI,
        oppholderSegINorge
    );

    const værtINorgeITolvMåneder = useJaNeiSpmFelt(
        søknad.søker.værtINorgeITolvMåneder,
        'personopplysninger.feilmelding.janei',
        { borPåRegistrertAdresse },
        true
    );

    const erAsylsøker = useJaNeiSpmFelt(
        søknad.søker.erAsylsøker,
        'personopplysninger.feilmelding.janei',
        {
            borPåRegistrertAdresse,
            ...hentFiltrerteAvhengigheter(
                [
                    { jaNeiSpm: værtINorgeITolvMåneder },
                    { jaNeiSpm: oppholderSegINorge, tilhørendeFelter: { oppholdsland } },
                ],
                ESvar.NEI
            ),
        },
        borPåRegistrertAdresse.verdi === ESvar.NEI
    );

    const jobberPåBåt = useJaNeiSpmFelt(
        søknad.søker.jobberPåBåt,
        'personopplysninger.feilmelding.janei',
        {
            borPåRegistrertAdresse,
            ...hentFiltrerteAvhengigheter(
                [
                    { jaNeiSpm: værtINorgeITolvMåneder },
                    { jaNeiSpm: oppholderSegINorge, tilhørendeFelter: { oppholdsland } },
                ],
                ESvar.NEI
            ),
        },
        borPåRegistrertAdresse.verdi === ESvar.NEI
    );

    const arbeidsland = useLandDropdownFelt(
        søker.arbeidsland,
        'personopplysninger.feilmelding.velgland',
        ESvar.JA,
        jobberPåBåt
    );

    const mottarUtenlandspensjon = useJaNeiSpmFelt(
        søknad.søker.mottarUtenlandspensjon,
        'personopplysninger.feilmelding.janei',
        {
            borPåRegistrertAdresse,
            ...hentFiltrerteAvhengigheter(
                [
                    { jaNeiSpm: værtINorgeITolvMåneder },
                    { jaNeiSpm: oppholderSegINorge, tilhørendeFelter: { oppholdsland } },
                ],
                ESvar.NEI
            ),
        },
        borPåRegistrertAdresse.verdi === ESvar.NEI
    );

    const pensjonsland = useLandDropdownFelt(
        søker.pensjonsland,
        'personopplysninger.feilmelding.velgland',
        ESvar.JA,
        mottarUtenlandspensjon
    );

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

import React from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { ESivilstand } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import useDatovelgerFeltMedJaNeiAvhengighet from '../OmDeg/useDatovelgerFeltMedJaNeiAvhengighet';
import { Årsak } from './types-and-utilities';

export interface IDinLivssituasjonFeltTyper {
    årsak: Årsak | '';
    harSamboerNå: ESvar | null;
    separertEnkeSkilt: ESvar | null;
    separertEnkeSkiltUtland: ESvar | null;
    separertEnkeSkiltDato: ISODateString;
    hattAnnenSamboerForSøktPeriode: ESvar | null;
}

export const useDinLivssituasjon = (): {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad } = useApp();
    const søker = søknad.søker;

    const årsak = useFelt<Årsak | ''>({
        feltId: søker.utvidet.spørsmål.årsak.id,
        verdi: søker.utvidet.spørsmål.årsak.svar,
        valideringsfunksjon: (felt: FeltState<Årsak | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'omdeg.velgårsak.feilmelding'} />);
        },
    });

    const separertEnkeSkilt = useJaNeiSpmFelt(
        søker.utvidet.spørsmål.separertEnkeSkilt,
        undefined,
        false,
        søker.sivilstand.type !== ESivilstand.GIFT
    );

    const separertEnkeSkiltUtland = useFelt<ESvar | null>({
        feltId: søknad.søker.utvidet.spørsmål.separertEnkeSkiltUtland.id,
        verdi:
            separertEnkeSkilt.verdi === ESvar.NEI
                ? null
                : søknad.søker.utvidet.spørsmål.separertEnkeSkiltUtland.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.mangler-svar.feilmelding'} />);
        },
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.separertEnkeSkilt &&
                avhengigheter.separertEnkeSkilt.verdi === ESvar.JA
            );
        },
        avhengigheter: { separertEnkeSkilt },
    });

    const separertEnkeSkiltDato = useDatovelgerFeltMedJaNeiAvhengighet(
        søker.utvidet.spørsmål.separertEnkeSkiltDato,
        ESvar.JA,
        separertEnkeSkilt
    );

    const harSamboerNå = useJaNeiSpmFelt(søker.utvidet.spørsmål.harSamboerNå);

    const hattAnnenSamboerForSøktPeriode = useJaNeiSpmFelt(
        søker.utvidet.spørsmål.hattAnnenSamboerForSøktPeriode
    );

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IDinLivssituasjonFeltTyper,
        string
    >({
        felter: {
            årsak,
            separertEnkeSkilt,
            separertEnkeSkiltUtland,
            separertEnkeSkiltDato,
            harSamboerNå,
            hattAnnenSamboerForSøktPeriode,
        },
        skjemanavn: 'dinlivssituasjon',
    });

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            søker: {
                ...søknad.søker,
                utvidet: {
                    ...søknad.søker.utvidet,
                    spørsmål: {
                        ...søknad.søker.utvidet.spørsmål,
                        årsak: {
                            ...søknad.søker.utvidet.spørsmål.årsak,
                            svar: skjema.felter.årsak.verdi,
                        },
                        separertEnkeSkilt: {
                            ...søknad.søker.utvidet.spørsmål.separertEnkeSkilt,
                            svar: skjema.felter.separertEnkeSkilt.verdi,
                        },
                        separertEnkeSkiltUtland: {
                            ...søknad.søker.utvidet.spørsmål.separertEnkeSkiltUtland,
                            svar: skjema.felter.separertEnkeSkiltUtland.verdi,
                        },
                        separertEnkeSkiltDato: {
                            ...søknad.søker.utvidet.spørsmål.separertEnkeSkiltDato,
                            svar: skjema.felter.separertEnkeSkiltDato.verdi,
                        },
                        harSamboerNå: {
                            ...søknad.søker.utvidet.spørsmål.harSamboerNå,
                            svar: skjema.felter.harSamboerNå.verdi,
                        },
                        hattAnnenSamboerForSøktPeriode: {
                            ...søknad.søker.utvidet.spørsmål.hattAnnenSamboerForSøktPeriode,
                            svar: skjema.felter.hattAnnenSamboerForSøktPeriode.verdi,
                        },
                    },
                },
            },
        });
    };

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        validerAlleSynligeFelter,
        valideringErOk,
        oppdaterSøknad,
    };
};

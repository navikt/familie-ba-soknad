import React from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { DatoMedUkjent } from '../../../typer/person';
import { ESivilstand } from '../../../typer/person';
import { validerDato } from '../../../utils/dato';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import useDatovelgerFeltMedJaNeiAvhengighet from '../OmDeg/useDatovelgerFeltMedJaNeiAvhengighet';
import { SamboerSpørsmålId } from './spørsmål';
import { Årsak } from './types-and-utilities';

export interface IDinLivssituasjonFeltTyper {
    årsak: Årsak | '';
    separertEnkeSkilt: ESvar | null;
    separertEnkeSkiltUtland: ESvar | null;
    separertEnkeSkiltDato: ISODateString;
    harSamboerNå: ESvar | null;
    nåværendeSamboerNavn: string;
    nåværendeSamboerFnr: string;
    nåværendeSamboerFnrUkjent: ESvar;
    nåværendeSamboerFødselsdato: DatoMedUkjent;
    nåværendeSamboerFødselsdatoUkjent: ESvar;
    nåværendeSamboerFraDato: ISODateString;
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

    const harSamboerNå: Felt<ESvar | null> = useJaNeiSpmFelt(søker.utvidet.spørsmål.harSamboerNå);

    const navn = useFelt<string>({
        feltId: SamboerSpørsmålId.navn,
        verdi: '',
        valideringsfunksjon: (felt: FeltState<string>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'omdeg.samboernå.feilmelding'} />);
        },
        avhengigheter: { harSamboerNå },
        skalFeltetVises: avhengigheter => avhengigheter.harSamboerNå.verdi === ESvar.JA,
    });

    const fnrUkjent: Felt<ESvar> = useFelt<ESvar>({
        feltId: 'utvidet-nåværende-samboer-kjennerIkkeIdent',
        verdi: ESvar.VET_IKKE,
        avhengigheter: { harSamboerNå },
        skalFeltetVises: avhengigheter => avhengigheter.harSamboerNå.verdi === ESvar.JA,
    });
    const fnr = useFelt<string>({
        feltId: 'utvidet-nåværende-samboer-fnr',
        verdi: '',
        avhengigheter: { vetIkkeCheckbox: fnrUkjent, harSamboerNå },
        skalFeltetVises: avhengigheter => avhengigheter.harSamboerNå.verdi === ESvar.JA,
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter) => {
            if (
                avhengigheter &&
                avhengigheter.vetIkkeCheckbox &&
                avhengigheter.vetIkkeCheckbox.verdi &&
                avhengigheter.vetIkkeCheckbox.verdi === ESvar.JA
            ) {
                return ok(felt);
            }
            if (felt.verdi === '') {
                return feil(
                    felt,
                    <SpråkTekst id={'omdeg.nåværendeSamboer.ident.ikkebesvart.feilmelding'} />
                );
            }
            return idnr(felt.verdi).status === 'valid'
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'omdeg.nåværendeSamboer.fnr.ugyldig.feilmelding'} />);
        },
    });

    const kjennerIkkeFødselsdato = useFelt<ESvar>({
        feltId: 'utvidet-nåværende-samboer-kjennerIkkeFødselsdato',
        verdi: ESvar.VET_IKKE,
        avhengigheter: { fnrUkjent },
        skalFeltetVises: avhengigheter => avhengigheter.fnrUkjent.verdi === ESvar.JA,
    });
    const fødselsdato = useFelt<string>({
        feltId: 'utvidet-nåværende-samboer-fødselsdato',
        verdi: '',
        avhengigheter: { vetIkkeCheckbox: kjennerIkkeFødselsdato, fnrUkjent },
        skalFeltetVises: avhengigheter => avhengigheter.fnrUkjent.verdi === ESvar.JA,
        valideringsfunksjon: (felt: FeltState<string>, avhengigheter) => {
            if (
                avhengigheter &&
                avhengigheter.vetIkkeCheckbox &&
                avhengigheter.vetIkkeCheckbox.verdi &&
                avhengigheter.vetIkkeCheckbox.verdi === ESvar.JA
            ) {
                return ok(felt);
            }
            return validerDato(felt, true);
        },
    });

    const samboerFraDato = useFelt<ISODateString>({
        feltId: 'utvidet-nåværende-samboer-samboerFraDato',
        verdi: '',
        avhengigheter: { harSamboerNå },
        skalFeltetVises: avhengigheter => avhengigheter.harSamboerNå.verdi === ESvar.JA,
        valideringsfunksjon: (felt: FeltState<string>) => validerDato(felt, true),
    });

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
            nåværendeSamboerNavn: navn,
            nåværendeSamboerFnr: fnr,
            nåværendeSamboerFnrUkjent: fnrUkjent,
            nåværendeSamboerFødselsdato: fødselsdato,
            nåværendeSamboerFødselsdatoUkjent: kjennerIkkeFødselsdato,
            nåværendeSamboerFraDato: samboerFraDato,
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
                    nåværendeSamboer: {
                        ...søknad.søker.utvidet.nåværendeSamboer,
                        navn: {
                            id: SamboerSpørsmålId.navn,
                            svar: skjema.felter.nåværendeSamboerNavn.verdi,
                        },
                        ident: {
                            id: SamboerSpørsmålId.fnr,
                            svar: skjema.felter.nåværendeSamboerFnr.verdi,
                        },
                        fødselsdato: {
                            id: SamboerSpørsmålId.fødselsdato,
                            svar: skjema.felter.nåværendeSamboerFødselsdato.verdi,
                        },
                        samboerFraDato: {
                            id: SamboerSpørsmålId.samboerFraDato,
                            svar: skjema.felter.nåværendeSamboerFraDato.verdi,
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

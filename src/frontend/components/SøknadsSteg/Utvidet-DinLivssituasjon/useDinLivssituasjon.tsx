import React from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';
import { idnr } from '@navikt/fnrvalidator';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { DatoMedUkjent } from '../../../typer/person';
import { validerDato } from '../../../utils/dato';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { SamboerSpørsmålId } from './spørsmål';
import { Årsak } from './types-and-utilities';

export interface IDinLivssituasjonFeltTyper {
    årsak: Årsak | '';
    harSamboerNå: ESvar | null;
    nåværendeSamboerNavn: string;
    nåværendeSamboerFnr: string;
    nåværendeSamboerFnrUkjent: ESvar;
    nåværendeSamboerFødselsdato: DatoMedUkjent;
    nåværendeSamboerFødselsdatoUkjent: ESvar;
    nåværendeSamboerFraDato: ISODateString;
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

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IDinLivssituasjonFeltTyper,
        string
    >({
        felter: {
            årsak,
            harSamboerNå,
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
                        harSamboerNå: {
                            ...søknad.søker.utvidet.spørsmål.harSamboerNå,
                            svar: skjema.felter.harSamboerNå.verdi,
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

import React from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import {
    AlternativtSvarForInput,
    DatoMedUkjent,
    ESivilstand,
    ISamboer,
} from '../../../typer/person';
import { validerDato } from '../../../utils/dato';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import useInputFeltMedUkjent from '../OmBarnet/useInputFeltMedUkjent';
import useDatovelgerFeltMedJaNeiAvhengighet from '../OmDeg/useDatovelgerFeltMedJaNeiAvhengighet';
import { SamboerSpørsmålId } from './spørsmål';
import { Årsak } from './types-and-utilities';
import useInputFelt from './useInputFelt';

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

    const navn = useInputFelt(
        {
            id: SamboerSpørsmålId.navn,
            svar: søknad.søker.utvidet.nåværendeSamboer?.navn.svar || '',
        },
        'omdeg.samboernå.feilmelding',
        harSamboerNå.verdi === ESvar.JA
    );

    const fnrUkjentInitiellVerdi = (nåværendeSamboer: ISamboer | null): ESvar => {
        if (nåværendeSamboer === null) return ESvar.NEI;
        if (nåværendeSamboer.ident.svar === AlternativtSvarForInput.UKJENT) return ESvar.JA;
        return ESvar.NEI;
    };
    const fnrUkjent = useFelt<ESvar>({
        feltId: SamboerSpørsmålId.fnrUkjent,
        verdi: fnrUkjentInitiellVerdi(søker.utvidet.nåværendeSamboer),
        avhengigheter: { harSamboerNå },
        skalFeltetVises: avhengigheter => avhengigheter.harSamboerNå.verdi === ESvar.JA,
        nullstillVedAvhengighetEndring: false,
    });
    const fnrInitiellVerdi = (nåværendeSamboer: ISamboer | null) => {
        if (nåværendeSamboer === null) return '';
        if (nåværendeSamboer.ident.svar === AlternativtSvarForInput.UKJENT) return '';
        return nåværendeSamboer.ident.svar;
    };
    const fnr = useInputFeltMedUkjent(
        {
            id: SamboerSpørsmålId.fnr,
            svar: fnrInitiellVerdi(søker.utvidet.nåværendeSamboer),
        },
        fnrUkjent,
        'omdeg.nåværendeSamboer.ident.ikkebesvart.feilmelding',
        true,
        harSamboerNå.verdi === ESvar.JA
    );
    // const fnr = useFelt<string>({
    //     feltId: SamboerSpørsmålId.fnr,
    //     verdi: fnrInitiellVerdi(søker.utvidet.nåværendeSamboer),
    //     avhengigheter: { vetIkkeCheckbox: fnrUkjent, harSamboerNå },
    //     skalFeltetVises: avhengigheter => avhengigheter.harSamboerNå.verdi === ESvar.JA,
    //     valideringsfunksjon: (felt: FeltState<string>, avhengigheter) => {
    //         if (
    //             avhengigheter &&
    //             avhengigheter.vetIkkeCheckbox &&
    //             avhengigheter.vetIkkeCheckbox.verdi &&
    //             avhengigheter.vetIkkeCheckbox.verdi === ESvar.JA
    //         ) {
    //             return ok(felt);
    //         }
    //         if (felt.verdi === '') {
    //             return feil(
    //                 felt,
    //                 <SpråkTekst id={'omdeg.nåværendeSamboer.ident.ikkebesvart.feilmelding'} />
    //             );
    //         }
    //         return idnr(felt.verdi).status === 'valid'
    //             ? ok(felt)
    //             : feil(
    //                   felt,
    //                   <SpråkTekst id={'omdeg.nåværendeSamboer.ident.ugyldig.feilmelding'} />
    //               );
    //     },
    // });

    const settKjennerIkkeFødselsdatoInitialValue = (nåværendeSamboer: ISamboer | null): ESvar => {
        if (nåværendeSamboer === null) return ESvar.VET_IKKE;
        if (nåværendeSamboer.fødselsdato.svar === '') return ESvar.JA;
        return ESvar.NEI;
    };
    const kjennerIkkeFødselsdato = useFelt<ESvar>({
        feltId: SamboerSpørsmålId.fødselsdatoUkjent,
        verdi: settKjennerIkkeFødselsdatoInitialValue(søker.utvidet.nåværendeSamboer),
        avhengigheter: { fnrUkjent },
        skalFeltetVises: avhengigheter => avhengigheter.fnrUkjent.verdi === ESvar.JA,
        nullstillVedAvhengighetEndring: false,
    });
    const fødselsdato = useFelt<string>({
        feltId: SamboerSpørsmålId.fødselsdato,
        verdi: søker.utvidet.nåværendeSamboer?.fødselsdato.svar || '',
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
        feltId: SamboerSpørsmålId.samboerFraDato,
        verdi: søker.utvidet.nåværendeSamboer?.samboerFraDato.svar || '',
        avhengigheter: { harSamboerNå },
        skalFeltetVises: avhengigheter => avhengigheter.harSamboerNå.verdi === ESvar.JA,
        valideringsfunksjon: (felt: FeltState<string>) => validerDato(felt, true),
    });
    //
    // useEffect(() => {
    //     if (søker.utvidet.nåværendeSamboer) {
    //         samboerFraDato.valider();
    //     }
    // });

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
                    nåværendeSamboer:
                        harSamboerNå.verdi === ESvar.JA
                            ? {
                                  ...søknad.søker.utvidet.nåværendeSamboer,
                                  navn: {
                                      id: SamboerSpørsmålId.navn,
                                      svar: skjema.felter.nåværendeSamboerNavn.verdi,
                                  },
                                  ident: {
                                      id: SamboerSpørsmålId.fnr,
                                      svar: svarForSpørsmålMedUkjent(
                                          skjema.felter.nåværendeSamboerFnrUkjent,
                                          skjema.felter.nåværendeSamboerFnr
                                      ),
                                  },
                                  fødselsdato: {
                                      id: SamboerSpørsmålId.fødselsdato,
                                      svar: svarForSpørsmålMedUkjent(
                                          skjema.felter.nåværendeSamboerFødselsdatoUkjent,
                                          skjema.felter.nåværendeSamboerFødselsdato
                                      ),
                                  },
                                  samboerFraDato: {
                                      id: SamboerSpørsmålId.samboerFraDato,
                                      svar: skjema.felter.nåværendeSamboerFraDato.verdi,
                                  },
                              }
                            : null,
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

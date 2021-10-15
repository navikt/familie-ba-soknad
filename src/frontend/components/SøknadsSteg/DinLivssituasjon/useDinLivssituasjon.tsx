import React, { useState } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useDatovelgerFeltMedJaNeiAvhengighet from '../../../hooks/useDatovelgerFeltMedJaNeiAvhengighet';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFeltMedJaNeiAvhengighet from '../../../hooks/useLanddropdownFeltMedJaNeiAvhengighet';
import { Dokumentasjonsbehov } from '../../../typer/dokumentasjon';
import {
    AlternativtSvarForInput,
    DatoMedUkjent,
    ESivilstand,
    ISamboer,
    ITidligereSamboer,
} from '../../../typer/person';
import { Årsak } from '../../../typer/søknad';
import { dagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { SamboerSpørsmålId } from './spørsmål';

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
    erAsylsøker: ESvar | null;
    jobberPåBåt: ESvar | null;
    arbeidsland: Alpha3Code | '';
    mottarUtenlandspensjon: ESvar | null;
    pensjonsland: Alpha3Code | '';
}

export const useDinLivssituasjon = (): {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
    leggTilTidligereSamboer: (samboer: ITidligereSamboer) => void;
    fjernTidligereSamboer: (samboer: ITidligereSamboer) => void;
    tidligereSamboere: ITidligereSamboer[];
} => {
    const { søknad, settSøknad, erUtvidet } = useApp();
    const søker = søknad.søker;
    const [tidligereSamboere, settTidligereSamboere] = useState<ITidligereSamboer[]>(
        søker.utvidet.tidligereSamboere
    );

    /*---- UTVIDET BARNETRYGD ----*/
    const årsak = useFelt<Årsak | ''>({
        feltId: søker.utvidet.spørsmål.årsak.id,
        verdi: søker.utvidet.spørsmål.årsak.svar,
        valideringsfunksjon: (felt: FeltState<Årsak | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'omdeg.velgårsak.feilmelding'} />);
        },
        skalFeltetVises: () => erUtvidet,
    });

    const separertEnkeSkilt = useJaNeiSpmFelt(
        søker.utvidet.spørsmål.separertEnkeSkilt,
        'omdeg.separertellerskilt.feilmelding',
        undefined,
        false,
        søker.sivilstand.type !== ESivilstand.GIFT || !erUtvidet
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
                : feil(felt, <SpråkTekst id={'omdeg.separertskiltiutlandet.feilmelding'} />);
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
        separertEnkeSkilt,
        'omdeg.frahvilkendatoseparertskilt.feilmelding'
    );

    /*---- NÅVÆRENDE SAMBOER ----*/
    const harSamboerNå: Felt<ESvar | null> = useJaNeiSpmFelt(
        søker.harSamboerNå,
        'omdeg.samboernå.feilmelding'
    );

    const nåværendeSamboerNavn = useInputFelt(
        {
            id: SamboerSpørsmålId.nåværendeSamboerNavn,
            svar: søknad.søker.nåværendeSamboer?.navn.svar || '',
        },
        'omdeg.samboerNavn.feilmelding',
        harSamboerNå.verdi === ESvar.JA
    );

    const fnrUkjentInitiellVerdi = (nåværendeSamboer: ISamboer | null): ESvar => {
        if (nåværendeSamboer === null) return ESvar.NEI;
        if (nåværendeSamboer.ident.svar === AlternativtSvarForInput.UKJENT) return ESvar.JA;
        return ESvar.NEI;
    };
    const nåværendeSamboerFnrUkjent = useFelt<ESvar>({
        feltId: SamboerSpørsmålId.nåværendeSamboerFnrUkjent,
        verdi: fnrUkjentInitiellVerdi(søker.nåværendeSamboer),
        avhengigheter: { harSamboerNå },
        skalFeltetVises: avhengigheter => avhengigheter.harSamboerNå.verdi === ESvar.JA,
    });
    const fnrInitiellVerdi = (nåværendeSamboer: ISamboer | null) => {
        if (nåværendeSamboer === null) return '';
        if (nåværendeSamboer.ident.svar === AlternativtSvarForInput.UKJENT) return '';
        return nåværendeSamboer.ident.svar;
    };
    const nåværendeSamboerFnr = useInputFeltMedUkjent(
        {
            id: SamboerSpørsmålId.nåværendeSamboerFnr,
            svar: fnrInitiellVerdi(søker.nåværendeSamboer),
        },
        nåværendeSamboerFnrUkjent,
        'omdeg.samboer.ident.ikkebesvart.feilmelding',
        true,
        harSamboerNå.verdi === ESvar.JA
    );
    const settKjennerIkkeFødselsdatoInitialValue = (nåværendeSamboer: ISamboer | null): ESvar => {
        if (nåværendeSamboer === null) return ESvar.NEI;
        if (nåværendeSamboer.fødselsdato.svar === AlternativtSvarForInput.UKJENT) return ESvar.JA;
        return ESvar.NEI;
    };
    const nåværendeSamboerFødselsdatoUkjent = useFelt<ESvar>({
        feltId: SamboerSpørsmålId.nåværendeSamboerFødselsdatoUkjent,
        verdi: settKjennerIkkeFødselsdatoInitialValue(søker.nåværendeSamboer),
        avhengigheter: { fnrUkjent: nåværendeSamboerFnrUkjent },
        skalFeltetVises: avhengigheter => avhengigheter.fnrUkjent.verdi === ESvar.JA,
        nullstillVedAvhengighetEndring: false,
    });
    const getInitialFødselsdato = (nåværendeSamboer: ISamboer | null) => {
        if (nåværendeSamboer === null) return '';
        if (nåværendeSamboer.fødselsdato.svar === AlternativtSvarForInput.UKJENT) return '';
        return nåværendeSamboer.fødselsdato.svar;
    };

    const nåværendeSamboerFødselsdato = useDatovelgerFeltMedUkjent(
        SamboerSpørsmålId.nåværendeSamboerFødselsdato,
        getInitialFødselsdato(søker.nåværendeSamboer),
        nåværendeSamboerFødselsdatoUkjent,
        'omdeg.nåværendesamboer.fødselsdato.ukjent',
        nåværendeSamboerFnrUkjent.verdi === ESvar.JA
    );

    const nåværendeSamboerFraDato = useDatovelgerFeltMedJaNeiAvhengighet(
        {
            id: SamboerSpørsmålId.nåværendeSamboerFraDato,
            svar: søker.nåværendeSamboer?.samboerFraDato.svar || '',
        },
        ESvar.JA,
        harSamboerNå,
        'omdeg.nårstartetsamboerforhold.feilmelding',
        dagensDato()
    );

    /*--- ASYL ARBEID OG PENSJON ----*/

    const erAsylsøker = useJaNeiSpmFelt(søker.erAsylsøker, 'omdeg.asylsøker.feilmelding');

    const jobberPåBåt = useJaNeiSpmFelt(søker.jobberPåBåt, 'omdeg.arbeid-utland.feilmelding');

    const arbeidsland = useLanddropdownFeltMedJaNeiAvhengighet(
        søker.arbeidsland,
        'omdeg.arbeid-utland.land.feilmelding',
        ESvar.JA,
        jobberPåBåt
    );

    const mottarUtenlandspensjon = useJaNeiSpmFelt(
        søker.mottarUtenlandspensjon,
        'omdeg.utenlandspensjon.feilmelding'
    );

    const pensjonsland = useLanddropdownFeltMedJaNeiAvhengighet(
        søker.pensjonsland,
        'omdeg.utenlandspensjon.land.feilmelding',
        ESvar.JA,
        mottarUtenlandspensjon
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
            nåværendeSamboerNavn,
            nåværendeSamboerFnr,
            nåværendeSamboerFnrUkjent,
            nåværendeSamboerFødselsdato,
            nåværendeSamboerFødselsdatoUkjent,
            nåværendeSamboerFraDato,
            erAsylsøker,
            jobberPåBåt,
            arbeidsland,
            mottarUtenlandspensjon,
            pensjonsland,
        },
        skjemanavn: 'dinlivssituasjon',
    });

    const leggTilTidligereSamboer = (samboer: ITidligereSamboer) => {
        settTidligereSamboere(prevState => prevState.concat(samboer));
    };

    const fjernTidligereSamboer = (samboerSomSkalFjernes: ITidligereSamboer) => {
        settTidligereSamboere(prevState =>
            prevState.filter(samboer => samboer !== samboerSomSkalFjernes)
        );
    };

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                if (dok.dokumentasjonsbehov === Dokumentasjonsbehov.SEPARERT_SKILT_ENKE)
                    return { ...dok, gjelderForSøker: separertEnkeSkilt.verdi === ESvar.JA };
                else if (dok.dokumentasjonsbehov === Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE)
                    return { ...dok, gjelderForSøker: erAsylsøker.verdi === ESvar.JA };
                else return dok;
            }),
            søker: {
                ...søknad.søker,
                harSamboerNå: {
                    ...søknad.søker.harSamboerNå,
                    svar: skjema.felter.harSamboerNå.verdi,
                },
                nåværendeSamboer:
                    harSamboerNå.verdi === ESvar.JA
                        ? {
                              ...søknad.søker.nåværendeSamboer,
                              navn: {
                                  id: SamboerSpørsmålId.nåværendeSamboerNavn,
                                  svar: trimWhiteSpace(skjema.felter.nåværendeSamboerNavn.verdi),
                              },
                              ident: {
                                  id: SamboerSpørsmålId.nåværendeSamboerFnr,
                                  svar: svarForSpørsmålMedUkjent(
                                      skjema.felter.nåværendeSamboerFnrUkjent,
                                      skjema.felter.nåværendeSamboerFnr
                                  ),
                              },
                              fødselsdato: {
                                  id: SamboerSpørsmålId.nåværendeSamboerFødselsdato,
                                  svar: svarForSpørsmålMedUkjent(
                                      skjema.felter.nåværendeSamboerFødselsdatoUkjent,
                                      skjema.felter.nåværendeSamboerFødselsdato
                                  ),
                              },
                              samboerFraDato: {
                                  id: SamboerSpørsmålId.nåværendeSamboerFraDato,
                                  svar: skjema.felter.nåværendeSamboerFraDato.verdi,
                              },
                          }
                        : null,
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
                utvidet: {
                    ...søknad.søker.utvidet,
                    tidligereSamboere,
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
        tidligereSamboere,
        leggTilTidligereSamboer,
        fjernTidligereSamboer,
    };
};

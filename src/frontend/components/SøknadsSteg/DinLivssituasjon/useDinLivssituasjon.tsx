import React, { useEffect, useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useDatovelgerFeltMedJaNeiAvhengighet from '../../../hooks/useDatovelgerFeltMedJaNeiAvhengighet';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFeltMedJaNeiAvhengighet from '../../../hooks/useLanddropdownFeltMedJaNeiAvhengighet';
import { AlternativtSvarForInput } from '../../../typer/common';
import { Dokumentasjonsbehov } from '../../../typer/dokumentasjon';
import {
    barnDataKeySpørsmål,
    ESivilstand,
    IArbeidsperiode,
    ISamboer,
    ISøker,
    ITidligereSamboer,
} from '../../../typer/person';
import { IDinLivssituasjonFeltTyper } from '../../../typer/skjema';
import { Årsak } from '../../../typer/utvidet';
import { dagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { arbeidsperiodeFeilmelding } from '../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { useArbeidsperioder } from '../../Felleskomponenter/Arbeidsperiode/useArbeidsperioder';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';
import { SamboerSpørsmålId } from './spørsmål';

export const useDinLivssituasjon = (): {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
    leggTilTidligereSamboer: (samboer: ITidligereSamboer) => void;
    fjernTidligereSamboer: (samboer: ITidligereSamboer) => void;
    tidligereSamboere: ITidligereSamboer[];
    arbeidsperioder: IArbeidsperiode[];
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
} => {
    const { søknad, settSøknad, erUtvidet } = useApp();
    const { skalTriggeEøsForSøker, søkerTriggerEøs, settSøkerTriggerEøs } = useEøs();
    const { toggles } = useFeatureToggles();
    const søker = søknad.søker;
    const [tidligereSamboere, settTidligereSamboere] = useState<ITidligereSamboer[]>(
        søker.utvidet.tidligereSamboere
    );
    const { arbeidsperioder, fjernArbeidsperiode, leggTilArbeidsperiode } = useArbeidsperioder(
        søker.arbeidsperioder
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

    const separertEnkeSkilt = useJaNeiSpmFelt({
        søknadsfelt: søker.utvidet.spørsmål.separertEnkeSkilt,
        feilmeldingSpråkId: 'omdeg.separertellerskilt.feilmelding',
        skalSkjules: søker.sivilstand.type !== ESivilstand.GIFT || !erUtvidet,
    });

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

    const separertEnkeSkiltDato = useDatovelgerFeltMedJaNeiAvhengighet({
        søknadsfelt: søker.utvidet.spørsmål.separertEnkeSkiltDato,
        avhengigSvarCondition: ESvar.JA,
        avhengighet: separertEnkeSkilt,
        feilmeldingSpråkId: 'omdeg.frahvilkendatoseparertskilt.feilmelding',
    });

    /*---- NÅVÆRENDE SAMBOER ----*/
    const harSamboerNå: Felt<ESvar | null> = useJaNeiSpmFelt({
        søknadsfelt: søker.harSamboerNå,
        feilmeldingSpråkId:
            søker.sivilstand.type === ESivilstand.GIFT
                ? 'omdeg.samboernå.gift.feilmelding'
                : 'omdeg.samboernå.feilmelding',
    });

    const nåværendeSamboerNavn = useInputFelt({
        søknadsfelt: {
            id: SamboerSpørsmålId.nåværendeSamboerNavn,
            svar: søknad.søker.nåværendeSamboer?.navn.svar || '',
        },
        feilmeldingSpråkId: 'omdeg.samboerNavn.feilmelding',
        skalVises: harSamboerNå.verdi === ESvar.JA,
    });

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
    const nåværendeSamboerFnr = useInputFeltMedUkjent({
        søknadsfelt: {
            id: SamboerSpørsmålId.nåværendeSamboerFnr,
            svar: fnrInitiellVerdi(søker.nåværendeSamboer),
        },
        avhengighet: nåværendeSamboerFnrUkjent,
        feilmeldingSpråkId: 'omdeg.samboer.ident.ikkebesvart.feilmelding',
        erFnrInput: true,
        skalVises: harSamboerNå.verdi === ESvar.JA,
    });
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

    const nåværendeSamboerFødselsdato = useDatovelgerFeltMedUkjent({
        feltId: SamboerSpørsmålId.nåværendeSamboerFødselsdato,
        initiellVerdi: getInitialFødselsdato(søker.nåværendeSamboer),
        vetIkkeCheckbox: nåværendeSamboerFødselsdatoUkjent,
        feilmeldingSpråkId: 'omdeg.nåværendesamboer.fødselsdato.ukjent',
        skalFeltetVises: nåværendeSamboerFnrUkjent.verdi === ESvar.JA,
        sluttdatoAvgrensning: dagensDato(),
    });

    const nåværendeSamboerFraDato = useDatovelgerFeltMedJaNeiAvhengighet({
        søknadsfelt: {
            id: SamboerSpørsmålId.nåværendeSamboerFraDato,
            svar: søker.nåværendeSamboer?.samboerFraDato.svar || '',
        },
        avhengigSvarCondition: ESvar.JA,
        avhengighet: harSamboerNå,
        feilmeldingSpråkId: 'omdeg.nårstartetsamboerforhold.feilmelding',
        sluttdatoAvgrensning: dagensDato(),
    });

    /*--- ASYL ARBEID OG PENSJON ----*/

    const erAsylsøker = useJaNeiSpmFelt({
        søknadsfelt: søker.erAsylsøker,
        feilmeldingSpråkId: 'omdeg.asylsøker.feilmelding',
    });

    const jobberPåBåt = useJaNeiSpmFelt({
        søknadsfelt: søker.jobberPåBåt,
        feilmeldingSpråkId: 'omdeg.arbeid-utland.feilmelding',
    });

    const arbeidsland = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: søker.arbeidsland,
        feilmeldingSpråkId: 'omdeg.arbeid-utland.land.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: jobberPåBåt,
        skalFeltetVises: !toggles.EØS_KOMPLETT,
    });

    const registrerteArbeidsperioder = useFelt<IArbeidsperiode[]>({
        verdi: arbeidsperioder,
        avhengigheter: { jobberPåBåt },
        skalFeltetVises: avhengigheter =>
            avhengigheter.jobberPåBåt.verdi === ESvar.JA && toggles.EØS_KOMPLETT,
        valideringsfunksjon: felt =>
            jobberPåBåt.verdi === ESvar.JA && felt.verdi.length === 0
                ? feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(true)} />)
                : ok(felt),
    });

    useEffect(() => {
        registrerteArbeidsperioder.validerOgSettFelt(arbeidsperioder);
    }, [arbeidsperioder]);

    const mottarUtenlandspensjon = useJaNeiSpmFelt({
        søknadsfelt: søker.mottarUtenlandspensjon,
        feilmeldingSpråkId: 'omdeg.utenlandspensjon.feilmelding',
    });

    const pensjonsland = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: søker.pensjonsland,
        feilmeldingSpråkId: 'omdeg.utenlandspensjon.land.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: mottarUtenlandspensjon,
    });

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
            registrerteArbeidsperioder,
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

    const erEnkeEnkemann = () =>
        skjema.felter.årsak.verdi === Årsak.ENKE_ENKEMANN ||
        søknad.søker.sivilstand.type === ESivilstand.ENKE_ELLER_ENKEMANN ||
        søknad.søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER;

    const enkeSpørsmålId = () => {
        if (skjema.felter.årsak.verdi === Årsak.ENKE_ENKEMANN) {
            return OmBarnaDineSpørsmålId.erOppgittAvdødPartnerForelder;
        } else if (søknad.søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER) {
            return OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder;
        } else {
            return OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder;
        }
    };

    const genererOppdatertSøker = (): ISøker => ({
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
        arbeidsperioder:
            skjema.felter.jobberPåBåt.verdi === ESvar.JA
                ? skjema.felter.registrerteArbeidsperioder.verdi
                : [],

        mottarUtenlandspensjon: {
            ...søknad.søker.mottarUtenlandspensjon,
            svar: skjema.felter.mottarUtenlandspensjon.verdi,
        },
        pensjonsland: {
            ...søknad.søker.pensjonsland,
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
    });

    useEffect(() => {
        const oppdatertSøker = genererOppdatertSøker();
        skalTriggeEøsForSøker(oppdatertSøker) !== søkerTriggerEøs &&
            settSøkerTriggerEøs(prevState => !prevState);
    }, [arbeidsland, pensjonsland, jobberPåBåt, mottarUtenlandspensjon]);

    const oppdaterSøknad = () => {
        const oppdatertSøker = genererOppdatertSøker();
        settSøknad({
            ...søknad,
            erAvdødPartnerForelder: {
                id: enkeSpørsmålId(),
                svar: erEnkeEnkemann() ? søknad.erAvdødPartnerForelder.svar : null,
            },
            barnInkludertISøknaden: søknad.barnInkludertISøknaden.map(barn => ({
                ...barn,
                andreForelderErDød: {
                    ...barn[barnDataKeySpørsmål.andreForelderErDød],
                    svar: erEnkeEnkemann()
                        ? barn[barnDataKeySpørsmål.andreForelderErDød].svar
                        : ESvar.NEI,
                },
            })),
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                if (dok.dokumentasjonsbehov === Dokumentasjonsbehov.SEPARERT_SKILT_ENKE)
                    return { ...dok, gjelderForSøker: separertEnkeSkilt.verdi === ESvar.JA };
                else if (dok.dokumentasjonsbehov === Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE)
                    return { ...dok, gjelderForSøker: erAsylsøker.verdi === ESvar.JA };
                else return dok;
            }),
            søker: { ...oppdatertSøker, triggetEøs: skalTriggeEøsForSøker(oppdatertSøker) },
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
        arbeidsperioder,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
    };
};

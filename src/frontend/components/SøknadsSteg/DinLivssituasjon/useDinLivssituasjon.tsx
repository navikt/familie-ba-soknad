import React, { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useDatovelgerFeltMedJaNeiAvhengighet from '../../../hooks/useDatovelgerFeltMedJaNeiAvhengighet';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { usePerioder } from '../../../hooks/usePerioder';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { AlternativtSvarForInput } from '../../../typer/common';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand } from '../../../typer/kontrakt/generelle';
import { IArbeidsperiode, IPensjonsperiode } from '../../../typer/perioder';
import { ISamboer, ISøker, ITidligereSamboer } from '../../../typer/person';
import { PersonType } from '../../../typer/personType';
import { IDinLivssituasjonFeltTyper } from '../../../typer/skjema';
import { Årsak } from '../../../typer/utvidet';
import { nullstilteEøsFelterForBarn } from '../../../utils/barn';
import { dagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { arbeidsperiodeFeilmelding } from '../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import { pensjonsperiodeFeilmelding } from '../../Felleskomponenter/Pensjonsmodal/språkUtils';
import { PensjonsperiodeSpørsmålId } from '../../Felleskomponenter/Pensjonsmodal/spørsmål';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { idNummerLand } from '../EøsSteg/idnummerUtils';
import { OmBarnaDineSpørsmålId } from '../OmBarnaDine/spørsmål';

import { DinLivssituasjonSpørsmålId, SamboerSpørsmålId } from './spørsmål';

export const useDinLivssituasjon = (): {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
    leggTilTidligereSamboer: (samboer: ITidligereSamboer) => void;
    fjernTidligereSamboer: (samboer: ITidligereSamboer) => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
} => {
    const { søknad, settSøknad, erUtvidet } = useApp();
    const { skalTriggeEøsForSøker, søkerTriggerEøs, settSøkerTriggerEøs, erEøsLand } = useEøs();
    const søker = søknad.søker;

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
    const harSamboerNå = useJaNeiSpmFelt({
        søknadsfelt: søker.utvidet.spørsmål.harSamboerNå,
        feilmeldingSpråkId:
            søker.sivilstand.type === ESivilstand.GIFT
                ? 'omdeg.samboernå.gift.feilmelding'
                : 'omdeg.samboernå.feilmelding',
        skalSkjules: !erUtvidet,
    });

    const nåværendeSamboerNavn = useInputFelt({
        søknadsfelt: {
            id: SamboerSpørsmålId.nåværendeSamboerNavn,
            svar: søknad.søker.utvidet.nåværendeSamboer?.navn.svar || '',
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
        verdi: fnrUkjentInitiellVerdi(søker.utvidet.nåværendeSamboer),
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
            svar: fnrInitiellVerdi(søker.utvidet.nåværendeSamboer),
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
        verdi: settKjennerIkkeFødselsdatoInitialValue(søker.utvidet.nåværendeSamboer),
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
        initiellVerdi: getInitialFødselsdato(søker.utvidet.nåværendeSamboer),
        vetIkkeCheckbox: nåværendeSamboerFødselsdatoUkjent,
        feilmeldingSpråkId: 'omdeg.nåværendesamboer.fødselsdato.ukjent',
        skalFeltetVises: nåværendeSamboerFnrUkjent.verdi === ESvar.JA,
        sluttdatoAvgrensning: dagensDato(),
    });

    const nåværendeSamboerFraDato = useDatovelgerFeltMedJaNeiAvhengighet({
        søknadsfelt: {
            id: SamboerSpørsmålId.nåværendeSamboerFraDato,
            svar: søker.utvidet.nåværendeSamboer?.samboerFraDato.svar || '',
        },
        avhengigSvarCondition: ESvar.JA,
        avhengighet: harSamboerNå,
        feilmeldingSpråkId: 'omdeg.nårstartetsamboerforhold.feilmelding',
        sluttdatoAvgrensning: dagensDato(),
    });

    /*--- TIDLIGERE SAMBOER ---*/
    const hattFlereSamboereForSøktPeriode = useJaNeiSpmFelt({
        søknadsfelt: søker.utvidet.spørsmål.hattFlereSamboereForSøktPeriode,
        feilmeldingSpråkId: 'omdeg.tidligereSamboer.feilmelding',
        skalSkjules: !erUtvidet,
    });

    const {
        fjernPeriode: fjernTidligereSamboer,
        leggTilPeriode: leggTilTidligereSamboer,
        registrertePerioder: tidligereSamboere,
    } = usePerioder<ITidligereSamboer>({
        feltId: `${DinLivssituasjonSpørsmålId.hattFlereSamboereForSøktPeriode}-${PersonType.Søker}`,
        verdi: søker.utvidet.tidligereSamboere,
        avhengigheter: { hattFlereSamboereForSøktPeriode },
        skalFeltetVises: avhengigheter =>
            avhengigheter.hattFlereSamboereForSøktPeriode.verdi === ESvar.JA,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.hattFlereSamboereForSøktPeriode.verdi === ESvar.NEI ||
                (avhengigheter?.hattFlereSamboereForSøktPeriode.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'omdeg.tidligereSamboer.feilmelding'} />);
        },
    });

    /*--- ASYL ARBEID OG PENSJON ----*/

    const erAsylsøker = useJaNeiSpmFelt({
        søknadsfelt: søker.erAsylsøker,
        feilmeldingSpråkId: 'omdeg.asylsøker.feilmelding',
    });

    const arbeidIUtlandet = useJaNeiSpmFelt({
        søknadsfelt: søker.arbeidIUtlandet,
        feilmeldingSpråkId: 'eøs.arbeid-utland.feilmelding',
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: registrerteArbeidsperioder,
    } = usePerioder<IArbeidsperiode>({
        feltId: `${ArbeidsperiodeSpørsmålsId.arbeidsperioderUtland}-${PersonType.Søker}`,
        verdi: søker.arbeidsperioderUtland,
        avhengigheter: { arbeidIUtlandet },
        skalFeltetVises: avhengigheter => avhengigheter.arbeidIUtlandet.verdi === ESvar.JA,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.arbeidIUtlandet.verdi === ESvar.NEI ||
                (avhengigheter?.arbeidIUtlandet.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(true)} />);
        },
    });

    const mottarUtenlandspensjon = useJaNeiSpmFelt({
        søknadsfelt: søker.mottarUtenlandspensjon,
        feilmeldingSpråkId: 'omdeg.pensjonutland.feilmelding',
    });

    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: registrertePensjonsperioder,
    } = usePerioder<IPensjonsperiode>({
        feltId: `${PensjonsperiodeSpørsmålId.pensjonsperioderUtland}-${PersonType.Søker}`,
        verdi: søker.pensjonsperioderUtland,
        avhengigheter: { mottarUtenlandspensjon },
        skalFeltetVises: avhengigheter => avhengigheter.mottarUtenlandspensjon.verdi === ESvar.JA,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.mottarUtenlandspensjon.verdi === ESvar.NEI ||
                (avhengigheter?.mottarUtenlandspensjon.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={pensjonsperiodeFeilmelding(true)} />);
        },
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
            hattFlereSamboereForSøktPeriode,
            nåværendeSamboerNavn,
            nåværendeSamboerFnr,
            nåværendeSamboerFnrUkjent,
            nåværendeSamboerFødselsdato,
            nåværendeSamboerFødselsdatoUkjent,
            nåværendeSamboerFraDato,
            erAsylsøker,
            arbeidIUtlandet,
            tidligereSamboere,
            registrerteArbeidsperioder,
            mottarUtenlandspensjon,
            registrertePensjonsperioder,
        },
        skjemanavn: 'dinlivssituasjon',
    });

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

    const filtrerteRelevanteIdNummer = () => {
        return søknad.søker.idNummer.filter(idNummer => {
            return idNummerLand(
                {
                    arbeidsperioderUtland:
                        arbeidIUtlandet.verdi === ESvar.JA ? registrerteArbeidsperioder.verdi : [],
                    pensjonsperioderUtland:
                        mottarUtenlandspensjon.verdi === ESvar.JA
                            ? registrertePensjonsperioder.verdi
                            : [],
                    utenlandsperioder: søker.utenlandsperioder,
                },
                erEøsLand
            ).includes(idNummer.land);
        });
    };

    const genererOppdatertSøker = (): ISøker => ({
        ...søknad.søker,
        erAsylsøker: {
            ...søknad.søker.erAsylsøker,
            svar: skjema.felter.erAsylsøker.verdi,
        },
        arbeidIUtlandet: {
            ...søknad.søker.arbeidIUtlandet,
            svar: skjema.felter.arbeidIUtlandet.verdi,
        },
        arbeidsperioderUtland:
            skjema.felter.arbeidIUtlandet.verdi === ESvar.JA
                ? skjema.felter.registrerteArbeidsperioder.verdi
                : [],
        mottarUtenlandspensjon: {
            ...søknad.søker.mottarUtenlandspensjon,
            svar: skjema.felter.mottarUtenlandspensjon.verdi,
        },
        pensjonsperioderUtland:
            skjema.felter.mottarUtenlandspensjon.verdi === ESvar.JA
                ? skjema.felter.registrertePensjonsperioder.verdi
                : [],
        idNummer: filtrerteRelevanteIdNummer(),
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
                hattFlereSamboereForSøktPeriode: {
                    ...søknad.søker.utvidet.spørsmål.hattFlereSamboereForSøktPeriode,
                    svar: skjema.felter.hattFlereSamboereForSøktPeriode.verdi,
                },
            },
            nåværendeSamboer:
                harSamboerNå.verdi === ESvar.JA
                    ? {
                          ...søknad.søker.utvidet.nåværendeSamboer,
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
            tidligereSamboere:
                skjema.felter.hattFlereSamboereForSøktPeriode.verdi === ESvar.JA
                    ? skjema.felter.tidligereSamboere.verdi
                    : [],
        },
    });

    useEffect(() => {
        const oppdatertSøker = genererOppdatertSøker();
        skalTriggeEøsForSøker(oppdatertSøker) !== søkerTriggerEøs &&
            settSøkerTriggerEøs(prevState => !prevState);
    }, [arbeidIUtlandet, mottarUtenlandspensjon]);

    const oppdaterSøknad = () => {
        const oppdatertSøker = genererOppdatertSøker();
        const søkerTriggetEøs = skalTriggeEøsForSøker(oppdatertSøker);
        const harEøsSteg =
            søkerTriggetEøs || !!søknad.barnInkludertISøknaden.find(barn => barn.triggetEøs);

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
            søker: {
                ...oppdatertSøker,
                triggetEøs: søkerTriggetEøs,
                ...(!harEøsSteg && nullstilteEøsFelterForSøker(søknad.søker)),
            },
            ...(!harEøsSteg && {
                barnInkludertISøknaden: søknad.barnInkludertISøknaden.map(barn => ({
                    ...barn,
                    ...nullstilteEøsFelterForBarn(barn),
                })),
            }),
        });
    };

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        validerAlleSynligeFelter,
        valideringErOk,
        oppdaterSøknad,
        leggTilTidligereSamboer,
        fjernTidligereSamboer,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        fjernPensjonsperiode,
        leggTilPensjonsperiode,
    };
};

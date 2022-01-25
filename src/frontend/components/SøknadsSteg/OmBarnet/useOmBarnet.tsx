import React, { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedJaNeiAvhengighet from '../../../hooks/useDatovelgerFeltMedJaNeiAvhengighet';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import useLanddropdownFeltMedJaNeiAvhengighet from '../../../hooks/useLanddropdownFeltMedJaNeiAvhengighet';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IBarnMedISøknad,
} from '../../../typer/barn';
import { AlternativtSvarForInput, BarnetsId } from '../../../typer/common';
import { IDokumentasjon } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand, ESøknadstype } from '../../../typer/kontrakt/generelle';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { Årsak } from '../../../typer/utvidet';
import { erNorskPostnummer } from '../../../utils/adresse';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent, formaterVerdiForCheckbox } from '../../../utils/input';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { flyttetPermanentFraNorge } from '../../../utils/utenlandsopphold';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { OmBarnetSpørsmålsId } from './spørsmål';

export const useOmBarnet = (
    barnetsUuid: BarnetsId
): {
    skjema: ISkjema<IOmBarnetUtvidetFeltTyper, string>;
    barn: IBarnMedISøknad | undefined;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    andreBarnSomErFyltUt: IBarnMedISøknad[];
    validerAlleSynligeFelter: () => void;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    utenlandsperioder: IUtenlandsperiode[];
} => {
    const { søknad, settSøknad, erUtvidet } = useApp();
    const intl = useIntl();
    const { skalTriggeEøsForBarn, barnSomTriggerEøs, settBarnSomTriggerEøs } = useEøs();

    const barn = søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid);

    if (!barn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const [utenlandsperioder, settUtenlandsperioder] = useState<IUtenlandsperiode[]>(
        barn.utenlandsperioder
    );

    const skalFeltetVises = (
        søknadsdataFelt: Exclude<
            barnDataKeySpørsmål,
            barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId
        >
    ) => {
        return barn[søknadsdataFelt].svar === ESvar.JA;
    };

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt && barnISøknad.id !== barn.id && !!barnISøknad.andreForelder
    );

    /*---INSTITUSJON---*/

    const institusjonIUtlandCheckbox = useFelt<ESvar>({
        verdi: barn[barnDataKeySpørsmål.institusjonIUtland].svar,
        feltId: OmBarnetSpørsmålsId.institusjonIUtland,
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonsnavn = useInputFelt({
        søknadsfelt: barn[barnDataKeySpørsmål.institusjonsnavn],
        feilmeldingSpråkId: 'ombarnet.institusjon.navn.feilmelding',
        skalVises:
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            institusjonIUtlandCheckbox.verdi === ESvar.NEI,
    });

    const institusjonsadresse = useInputFelt({
        søknadsfelt: barn[barnDataKeySpørsmål.institusjonsadresse],
        feilmeldingSpråkId: 'ombarnet.institusjon.adresse.feilmelding',
        skalVises:
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            institusjonIUtlandCheckbox.verdi === ESvar.NEI,
    });

    const institusjonspostnummer = useFelt<string>({
        verdi: barn[barnDataKeySpørsmål.institusjonspostnummer].svar,
        feltId: barn[barnDataKeySpørsmål.institusjonspostnummer].id,
        valideringsfunksjon: felt =>
            erNorskPostnummer(trimWhiteSpace(felt.verdi))
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst
                          id={
                              trimWhiteSpace(felt.verdi) === ''
                                  ? 'ombarnet.institusjon.postnummer.feilmelding'
                                  : 'ombarnet.institusjon.postnummer.format.feilmelding'
                          }
                      />
                  ),
        skalFeltetVises: avhengigheter =>
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            avhengigheter.institusjonIUtlandCheckbox.verdi === ESvar.NEI,
        avhengigheter: { institusjonIUtlandCheckbox },
    });

    const institusjonOppholdStartdato = useDatovelgerFelt({
        søknadsfelt: barn[barnDataKeySpørsmål.institusjonOppholdStartdato],
        skalFeltetVises: skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
        feilmeldingSpråkId: 'ombarnet.institusjon.startdato.feilmelding',
        sluttdatoAvgrensning: dagensDato(),
    });

    const institusjonOppholdSluttVetIkke = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.institusjonOppholdVetIkke,
    });

    const institusjonOppholdSluttdato = useDatovelgerFeltMedUkjent({
        feltId: barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].id,
        initiellVerdi:
            barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar !==
            AlternativtSvarForInput.UKJENT
                ? barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar
                : '',
        vetIkkeCheckbox: institusjonOppholdSluttVetIkke,
        feilmeldingSpråkId: 'ombarnet.institusjon.sluttdato.feilmelding',
        skalFeltetVises: skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
        nullstillVedAvhengighetEndring: false,
        startdatoAvgrensning: institusjonOppholdStartdato.verdi,
    });

    /*---UTENLANDSOPPHOLD---*/

    const registrerteUtenlandsperioder = useFelt<IUtenlandsperiode[]>({
        feltId: UtenlandsoppholdSpørsmålId.utenlandsopphold,
        verdi: barn.utenlandsperioder,
        valideringsfunksjon: felt => {
            return felt.verdi.length
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.leggtilutenlands.feilmelding'} />);
        },
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge),
    });

    useEffect(() => {
        registrerteUtenlandsperioder.validerOgSettFelt(utenlandsperioder);
    }, [utenlandsperioder]);

    const planleggerÅBoINorge12Mnd = useJaNeiSpmFelt({
        søknadsfelt: barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
        feilmeldingSpråkId: 'ombarnet.oppholdtsammenhengende.feilmelding',
        feilmeldingSpråkVerdier: { barn: barnetsNavnValue(barn, intl) },
        skalSkjules:
            !skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge) ||
            flyttetPermanentFraNorge(utenlandsperioder) ||
            !utenlandsperioder.length,
    });

    const leggTilUtenlandsperiode = (periode: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState => prevState.concat(periode));
    };

    const fjernUtenlandsperiode = (periodeSomSkalFjernes: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };

    /*--- MOTTAR BARNETRYGD FRA ANNET EØSLAND ---*/

    const barnetrygdFraEøslandHvilketLand = useLanddropdownFelt({
        søknadsfelt: barn[barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand],
        feilmeldingSpråkId: 'ombarnet.barnetrygd-eøs.land.feilmelding',
        skalFeltetVises: skalFeltetVises(barnDataKeySpørsmål.barnetrygdFraAnnetEøsland),
    });

    /*--- ANDRE FORELDER ---*/
    const andreForelder = barn.andreForelder;

    const sammeForelderSomAnnetBarn = useFelt<
        BarnetsId | AlternativtSvarForInput.ANNEN_FORELDER | null
    >({
        feltId: OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn,
        verdi: barn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar,
        valideringsfunksjon: (felt: FeltState<string | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst
                          id={'ombarnet.hvemerandreforelder.feilmelding'}
                          values={{ barn: barnetsNavnValue(barn, intl) }}
                      />
                  );
        },
        skalFeltetVises: () =>
            !!andreForelder &&
            søknad.barnInkludertISøknaden.find(barn => barn.andreForelder)?.id !== barn.id &&
            andreBarnSomErFyltUt.length > 0,
    });

    const andreForelderNavnUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(andreForelder?.[andreForelderDataKeySpørsmål.navn].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderNavnUkjent,
        avhengigheter: { sammeForelderSomAnnetBarn },
        skalFeltetVises: avhengigheter =>
            !!andreForelder &&
            (!avhengigheter.sammeForelderSomAnnetBarn.erSynlig ||
                avhengigheter.sammeForelderSomAnnetBarn.verdi ===
                    AlternativtSvarForInput.ANNEN_FORELDER),
    });
    const andreForelderNavn = useInputFeltMedUkjent({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.navn] ?? null,
        avhengighet: andreForelderNavnUkjent,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.navn.feilmelding',
        skalVises:
            !!andreForelder &&
            (!sammeForelderSomAnnetBarn.erSynlig ||
                sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER),
    });

    const andreForelderFnrUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(andreForelder?.[andreForelderDataKeySpørsmål.fnr].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderFnrUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                !!andreForelder &&
                avhengigheter &&
                (!avhengigheter.sammeForelderSomAnnetBarn.erSynlig ||
                    avhengigheter.sammeForelderSomAnnetBarn.verdi ===
                        AlternativtSvarForInput.ANNEN_FORELDER) &&
                avhengigheter.andreForelderNavnUkjent &&
                avhengigheter.andreForelderNavnUkjent.verdi === ESvar.NEI
            );
        },
        avhengigheter: { andreForelderNavnUkjent, sammeForelderSomAnnetBarn },
        nullstillVedAvhengighetEndring: false,
    });

    const andreForelderFnr = useInputFeltMedUkjent({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.fnr] ?? null,
        avhengighet: andreForelderFnrUkjent,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.fnr.feilmelding',
        erFnrInput: true,
        skalVises:
            !!andreForelder &&
            (!sammeForelderSomAnnetBarn.erSynlig ||
                sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER) &&
            andreForelderNavnUkjent.verdi === ESvar.NEI,
    });

    const andreForelderFødselsdatoUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(
            andreForelder?.[andreForelderDataKeySpørsmål.fødselsdato].svar
        ),
        feltId: OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.andreForelderFnrUkjent &&
                avhengigheter.andreForelderFnrUkjent.erSynlig &&
                avhengigheter.andreForelderFnrUkjent.verdi === ESvar.JA &&
                avhengigheter.andreForelderNavnUkjent.verdi === ESvar.NEI
            );
        },
        avhengigheter: { andreForelderFnrUkjent, andreForelderNavnUkjent },
        nullstillVedAvhengighetEndring: false,
    });
    const andreForelderFødselsdato = useDatovelgerFeltMedUkjent({
        feltId: andreForelder?.[andreForelderDataKeySpørsmål.fødselsdato].id,
        initiellVerdi: formaterInitVerdiForInputMedUkjent(
            andreForelder?.[andreForelderDataKeySpørsmål.fødselsdato].svar
        ),
        vetIkkeCheckbox: andreForelderFødselsdatoUkjent,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.fødselsdato.feilmelding',
        skalFeltetVises:
            andreForelderFnrUkjent.erSynlig &&
            andreForelderFnrUkjent.verdi === ESvar.JA &&
            andreForelderNavnUkjent.verdi === ESvar.NEI,
        nullstillVedAvhengighetEndring:
            sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER,
        sluttdatoAvgrensning: dagensDato(),
    });

    //TODO: Vurder å gjør dette når vi setter søknaden i stedet for.
    useEffect(() => {
        if (andreForelderNavnUkjent.verdi === ESvar.JA) {
            andreForelderFnr.validerOgSettFelt('');
            andreForelderFnrUkjent.validerOgSettFelt(ESvar.NEI);
            andreForelderFødselsdato.validerOgSettFelt('');
            andreForelderFødselsdatoUkjent.validerOgSettFelt(ESvar.NEI);
            andreForelderArbeidUtlandet.validerOgSettFelt(null);
            andreForelderArbeidUtlandetHvilketLand.validerOgSettFelt('');
            andreForelderPensjonUtland.validerOgSettFelt(null);
            andreForelderPensjonHvilketLand.validerOgSettFelt('');
        }
    }, [andreForelderNavnUkjent.verdi]);

    const andreForelderArbeidUtlandet = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.arbeidUtlandet],
        feilmeldingSpråkId:
            barn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andreforelder-arbeidutland.feilmelding'
                : 'ombarnet.andre-forelder.arbeid-utland.feilmelding',
        avhengigheter: {
            andreForelderNavn: {
                hovedSpørsmål: andreForelderNavn,
            },
            andreForelderFnr:
                andreForelderNavnUkjent.verdi === ESvar.NEI
                    ? {
                          hovedSpørsmål: andreForelderFnr,
                          tilhørendeFelter: [andreForelderFødselsdato],
                      }
                    : undefined,
        },
        skalSkjules: andreForelderNavnUkjent.verdi === ESvar.JA,
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(barn, intl) },
    });

    const andreForelderArbeidUtlandetHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand],
        feilmeldingSpråkId:
            barn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
                : 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: andreForelderArbeidUtlandet,
        nullstillVedAvhengighetEndring:
            sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER,
    });

    const andreForelderPensjonUtland = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pensjonUtland],
        feilmeldingSpråkId:
            barn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andre-forelder.utenlandspensjon.feilmelding'
                : 'ombarnet.andre-forelder.utenlandspensjon.feilmelding',
        avhengigheter: {
            andreForelderNavn: {
                hovedSpørsmål: andreForelderNavn,
            },
            andreForelderFnr:
                andreForelderNavnUkjent.verdi === ESvar.NEI
                    ? {
                          hovedSpørsmål: andreForelderFnr,
                          tilhørendeFelter: [andreForelderFødselsdato],
                      }
                    : undefined,
        },
        skalSkjules: andreForelderNavnUkjent.verdi === ESvar.JA,
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(barn, intl) },
    });

    const andreForelderPensjonHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pensjonHvilketLand],
        feilmeldingSpråkId:
            barn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andre-forelder.utenlandspensjon.land.feilmelding'
                : 'ombarnet.andre-forelder.utenlandspensjon.land.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: andreForelderPensjonUtland,
        nullstillVedAvhengighetEndring:
            sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER,
    });

    /*--- BOSTED ---*/
    const borFastMedSøker = useJaNeiSpmFelt({
        søknadsfelt: barn[barnDataKeySpørsmål.borFastMedSøker],
        feilmeldingSpråkId: 'ombarnet.bor-fast.feilmelding',
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(barn, intl) },
    });

    const skriftligAvtaleOmDeltBosted = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted],
        feilmeldingSpråkId: 'ombarnet.delt-bosted.feilmelding',
        skalSkjules:
            !andreForelder || barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA,
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(barn, intl) },
    });

    /*--- SØKER FOR PERIODE ---*/
    const søkerForTidsrom = useJaNeiSpmFelt({
        søknadsfelt: barn.søkerForTidsrom,
        feilmeldingSpråkId: 'ombarnet.søker-for-periode.feilmelding',
        avhengigheter: {
            borFastMedSøker: { hovedSpørsmål: borFastMedSøker },
            skriftligAvtaleOmDeltBosted: skriftligAvtaleOmDeltBosted.erSynlig
                ? {
                      hovedSpørsmål: skriftligAvtaleOmDeltBosted,
                  }
                : undefined,
        },
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(barn, intl) },
    });

    const søkerForTidsromStartdato = useDatovelgerFeltMedJaNeiAvhengighet({
        søknadsfelt: barn[barnDataKeySpørsmål.søkerForTidsromStartdato],
        avhengigSvarCondition: ESvar.JA,
        avhengighet: søkerForTidsrom,
        feilmeldingSpråkId: 'ombarnet.søker-for-periode.startdato.feilmelding',
        sluttdatoAvgrensning: dagensDato(),
    });

    const søkerForTidsromSluttdatoVetIkke = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.søkerForTidsromSluttdatoVetIkke,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.søkerForTidsrom &&
                avhengigheter.søkerForTidsrom.verdi === ESvar.JA
            );
        },
        avhengigheter: { søkerForTidsrom },
    });

    const søkerForTidsromSluttdato = useDatovelgerFeltMedUkjent({
        feltId: barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].id,
        initiellVerdi:
            barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ''
                : barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar,
        vetIkkeCheckbox: søkerForTidsromSluttdatoVetIkke,
        feilmeldingSpråkId: 'ombarnet.søker-for-periode.sluttdato.feilmelding',
        skalFeltetVises: søkerForTidsrom.verdi === ESvar.JA,
        nullstillVedAvhengighetEndring: false,
        sluttdatoAvgrensning: dagensDato(),
        startdatoAvgrensning: søkerForTidsromStartdato.verdi,
    });

    /*--- SØKER HAR BODD MED ANDRE FORELDER - UTVIDET BARNETRYGD---*/

    const søkerHarBoddMedAndreForelder = useJaNeiSpmFelt({
        søknadsfelt:
            andreForelder?.utvidet[andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder],
        feilmeldingSpråkId: 'ombarnet.boddsammenmedandreforelder.feilmelding',
        avhengigheter: {
            borFastMedSøker: {
                hovedSpørsmål: borFastMedSøker,
            },
            skriftligAvtaleOmDeltBosted: skriftligAvtaleOmDeltBosted.erSynlig
                ? {
                      hovedSpørsmål: skriftligAvtaleOmDeltBosted,
                  }
                : undefined,
        },
        skalSkjules: !erUtvidet || !andreForelder,
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(barn, intl) },
    });

    const borMedAndreForelderCheckbox = useFelt<ESvar>({
        verdi:
            andreForelder?.utvidet[andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]
                .svar === AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.søkerBorMedAndreForelder,
        skalFeltetVises: avhengigheter => {
            return (
                barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.NEI &&
                avhengigheter &&
                avhengigheter.søkerHarBoddMedAndreForelder &&
                avhengigheter.søkerHarBoddMedAndreForelder.verdi === ESvar.JA
            );
        },
        avhengigheter: { søkerHarBoddMedAndreForelder },
    });

    const søkerFlyttetFraAndreForelderDato = useDatovelgerFeltMedUkjent({
        feltId: andreForelder?.utvidet[
            andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato
        ].id,
        initiellVerdi:
            andreForelder?.utvidet[andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]
                .svar === AlternativtSvarForInput.UKJENT
                ? ''
                : andreForelder?.utvidet[
                      andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato
                  ].svar,
        vetIkkeCheckbox: borMedAndreForelderCheckbox,
        feilmeldingSpråkId: 'ombarnet.nårflyttetfra.feilmelding',
        skalFeltetVises:
            søkerHarBoddMedAndreForelder.verdi === ESvar.JA &&
            barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.NEI,
        nullstillVedAvhengighetEndring: true,
        sluttdatoAvgrensning: dagensDato(),
    });

    const { kanSendeSkjema, skjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmBarnetUtvidetFeltTyper,
        string
    >({
        felter: {
            institusjonIUtlandCheckbox,
            institusjonsnavn,
            institusjonsadresse,
            institusjonspostnummer,
            institusjonOppholdStartdato,
            institusjonOppholdSluttdato,
            institusjonOppholdSluttVetIkke,
            registrerteUtenlandsperioder,
            planleggerÅBoINorge12Mnd,
            barnetrygdFraEøslandHvilketLand,
            andreForelderNavn,
            andreForelderNavnUkjent,
            andreForelderFnr,
            andreForelderFnrUkjent,
            andreForelderFødselsdato,
            andreForelderFødselsdatoUkjent,
            andreForelderArbeidUtlandet,
            andreForelderArbeidUtlandetHvilketLand,
            andreForelderPensjonUtland,
            andreForelderPensjonHvilketLand,
            borFastMedSøker,
            skriftligAvtaleOmDeltBosted,
            søkerForTidsrom,
            søkerForTidsromStartdato,
            søkerForTidsromSluttdato,
            søkerForTidsromSluttdatoVetIkke,
            sammeForelderSomAnnetBarn,
            søkerHarBoddMedAndreForelder,
            borMedAndreForelderCheckbox,
            søkerFlyttetFraAndreForelderDato,
        },
        skjemanavn: `om-barnet-${barn.id}`,
    });

    const genererOppdatertDokumentasjon = (
        dokumentasjon: IDokumentasjon,
        kreverDokumentasjon,
        barnId: string
    ) => {
        let oppdatertDokumentasjon = dokumentasjon;
        if (kreverDokumentasjon) {
            if (!dokumentasjon.gjelderForBarnId.includes(barnId)) {
                oppdatertDokumentasjon = {
                    ...dokumentasjon,
                    gjelderForBarnId: [...oppdatertDokumentasjon.gjelderForBarnId].concat(barnId),
                };
            }
        } else {
            oppdatertDokumentasjon = {
                ...dokumentasjon,
                gjelderForBarnId: [...oppdatertDokumentasjon.gjelderForBarnId].filter(
                    id => id !== barnId
                ),
            };
        }

        return oppdatertDokumentasjon;
    };

    const genererOppdatertBarn = (barn: IBarnMedISøknad) => {
        const barnMedSammeForelder: IBarnMedISøknad | undefined = andreBarnSomErFyltUt.find(
            barn => barn.id === sammeForelderSomAnnetBarn.verdi
        );
        return {
            ...barn,
            barnErFyltUt: true,
            utenlandsperioder: skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge)
                ? utenlandsperioder
                : [],
            institusjonIUtland: {
                ...barn.institusjonIUtland,
                svar: institusjonIUtlandCheckbox.verdi,
            },
            institusjonsnavn: {
                ...barn.institusjonsnavn,
                svar: institusjonsnavn.erSynlig ? trimWhiteSpace(institusjonsnavn.verdi) : '',
            },
            institusjonsadresse: {
                ...barn.institusjonsadresse,
                svar: institusjonsadresse.erSynlig ? trimWhiteSpace(institusjonsadresse.verdi) : '',
            },
            institusjonspostnummer: {
                ...barn.institusjonspostnummer,
                svar: institusjonspostnummer.erSynlig
                    ? trimWhiteSpace(institusjonspostnummer.verdi)
                    : '',
            },
            institusjonOppholdStartdato: {
                ...barn.institusjonOppholdStartdato,
                svar: institusjonOppholdStartdato.verdi,
            },
            institusjonOppholdSluttdato: {
                ...barn.institusjonOppholdSluttdato,
                svar: svarForSpørsmålMedUkjent(
                    institusjonOppholdSluttVetIkke,
                    institusjonOppholdSluttdato
                ),
            },
            planleggerÅBoINorge12Mnd: {
                ...barn.planleggerÅBoINorge12Mnd,
                svar: !flyttetPermanentFraNorge(utenlandsperioder)
                    ? skjema.felter.planleggerÅBoINorge12Mnd.verdi
                    : null,
            },
            barnetrygdFraEøslandHvilketLand: {
                ...barn.barnetrygdFraEøslandHvilketLand,
                svar: barnetrygdFraEøslandHvilketLand.verdi,
            },
            borFastMedSøker: {
                ...barn.borFastMedSøker,
                svar: borFastMedSøker.verdi,
            },
            søkerForTidsrom: {
                ...barn.søkerForTidsrom,
                svar: søkerForTidsrom.verdi,
            },
            søkerForTidsromStartdato: {
                ...barn.søkerForTidsromStartdato,
                svar: søkerForTidsromStartdato.verdi,
            },
            søkerForTidsromSluttdato: {
                ...barn.søkerForTidsromSluttdato,
                svar: svarForSpørsmålMedUkjent(
                    søkerForTidsromSluttdatoVetIkke,
                    søkerForTidsromSluttdato
                ),
            },
            sammeForelderSomAnnetBarnMedId: {
                ...barn.sammeForelderSomAnnetBarnMedId,
                svar: sammeForelderSomAnnetBarn.verdi,
            },
            ...(!!barn.andreForelder && {
                andreForelder: barnMedSammeForelder?.andreForelder
                    ? {
                          ...barnMedSammeForelder.andreForelder,
                          skriftligAvtaleOmDeltBosted: {
                              ...barn.andreForelder.skriftligAvtaleOmDeltBosted,
                              svar: skriftligAvtaleOmDeltBosted.verdi,
                          },
                      }
                    : {
                          ...barn.andreForelder,
                          navn: {
                              ...barn.andreForelder[andreForelderDataKeySpørsmål.navn],
                              svar: trimWhiteSpace(
                                  svarForSpørsmålMedUkjent(
                                      andreForelderNavnUkjent,
                                      andreForelderNavn
                                  )
                              ),
                          },
                          fnr: {
                              ...barn.andreForelder[andreForelderDataKeySpørsmål.fnr],
                              svar: svarForSpørsmålMedUkjent(
                                  andreForelderFnrUkjent,
                                  andreForelderFnr
                              ),
                          },
                          fødselsdato: {
                              ...barn.andreForelder[andreForelderDataKeySpørsmål.fødselsdato],
                              svar: svarForSpørsmålMedUkjent(
                                  andreForelderFødselsdatoUkjent,
                                  andreForelderFødselsdato
                              ),
                          },
                          arbeidUtlandet: {
                              ...barn.andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet],
                              svar: andreForelderArbeidUtlandet.verdi,
                          },
                          arbeidUtlandetHvilketLand: {
                              ...barn.andreForelder[
                                  andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand
                              ],
                              svar: andreForelderArbeidUtlandetHvilketLand.verdi,
                          },
                          pensjonUtland: {
                              ...barn.andreForelder[andreForelderDataKeySpørsmål.pensjonUtland],
                              svar: andreForelderPensjonUtland.verdi,
                          },
                          pensjonHvilketLand: {
                              ...barn.andreForelder[
                                  andreForelderDataKeySpørsmål.pensjonHvilketLand
                              ],
                              svar: andreForelderPensjonHvilketLand.verdi,
                          },
                          skriftligAvtaleOmDeltBosted: {
                              ...barn.andreForelder.skriftligAvtaleOmDeltBosted,
                              svar: skriftligAvtaleOmDeltBosted.verdi,
                          },
                          utvidet: {
                              søkerHarBoddMedAndreForelder: {
                                  ...barn.andreForelder.utvidet.søkerHarBoddMedAndreForelder,
                                  svar: søkerHarBoddMedAndreForelder.verdi,
                              },
                              søkerFlyttetFraAndreForelderDato: {
                                  ...barn.andreForelder.utvidet.søkerFlyttetFraAndreForelderDato,
                                  svar: svarForSpørsmålMedUkjent(
                                      borMedAndreForelderCheckbox,
                                      søkerFlyttetFraAndreForelderDato
                                  ),
                              },
                          },
                      },
            }),
        };
    };

    useEffect(() => {
        const oppdatertBarn: IBarnMedISøknad = genererOppdatertBarn(barn);
        const skalTriggeEøs = skalTriggeEøsForBarn(oppdatertBarn);
        if (
            (skalTriggeEøs && !barnSomTriggerEøs.includes(barn.id)) ||
            (!skalTriggeEøs && barnSomTriggerEøs.includes(barn.id))
        ) {
            settBarnSomTriggerEøs(prevState => {
                if (skalTriggeEøs) {
                    return prevState.concat(barn.id);
                } else {
                    return prevState.filter(barnSomTriggetEøsId => barnSomTriggetEøsId !== barn.id);
                }
            });
        }
    }, [
        andreForelderArbeidUtlandet,
        andreForelderArbeidUtlandetHvilketLand,
        andreForelderPensjonUtland,
        andreForelderPensjonHvilketLand,
        utenlandsperioder,
    ]);

    const oppdaterSøknad = () => {
        const oppdatertBarnInkludertISøknaden: IBarnMedISøknad[] =
            søknad.barnInkludertISøknaden.map(barn => {
                const oppdatertBarn = barn.id === barnetsUuid ? genererOppdatertBarn(barn) : barn;
                return { ...oppdatertBarn, triggetEøs: skalTriggeEøsForBarn(oppdatertBarn) };
            });

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                switch (dok.dokumentasjonsbehov) {
                    case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
                        return genererOppdatertDokumentasjon(
                            dok,
                            skriftligAvtaleOmDeltBosted.verdi === ESvar.JA && !!andreForelder,
                            barn.id
                        );
                    case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
                        return genererOppdatertDokumentasjon(
                            dok,
                            borFastMedSøker.verdi === ESvar.JA && !barn.borMedSøker,
                            barn.id
                        );
                    case Dokumentasjonsbehov.MEKLINGSATTEST:
                        return genererOppdatertDokumentasjon(
                            dok,
                            barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.NEI &&
                                søkerHarBoddMedAndreForelder.verdi === ESvar.JA &&
                                borMedAndreForelderCheckbox.verdi === ESvar.NEI,
                            barn.id
                        );
                    case Dokumentasjonsbehov.SEPARERT_SKILT_ENKE:
                        return genererOppdatertDokumentasjon(
                            dok,
                            søkerForTidsrom.verdi === ESvar.JA &&
                                (søknad.søker.sivilstand.type === ESivilstand.SKILT ||
                                    søknad.søker.utvidet.spørsmål.årsak.svar === Årsak.SKILT) &&
                                søknad.søknadstype === ESøknadstype.UTVIDET,
                            barn.id
                        );
                    default:
                        return dok;
                }
            }),
        });
    };

    return {
        oppdaterSøknad,
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        barn,
        andreBarnSomErFyltUt,
        validerAlleSynligeFelter,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
    };
};

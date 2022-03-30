import React, { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedJaNeiAvhengighet from '../../../hooks/useDatovelgerFeltMedJaNeiAvhengighet';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import useLanddropdownFeltMedJaNeiAvhengighet from '../../../hooks/useLanddropdownFeltMedJaNeiAvhengighet';
import { usePerioder } from '../../../hooks/usePerioder';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../../typer/barn';
import { AlternativtSvarForInput, BarnetsId } from '../../../typer/common';
import { IDokumentasjon } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESivilstand, ESøknadstype } from '../../../typer/kontrakt/generelle';
import {
    IArbeidsperiode,
    IEøsBarnetrygdsperiode,
    IPensjonsperiode,
    IUtenlandsperiode,
} from '../../../typer/perioder';
import { IIdNummer } from '../../../typer/person';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { Årsak } from '../../../typer/utvidet';
import { erNorskPostnummer, valideringAdresse } from '../../../utils/adresse';
import {
    barnetsNavnValue,
    filtrerteRelevanteIdNummerForBarn,
    genererInitiellAndreForelder,
    nullstilteEøsFelterForBarn,
} from '../../../utils/barn';
import { dagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent, formaterVerdiForCheckbox } from '../../../utils/input';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { nullstilteEøsFelterForSøker } from '../../../utils/søker';
import { flyttetPermanentFraNorge } from '../../../utils/utenlandsopphold';
import { arbeidsperiodeFeilmelding } from '../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { pensjonsperiodeFeilmelding } from '../../Felleskomponenter/Pensjonsmodal/språkUtils';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { idNummerLand } from '../EøsSteg/idnummerUtils';
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
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    leggTilBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    fjernBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
} => {
    const { søknad, settSøknad, erUtvidet } = useApp();
    const intl = useIntl();
    const { skalTriggeEøsForBarn, barnSomTriggerEøs, settBarnSomTriggerEøs, erEøsLand } = useEøs();

    const { toggles } = useFeatureToggles();
    const gjeldendeBarn = søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid);

    if (!gjeldendeBarn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const [utenlandsperioder, settUtenlandsperioder] = useState<IUtenlandsperiode[]>(
        gjeldendeBarn.utenlandsperioder
    );

    const skalFeltetVises = (
        søknadsdataFelt: Exclude<
            barnDataKeySpørsmål,
            barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId
        >
    ) => {
        return gjeldendeBarn[søknadsdataFelt].svar === ESvar.JA;
    };

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt &&
            barnISøknad.id !== gjeldendeBarn.id &&
            !!barnISøknad.andreForelder &&
            (barnISøknad.sammeForelderSomAnnetBarnMedId.svar ===
                AlternativtSvarForInput.ANNEN_FORELDER ||
                barnISøknad.sammeForelderSomAnnetBarnMedId.svar === null)
    );

    /*---INSTITUSJON---*/

    const institusjonIUtlandCheckbox = useFelt<ESvar>({
        verdi: gjeldendeBarn[barnDataKeySpørsmål.institusjonIUtland].svar,
        feltId: OmBarnetSpørsmålsId.institusjonIUtland,
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonsnavn = useInputFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.institusjonsnavn],
        feilmeldingSpråkId: 'ombarnet.institusjon.navn.feilmelding',
        skalVises:
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            institusjonIUtlandCheckbox.verdi === ESvar.NEI,
    });

    const institusjonsadresse = useInputFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.institusjonsadresse],
        feilmeldingSpråkId: 'ombarnet.institusjon.adresse.feilmelding',
        skalVises:
            skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon) &&
            institusjonIUtlandCheckbox.verdi === ESvar.NEI,
        customValidering: valideringAdresse,
    });

    const institusjonspostnummer = useFelt<string>({
        verdi: gjeldendeBarn[barnDataKeySpørsmål.institusjonspostnummer].svar,
        feltId: gjeldendeBarn[barnDataKeySpørsmål.institusjonspostnummer].id,
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
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdStartdato],
        skalFeltetVises: skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
        feilmeldingSpråkId: 'ombarnet.institusjon.startdato.feilmelding',
        sluttdatoAvgrensning: dagensDato(),
    });

    const institusjonOppholdSluttVetIkke = useFelt<ESvar>({
        verdi:
            gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.institusjonOppholdVetIkke,
    });

    const institusjonOppholdSluttdato = useDatovelgerFeltMedUkjent({
        feltId: gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].id,
        initiellVerdi:
            gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar !==
            AlternativtSvarForInput.UKJENT
                ? gjeldendeBarn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar
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
        verdi: gjeldendeBarn.utenlandsperioder,
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
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
        feilmeldingSpråkId: 'ombarnet.oppholdtsammenhengende.feilmelding',
        feilmeldingSpråkVerdier: { barn: barnetsNavnValue(gjeldendeBarn, intl) },
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

    /*--- PÅGÅENDE SØKNAD BARNETRYGD FRA ANNET EØSLAND ---*/
    const pågåendeSøknadFraAnnetEøsLand = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand],
        feilmeldingSpråkId: 'ombarnet.pågåendesøknad.feilmelding',
        skalSkjules:
            !toggles.EØS_KOMPLETT ||
            !skalFeltetVises(barnDataKeySpørsmål.barnetrygdFraAnnetEøsland),
    });

    const pågåendeSøknadHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand],
        feilmeldingSpråkId: 'ombarnet.hvilketlandsøkt.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: pågåendeSøknadFraAnnetEøsLand,
        skalFeltetVises: toggles.EØS_KOMPLETT,
    });

    /*--- MOTTAR BARNETRYGD FRA ANNET EØSLAND ---*/

    const barnetrygdFraEøslandHvilketLand = useLanddropdownFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand],
        feilmeldingSpråkId: 'ombarnet.barnetrygd-eøs.land.feilmelding',
        skalFeltetVises:
            skalFeltetVises(barnDataKeySpørsmål.barnetrygdFraAnnetEøsland) && !toggles.EØS_KOMPLETT,
    });

    /*--- EØS SPØRSMÅL MOTTAR BARNETRYGD ---*/

    const mottarEllerMottokEøsBarnetrygd = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd],
        feilmeldingSpråkId: 'ombarnet.fårellerharsøktbarnetrygdeøs.feilmelding',
        skalSkjules:
            !toggles.EØS_KOMPLETT ||
            !skalFeltetVises(barnDataKeySpørsmål.barnetrygdFraAnnetEøsland),
    });

    const {
        fjernPeriode: fjernBarnetrygdsperiode,
        leggTilPeriode: leggTilBarnetrygdsperiode,
        registrertePerioder: registrerteEøsBarnetrygdsperioder,
    } = usePerioder<IEøsBarnetrygdsperiode>(
        gjeldendeBarn.eøsBarnetrygdsperioder,
        { mottarEllerMottokEøsBarnetrygd },
        avhengigheter =>
            avhengigheter.mottarEllerMottokEøsBarnetrygd.verdi === ESvar.JA && toggles.EØS_KOMPLETT,

        (felt, avhengigheter) => {
            return avhengigheter?.mottarEllerMottokEøsBarnetrygd.verdi === ESvar.NEI ||
                (avhengigheter?.mottarEllerMottokEøsBarnetrygd.verdi === ESvar.JA &&
                    felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'ombarnet.trygdandreperioder.feilmelding'} />);
        }
    );

    /*--- ANDRE FORELDER ---*/
    const andreForelder = gjeldendeBarn.andreForelder;

    const sammeForelderSomAnnetBarn = useFelt<
        BarnetsId | AlternativtSvarForInput.ANNEN_FORELDER | null
    >({
        feltId: OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn,
        verdi: gjeldendeBarn[barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId].svar,
        valideringsfunksjon: (felt: FeltState<string | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst
                          id={'ombarnet.hvemerandreforelder.feilmelding'}
                          values={{ barn: barnetsNavnValue(gjeldendeBarn, intl) }}
                      />
                  );
        },
        skalFeltetVises: () =>
            !!andreForelder &&
            søknad.barnInkludertISøknaden.find(barn => barn.andreForelder)?.id !==
                gjeldendeBarn.id &&
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

    const andreForelderArbeidUtlandet = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.arbeidUtlandet],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
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
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(gjeldendeBarn, intl) },
    });

    const andreForelderArbeidUtlandetHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
                : 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: andreForelderArbeidUtlandet,
        nullstillVedAvhengighetEndring:
            sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER,
        skalFeltetVises: !toggles.EØS_KOMPLETT,
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: andreForelderArbeidsperioderUtland,
    } = usePerioder<IArbeidsperiode>(
        andreForelder?.arbeidsperioderUtland ?? [],
        { andreForelderArbeidUtlandet },
        avhengigheter =>
            avhengigheter.andreForelderArbeidUtlandet.verdi === ESvar.JA && toggles.EØS_KOMPLETT,
        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderArbeidUtlandet.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderArbeidUtlandet.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(true)} />);
        }
    );

    const andreForelderPensjonUtland = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pensjonUtland],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
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
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(gjeldendeBarn, intl) },
    });

    const andreForelderPensjonHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.pensjonHvilketLand],
        feilmeldingSpråkId:
            gjeldendeBarn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andre-forelder.utenlandspensjon.land.feilmelding'
                : 'ombarnet.andre-forelder.utenlandspensjon.land.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: andreForelderPensjonUtland,
        nullstillVedAvhengighetEndring:
            sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === AlternativtSvarForInput.ANNEN_FORELDER,
        skalFeltetVises: !toggles.EØS_KOMPLETT,
    });

    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: andreForelderPensjonsperioderUtland,
    } = usePerioder<IPensjonsperiode>(
        andreForelder?.pensjonsperioderUtland ?? [],
        { andreForelderPensjonUtland },
        avhengigheter =>
            avhengigheter.andreForelderPensjonUtland.verdi === ESvar.JA && toggles.EØS_KOMPLETT,

        (felt, avhengigheter) => {
            return avhengigheter?.andreForelderPensjonUtland.verdi === ESvar.NEI ||
                (avhengigheter?.andreForelderPensjonUtland.verdi === ESvar.JA && felt.verdi.length)
                ? ok(felt)
                : feil(felt, <SpråkTekst id={pensjonsperiodeFeilmelding(true)} />);
        }
    );

    /*--- BOSTED ---*/
    const borFastMedSøker = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.borFastMedSøker],
        feilmeldingSpråkId: 'ombarnet.bor-fast.feilmelding',
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(gjeldendeBarn, intl) },
    });

    const skriftligAvtaleOmDeltBosted = useJaNeiSpmFelt({
        søknadsfelt: andreForelder?.[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted],
        feilmeldingSpråkId: 'ombarnet.delt-bosted.feilmelding',
        skalSkjules:
            !andreForelder ||
            gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA,
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(gjeldendeBarn, intl) },
    });

    /*--- SØKER FOR PERIODE ---*/
    const søkerForTidsrom = useJaNeiSpmFelt({
        søknadsfelt: gjeldendeBarn.søkerForTidsrom,
        feilmeldingSpråkId: 'ombarnet.søker-for-periode.feilmelding',
        avhengigheter: {
            borFastMedSøker: { hovedSpørsmål: borFastMedSøker },
            skriftligAvtaleOmDeltBosted: skriftligAvtaleOmDeltBosted.erSynlig
                ? {
                      hovedSpørsmål: skriftligAvtaleOmDeltBosted,
                  }
                : undefined,
        },
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(gjeldendeBarn, intl) },
    });

    const søkerForTidsromStartdato = useDatovelgerFeltMedJaNeiAvhengighet({
        søknadsfelt: gjeldendeBarn[barnDataKeySpørsmål.søkerForTidsromStartdato],
        avhengigSvarCondition: ESvar.JA,
        avhengighet: søkerForTidsrom,
        feilmeldingSpråkId: 'ombarnet.søker-for-periode.startdato.feilmelding',
        sluttdatoAvgrensning: dagensDato(),
    });

    const søkerForTidsromSluttdatoVetIkke = useFelt<ESvar>({
        verdi:
            gjeldendeBarn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar ===
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
        feltId: gjeldendeBarn[barnDataKeySpørsmål.søkerForTidsromSluttdato].id,
        initiellVerdi:
            gjeldendeBarn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ''
                : gjeldendeBarn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar,
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
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(gjeldendeBarn, intl) },
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
                gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.NEI &&
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
            gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.NEI,
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
            pågåendeSøknadFraAnnetEøsLand,
            pågåendeSøknadHvilketLand,
            barnetrygdFraEøslandHvilketLand,
            mottarEllerMottokEøsBarnetrygd,
            registrerteEøsBarnetrygdsperioder,
            andreForelderNavn,
            andreForelderNavnUkjent,
            andreForelderFnr,
            andreForelderFnrUkjent,
            andreForelderFødselsdato,
            andreForelderFødselsdatoUkjent,
            andreForelderArbeidUtlandet,
            andreForelderArbeidUtlandetHvilketLand,
            andreForelderArbeidsperioderUtland,
            andreForelderPensjonUtland,
            andreForelderPensjonHvilketLand,
            andreForelderPensjonsperioderUtland,
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
        skjemanavn: `om-barnet-${gjeldendeBarn.id}`,
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

    const filtrerteRelevanteIdNummerForAndreForelder = (
        andreForelder: IAndreForelder
    ): IIdNummer[] => {
        return andreForelder.idNummer.filter(idNummer => {
            return idNummerLand(
                {
                    arbeidsperioderUtland:
                        andreForelderArbeidUtlandet.verdi === ESvar.JA
                            ? andreForelderArbeidsperioderUtland.verdi
                            : [],
                    pensjonsperioderUtland:
                        andreForelderPensjonUtland.verdi === ESvar.JA
                            ? andreForelderPensjonsperioderUtland.verdi
                            : [],
                },
                erEøsLand
            ).includes(idNummer.land);
        });
    };

    const annetBarnMedSammeForelder = (): IBarnMedISøknad | undefined =>
        andreBarnSomErFyltUt.find(barn => barn.id === sammeForelderSomAnnetBarn.verdi);

    const kanIkkeGiOpplysningerOmAndreForelder = (): boolean =>
        (annetBarnMedSammeForelder()?.andreForelder?.navn ??
            trimWhiteSpace(
                svarForSpørsmålMedUkjent(andreForelderNavnUkjent, andreForelderNavn)
            )) === AlternativtSvarForInput.UKJENT;

    const genererOppdatertAndreForelder = (andreForelder: IAndreForelder): IAndreForelder => {
        const barnMedSammeForelder = annetBarnMedSammeForelder();
        const andreForelderErDød = gjeldendeBarn.andreForelderErDød.svar === ESvar.JA;

        if (barnMedSammeForelder?.andreForelder) {
            return {
                ...barnMedSammeForelder.andreForelder,
                skriftligAvtaleOmDeltBosted: {
                    ...andreForelder.skriftligAvtaleOmDeltBosted,
                    svar: skriftligAvtaleOmDeltBosted.verdi,
                },
            };
        } else if (kanIkkeGiOpplysningerOmAndreForelder()) {
            return {
                ...genererInitiellAndreForelder(null, andreForelderErDød),
                kanIkkeGiOpplysninger: true,
                navn: {
                    ...andreForelder[andreForelderDataKeySpørsmål.navn],
                    svar: trimWhiteSpace(
                        svarForSpørsmålMedUkjent(andreForelderNavnUkjent, andreForelderNavn)
                    ),
                },
                skriftligAvtaleOmDeltBosted: {
                    ...andreForelder.skriftligAvtaleOmDeltBosted,
                    svar: skriftligAvtaleOmDeltBosted.verdi,
                },
                utvidet: {
                    søkerHarBoddMedAndreForelder: {
                        ...andreForelder.utvidet.søkerHarBoddMedAndreForelder,
                        svar: søkerHarBoddMedAndreForelder.verdi,
                    },
                    søkerFlyttetFraAndreForelderDato: {
                        ...andreForelder.utvidet.søkerFlyttetFraAndreForelderDato,
                        svar: svarForSpørsmålMedUkjent(
                            borMedAndreForelderCheckbox,
                            søkerFlyttetFraAndreForelderDato
                        ),
                    },
                },
            };
        } else {
            return {
                ...andreForelder,
                kanIkkeGiOpplysninger: false,
                idNummer: filtrerteRelevanteIdNummerForAndreForelder(andreForelder),
                navn: {
                    ...andreForelder[andreForelderDataKeySpørsmål.navn],
                    svar: trimWhiteSpace(
                        svarForSpørsmålMedUkjent(andreForelderNavnUkjent, andreForelderNavn)
                    ),
                },
                fnr: {
                    ...andreForelder[andreForelderDataKeySpørsmål.fnr],
                    svar: svarForSpørsmålMedUkjent(andreForelderFnrUkjent, andreForelderFnr),
                },
                fødselsdato: {
                    ...andreForelder[andreForelderDataKeySpørsmål.fødselsdato],
                    svar: svarForSpørsmålMedUkjent(
                        andreForelderFødselsdatoUkjent,
                        andreForelderFødselsdato
                    ),
                },
                arbeidUtlandet: {
                    ...andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet],
                    svar: andreForelderArbeidUtlandet.verdi,
                },
                arbeidUtlandetHvilketLand: {
                    ...andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand],
                    svar: andreForelderArbeidUtlandetHvilketLand.verdi,
                },
                arbeidsperioderUtland:
                    andreForelderArbeidUtlandet.verdi === ESvar.JA
                        ? andreForelderArbeidsperioderUtland.verdi
                        : [],
                pensjonUtland: {
                    ...andreForelder[andreForelderDataKeySpørsmål.pensjonUtland],
                    svar: andreForelderPensjonUtland.verdi,
                },
                pensjonHvilketLand: {
                    ...andreForelder[andreForelderDataKeySpørsmål.pensjonHvilketLand],
                    svar: andreForelderPensjonHvilketLand.verdi,
                },
                pensjonsperioderUtland:
                    andreForelderPensjonUtland.verdi === ESvar.JA
                        ? andreForelderPensjonsperioderUtland.verdi
                        : [],
                skriftligAvtaleOmDeltBosted: {
                    ...andreForelder.skriftligAvtaleOmDeltBosted,
                    svar: skriftligAvtaleOmDeltBosted.verdi,
                },
                utvidet: {
                    søkerHarBoddMedAndreForelder: {
                        ...andreForelder.utvidet.søkerHarBoddMedAndreForelder,
                        svar: søkerHarBoddMedAndreForelder.verdi,
                    },
                    søkerFlyttetFraAndreForelderDato: {
                        ...andreForelder.utvidet.søkerFlyttetFraAndreForelderDato,
                        svar: svarForSpørsmålMedUkjent(
                            borMedAndreForelderCheckbox,
                            søkerFlyttetFraAndreForelderDato
                        ),
                    },
                },
            };
        }
    };

    const genererOppdatertBarn = (barn: IBarnMedISøknad): IBarnMedISøknad => {
        const eøsBarnetrygdsperioder =
            mottarEllerMottokEøsBarnetrygd.verdi === ESvar.JA
                ? registrerteEøsBarnetrygdsperioder.verdi
                : [];
        const utenlandsperioder = registrerteUtenlandsperioder.verdi;

        const borMedAndreForelder =
            borFastMedSøker.verdi === ESvar.JA ? null : barn.borMedAndreForelder.svar;

        return {
            ...barn,
            idNummer: filtrerteRelevanteIdNummerForBarn(
                { eøsBarnetrygdsperioder, utenlandsperioder },
                pågåendeSøknadFraAnnetEøsLand.verdi,
                pågåendeSøknadHvilketLand.verdi,
                barn,
                erEøsLand
            ),
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
            pågåendeSøknadFraAnnetEøsLand: {
                ...barn.pågåendeSøknadFraAnnetEøsLand,
                svar: pågåendeSøknadFraAnnetEøsLand.verdi,
            },
            pågåendeSøknadHvilketLand: {
                ...barn.pågåendeSøknadHvilketLand,
                svar: pågåendeSøknadHvilketLand.verdi,
            },
            barnetrygdFraEøslandHvilketLand: {
                ...barn.barnetrygdFraEøslandHvilketLand,
                svar: barnetrygdFraEøslandHvilketLand.verdi,
            },
            mottarEllerMottokEøsBarnetrygd: {
                ...barn.mottarEllerMottokEøsBarnetrygd,
                svar: mottarEllerMottokEøsBarnetrygd.verdi,
            },
            eøsBarnetrygdsperioder:
                mottarEllerMottokEøsBarnetrygd.verdi === ESvar.JA
                    ? skjema.felter.registrerteEøsBarnetrygdsperioder.verdi
                    : [],
            borFastMedSøker: {
                ...barn.borFastMedSøker,
                svar: borFastMedSøker.verdi,
            },
            borMedAndreForelder: {
                ...barn.borMedAndreForelder,
                svar: borMedAndreForelder,
            },
            omsorgsperson: borFastMedSøker.verdi === ESvar.JA ? null : barn.omsorgsperson,
            adresse: {
                ...barn.adresse,
                svar:
                    barn.erFosterbarn.svar === ESvar.JA ||
                    (borMedAndreForelder && kanIkkeGiOpplysningerOmAndreForelder())
                        ? barn.adresse.svar
                        : '',
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
                andreForelder: genererOppdatertAndreForelder(barn.andreForelder),
            }),
        };
    };

    useEffect(() => {
        const oppdatertBarn: IBarnMedISøknad = genererOppdatertBarn(gjeldendeBarn);
        const skalTriggeEøs = skalTriggeEøsForBarn(oppdatertBarn);
        if (
            (skalTriggeEøs && !barnSomTriggerEøs.includes(gjeldendeBarn.id)) ||
            (!skalTriggeEøs && barnSomTriggerEøs.includes(gjeldendeBarn.id))
        ) {
            settBarnSomTriggerEøs(prevState => {
                if (skalTriggeEøs) {
                    return prevState.concat(gjeldendeBarn.id);
                } else {
                    return prevState.filter(
                        barnSomTriggetEøsId => barnSomTriggetEøsId !== gjeldendeBarn.id
                    );
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
                let oppdatertBarn;
                if (barn === gjeldendeBarn) {
                    oppdatertBarn = genererOppdatertBarn(barn);
                } else if (barn.sammeForelderSomAnnetBarnMedId.svar === gjeldendeBarn.id) {
                    oppdatertBarn = {
                        ...barn,
                        ...(!!gjeldendeBarn.andreForelder && {
                            andreForelder: genererOppdatertAndreForelder(
                                gjeldendeBarn.andreForelder
                            ),
                        }),
                    };
                } else {
                    oppdatertBarn = barn;
                }
                const triggetEøs = skalTriggeEøsForBarn(oppdatertBarn);
                const harEøsSteg = triggetEøs || søknad.søker.triggetEøs;

                return {
                    ...oppdatertBarn,
                    triggetEøs,
                    ...(!harEøsSteg && nullstilteEøsFelterForBarn(oppdatertBarn)),
                };
            });

        const skalNullstilleEøsForSøker =
            !søknad.søker.triggetEøs ||
            !oppdatertBarnInkludertISøknaden.find(barn => barn.triggetEøs);

        settSøknad({
            ...søknad,
            søker: skalNullstilleEøsForSøker
                ? { ...søknad.søker, ...nullstilteEøsFelterForSøker(søknad.søker) }
                : søknad.søker,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                switch (dok.dokumentasjonsbehov) {
                    case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
                        return genererOppdatertDokumentasjon(
                            dok,
                            skriftligAvtaleOmDeltBosted.verdi === ESvar.JA && !!andreForelder,
                            gjeldendeBarn.id
                        );
                    case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
                        return genererOppdatertDokumentasjon(
                            dok,
                            borFastMedSøker.verdi === ESvar.JA && !gjeldendeBarn.borMedSøker,
                            gjeldendeBarn.id
                        );
                    case Dokumentasjonsbehov.MEKLINGSATTEST:
                        return genererOppdatertDokumentasjon(
                            dok,
                            gjeldendeBarn[barnDataKeySpørsmål.andreForelderErDød].svar ===
                                ESvar.NEI &&
                                søkerHarBoddMedAndreForelder.verdi === ESvar.JA &&
                                borMedAndreForelderCheckbox.verdi === ESvar.NEI,
                            gjeldendeBarn.id
                        );
                    case Dokumentasjonsbehov.SEPARERT_SKILT_ENKE:
                        return genererOppdatertDokumentasjon(
                            dok,
                            søkerForTidsrom.verdi === ESvar.JA &&
                                (søknad.søker.sivilstand.type === ESivilstand.SKILT ||
                                    søknad.søker.utvidet.spørsmål.årsak.svar === Årsak.SKILT) &&
                                søknad.søknadstype === ESøknadstype.UTVIDET,
                            gjeldendeBarn.id
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
        barn: gjeldendeBarn,
        andreBarnSomErFyltUt,
        validerAlleSynligeFelter,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilBarnetrygdsperiode,
        fjernBarnetrygdsperiode,
    };
};

import React, { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedJaNeiAvhengighet from '../../../hooks/useDatovelgerFeltMedJaNeiAvhengighet';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useFørsteRender from '../../../hooks/useFørsteRender';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import useLanddropdownFeltMedJaNeiAvhengighet from '../../../hooks/useLanddropdownFeltMedJaNeiAvhengighet';
import { AlternativtSvarForInput, BarnetsId } from '../../../typer/common';
import { Dokumentasjonsbehov, IDokumentasjon } from '../../../typer/dokumentasjon';
import {
    barnDataKeySpørsmål,
    barnDataKeySpørsmålUtvidet,
    ESivilstand,
    IUtenlandsperiode,
} from '../../../typer/person';
import { IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import { ESøknadstype, IBarnMedISøknad } from '../../../typer/søknad';
import { regexNorskEllerUtenlandskPostnummer } from '../../../utils/adresse';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato } from '../../../utils/dato';
import { trimWhiteSpace } from '../../../utils/hjelpefunksjoner';
import { formaterInitVerdiForInputMedUkjent, formaterVerdiForCheckbox } from '../../../utils/input';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { flyttetPermanentFraNorge } from '../../../utils/utenlandsopphold';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { ANNEN_FORELDER } from './SammeSomAnnetBarnRadio';
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
    settSammeForelder: (radioVerdi: string) => void;
    validerAlleSynligeFelter: () => void;
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    fjernUtenlandsperiode: (periode: IUtenlandsperiode) => void;
    utenlandsperioder: IUtenlandsperiode[];
} => {
    const { søknad, settSøknad, erUtvidet } = useApp();
    const intl = useIntl();

    const [barn] = useState<IBarnMedISøknad | undefined>(
        søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid)
    );

    if (!barn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const [utenlandsperioder, settUtenlandsperioder] = useState<IUtenlandsperiode[]>(
        barn.utenlandsperioder
    );

    const skalFeltetVises = (søknadsdataFelt: barnDataKeySpørsmål) => {
        return barn[søknadsdataFelt].svar === ESvar.JA;
    };

    const andreBarnSomErFyltUt = søknad.barnInkludertISøknaden.filter(
        barnISøknad =>
            barnISøknad.barnErFyltUt &&
            barnISøknad.id !== barn.id &&
            barnISøknad[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI
    );

    useFørsteRender(() => {
        if (barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA) {
            nullstillAndreForelderFelter();
            skriftligAvtaleOmDeltBosted.validerOgSettFelt(null);
        }
    });

    /*---INSTITUSJON---*/

    const institusjonsnavn = useInputFelt(
        barn[barnDataKeySpørsmål.institusjonsnavn],
        'ombarnet.institusjon.navn.feilmelding',
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon)
    );

    const institusjonsadresse = useInputFelt(
        barn[barnDataKeySpørsmål.institusjonsadresse],
        'ombarnet.institusjon.adresse.feilmelding',
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon)
    );

    const institusjonspostnummer = useFelt<string>({
        verdi: barn[barnDataKeySpørsmål.institusjonspostnummer].svar,
        feltId: barn[barnDataKeySpørsmål.institusjonspostnummer].id,
        valideringsfunksjon: felt =>
            regexNorskEllerUtenlandskPostnummer(felt.verdi)
                ? ok(felt)
                : feil(
                      felt,
                      <SpråkTekst
                          id={
                              felt.verdi.length > 10
                                  ? 'ombarnet.institusjon.postnummer.over-ti-tegn.feilmelding'
                                  : 'ombarnet.institusjon.postnummer.under-tre-tegn.feilmelding'
                          }
                      />
                  ),
        skalFeltetVises: () => skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
    });

    const institusjonOppholdStartdato = useDatovelgerFelt(
        barn[barnDataKeySpørsmål.institusjonOppholdStartdato],
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
        'ombarnet.institusjon.startdato.feilmelding'
    );

    const institusjonOppholdSluttVetIkke = useFelt<ESvar>({
        verdi:
            barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ESvar.JA
                : ESvar.NEI,
        feltId: OmBarnetSpørsmålsId.institusjonOppholdVetIkke,
    });

    const institusjonOppholdSluttdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].id,
        barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar !==
            AlternativtSvarForInput.UKJENT
            ? barn[barnDataKeySpørsmål.institusjonOppholdSluttdato].svar
            : '',
        institusjonOppholdSluttVetIkke,
        'ombarnet.institusjon.sluttdato.feilmelding',
        skalFeltetVises(barnDataKeySpørsmål.oppholderSegIInstitusjon),
        false,
        undefined,
        institusjonOppholdStartdato.verdi
    );

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

    const planleggerÅBoINorge12Mnd = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
        'ombarnet.planlagt-sammenhengende-opphold.feilmelding',
        undefined,
        false,
        !skalFeltetVises(barnDataKeySpørsmål.boddMindreEnn12MndINorge) ||
            flyttetPermanentFraNorge(utenlandsperioder) ||
            !utenlandsperioder.length
    );

    const leggTilUtenlandsperiode = (periode: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState => prevState.concat(periode));
    };

    const fjernUtenlandsperiode = (periodeSomSkalFjernes: IUtenlandsperiode) => {
        settUtenlandsperioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };

    /*--- MOTTAR BARNETRYGD FRA ANNET EØSLAND ---*/

    const barnetrygdFraEøslandHvilketLand = useLanddropdownFelt(
        barn[barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand],
        'ombarnet.barnetrygd-eøs.land.feilmelding',
        skalFeltetVises(barnDataKeySpørsmål.barnetrygdFraAnnetEøsland)
    );

    /*--- ANDRE FORELDER ---*/
    const sammeForelderSomAnnetBarn = useFelt<string | null>({
        feltId: 'sammeForelderSomAnnetBarn',
        verdi: null,
        valideringsfunksjon: (felt: FeltState<string | null>) => {
            return felt.verdi !== null
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.mangler-svar.feilmelding'} />);
        },
        skalFeltetVises: () =>
            !barn.barnErFyltUt &&
            barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI &&
            andreBarnSomErFyltUt.length > 0,
    });

    const andreForelderNavnUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(barn[barnDataKeySpørsmål.andreForelderNavn].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderNavnUkjent,
        skalFeltetVises: () => barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI,
    });
    const andreForelderNavn = useInputFeltMedUkjent(
        barn[barnDataKeySpørsmål.andreForelderNavn],
        andreForelderNavnUkjent,
        'ombarnet.andre-forelder.navn.feilmelding',
        false,
        barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI
    );

    const andreForelderFnrUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(barn[barnDataKeySpørsmål.andreForelderFnr].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderFnrUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI &&
                avhengigheter &&
                avhengigheter.andreForelderNavnUkjent &&
                avhengigheter.andreForelderNavnUkjent.verdi === ESvar.NEI
            );
        },
        avhengigheter: { andreForelderNavnUkjent },
        nullstillVedAvhengighetEndring: false,
    });

    const andreForelderFnr = useInputFeltMedUkjent(
        barn[barnDataKeySpørsmål.andreForelderFnr],
        andreForelderFnrUkjent,
        'ombarnet.andre-forelder.fnr.feilmelding',
        true,
        andreForelderNavnUkjent.verdi === ESvar.NEI &&
            barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI
    );

    const andreForelderFødselsdatoUkjent = useFelt<ESvar>({
        verdi: formaterVerdiForCheckbox(barn[barnDataKeySpørsmål.andreForelderFødselsdato].svar),
        feltId: OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent,
        skalFeltetVises: avhengigheter => {
            return (
                avhengigheter &&
                avhengigheter.andreForelderFnrUkjent &&
                avhengigheter.andreForelderFnrUkjent.verdi === ESvar.JA &&
                avhengigheter.andreForelderNavnUkjent.verdi === ESvar.NEI
            );
        },
        avhengigheter: { andreForelderFnrUkjent, andreForelderNavnUkjent },
        nullstillVedAvhengighetEndring: false,
    });
    const andreForelderFødselsdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.andreForelderFødselsdato].id,
        formaterInitVerdiForInputMedUkjent(barn[barnDataKeySpørsmål.andreForelderFødselsdato].svar),
        andreForelderFødselsdatoUkjent,
        'ombarnet.andre-forelder.fødselsdato.feilmelding',
        andreForelderFnrUkjent.verdi === ESvar.JA && andreForelderNavnUkjent.verdi === ESvar.NEI,
        sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === ANNEN_FORELDER,
        dagensDato()
    );

    useEffect(() => {
        if (andreForelderNavnUkjent.verdi === ESvar.JA) {
            andreForelderFnr.validerOgSettFelt('');
            andreForelderFnrUkjent.validerOgSettFelt(ESvar.NEI);
            andreForelderFødselsdato.validerOgSettFelt('');
            andreForelderFødselsdatoUkjent.validerOgSettFelt(ESvar.NEI);
        }
    }, [andreForelderNavnUkjent.verdi]);

    const andreForelderArbeidUtlandet = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.andreForelderArbeidUtlandet],
        barn.andreForelderErDød.svar === ESvar.JA
            ? 'enkeenkemann.andreforelder-arbeidutland.feilmelding'
            : 'ombarnet.andre-forelder.arbeid-utland.feilmelding',
        {
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
        false,
        false,
        { navn: barnetsNavnValue(barn, intl) }
    );

    const andreForelderArbeidUtlandetHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet(
        barn.andreForelderArbeidUtlandetHvilketLand,
        barn.andreForelderErDød.svar === ESvar.JA
            ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
            : 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding',
        ESvar.JA,
        andreForelderArbeidUtlandet,
        sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === ANNEN_FORELDER
    );

    const andreForelderPensjonUtland = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.andreForelderPensjonUtland],
        barn.andreForelderErDød.svar === ESvar.JA
            ? 'enkeenkemann.andre-forelder.utenlandspensjon.feilmelding'
            : 'ombarnet.andre-forelder.utenlandspensjon.feilmelding',
        {
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
        false,
        false,
        { navn: barnetsNavnValue(barn, intl) }
    );

    const andreForelderPensjonHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet(
        barn.andreForelderPensjonHvilketLand,
        barn.andreForelderErDød.svar === ESvar.JA
            ? 'enkeenkemann.andre-forelder.utenlandspensjon.land.feilmelding'
            : 'ombarnet.andre-forelder.utenlandspensjon.land.feilmelding',
        ESvar.JA,
        andreForelderPensjonUtland,
        sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === ANNEN_FORELDER
    );

    const settSammeForelder = (radioVerdi: string) => {
        const annetBarn = søknad.barnInkludertISøknaden.find(barn => barn.id === radioVerdi);
        if (annetBarn) {
            andreForelderNavn.validerOgSettFelt(
                formaterInitVerdiForInputMedUkjent(annetBarn.andreForelderNavn.svar)
            );
            andreForelderFnr.validerOgSettFelt(
                formaterInitVerdiForInputMedUkjent(annetBarn.andreForelderFnr.svar)
            );
            andreForelderNavnUkjent.validerOgSettFelt(
                formaterVerdiForCheckbox(annetBarn.andreForelderNavn.svar)
            );
            andreForelderFnrUkjent.validerOgSettFelt(
                formaterVerdiForCheckbox(annetBarn.andreForelderFnr.svar)
            );

            andreForelderFødselsdato.validerOgSettFelt(
                formaterInitVerdiForInputMedUkjent(annetBarn.andreForelderFødselsdato.svar)
            );
            andreForelderFødselsdatoUkjent.validerOgSettFelt(
                formaterVerdiForCheckbox(annetBarn.andreForelderFødselsdato.svar)
            );

            andreForelderArbeidUtlandet.validerOgSettFelt(
                annetBarn.andreForelderArbeidUtlandet.svar
            );
            andreForelderArbeidUtlandetHvilketLand.validerOgSettFelt(
                annetBarn.andreForelderArbeidUtlandetHvilketLand.svar
            );
            andreForelderPensjonUtland.validerOgSettFelt(annetBarn.andreForelderPensjonUtland.svar);
            andreForelderPensjonHvilketLand.validerOgSettFelt(
                annetBarn.andreForelderPensjonHvilketLand.svar
            );
        } else {
            nullstillAndreForelderFelter();
        }
    };

    const nullstillAndreForelderFelter = () => {
        andreForelderNavn.validerOgSettFelt('');
        andreForelderNavnUkjent.validerOgSettFelt(ESvar.NEI);
        andreForelderFnr.validerOgSettFelt('');
        andreForelderFnrUkjent.validerOgSettFelt(ESvar.NEI);
        andreForelderFødselsdato.validerOgSettFelt('');
        andreForelderFødselsdatoUkjent.validerOgSettFelt(ESvar.NEI);
        andreForelderArbeidUtlandet.validerOgSettFelt(null);
        andreForelderArbeidUtlandetHvilketLand.validerOgSettFelt('');
        andreForelderPensjonUtland.validerOgSettFelt(null);
        andreForelderPensjonHvilketLand.validerOgSettFelt('');
    };

    /*--- BOSTED ---*/

    const avhengigheterForBosted = () => {
        return barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI
            ? {
                  andreForelderArbeidUtlandet: {
                      hovedSpørsmål: andreForelderArbeidUtlandet,
                      tilhørendeFelter: [andreForelderArbeidUtlandetHvilketLand],
                  },
                  andreForelderPensjonUtland: {
                      hovedSpørsmål: andreForelderPensjonUtland,
                      tilhørendeFelter: [andreForelderPensjonHvilketLand],
                  },
              }
            : undefined;
    };

    const borFastMedSøker = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.borFastMedSøker],
        'ombarnet.bor-fast.feilmelding',
        avhengigheterForBosted(),
        false,
        false,
        { navn: barnetsNavnValue(barn, intl) }
    );

    const skriftligAvtaleOmDeltBosted = useJaNeiSpmFelt(
        barn[barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted],
        'ombarnet.delt-bosted.feilmelding',
        avhengigheterForBosted(),
        false,
        barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA ||
            barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA,
        { navn: barnetsNavnValue(barn, intl) }
    );

    /*--- SØKER FOR PERIODE ---*/
    const søkerForTidsrom = useJaNeiSpmFelt(
        barn.søkerForTidsrom,
        'ombarnet.søker-for-periode.feilmelding',
        {
            borFastMedSøker: { hovedSpørsmål: borFastMedSøker },
            skriftligAvtaleOmDeltBosted: skriftligAvtaleOmDeltBosted.erSynlig
                ? {
                      hovedSpørsmål: skriftligAvtaleOmDeltBosted,
                  }
                : undefined,
        },
        false,
        false,
        { navn: barnetsNavnValue(barn, intl) }
    );

    const søkerForTidsromStartdato = useDatovelgerFeltMedJaNeiAvhengighet(
        barn[barnDataKeySpørsmål.søkerForTidsromStartdato],
        ESvar.JA,
        søkerForTidsrom,
        'ombarnet.søker-for-periode.startdato.feilmelding',
        dagensDato()
    );

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

    const søkerForTidsromSluttdato = useDatovelgerFeltMedUkjent(
        barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].id,
        barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar === AlternativtSvarForInput.UKJENT
            ? ''
            : barn[barnDataKeySpørsmål.søkerForTidsromSluttdato].svar,
        søkerForTidsromSluttdatoVetIkke,
        'ombarnet.søker-for-periode.sluttdato.feilmelding',
        søkerForTidsrom.verdi === ESvar.JA,
        false,
        dagensDato(),
        søkerForTidsromStartdato.verdi
    );

    /*--- SØKER HAR BODD MED ANDRE FORELDER - UTVIDET BARNETRYGD---*/

    const søkerHarBoddMedAndreForelder = useJaNeiSpmFelt(
        barn.utvidet[barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder],
        'ombarnet.boddsammenmedandreforelder.feilmelding',
        {
            borFastMedSøker: {
                hovedSpørsmål: borFastMedSøker,
            },
            skriftligAvtaleOmDeltBosted: skriftligAvtaleOmDeltBosted.erSynlig
                ? {
                      hovedSpørsmål: skriftligAvtaleOmDeltBosted,
                  }
                : undefined,
        },
        false,
        !erUtvidet || barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA,
        { navn: barnetsNavnValue(barn, intl) }
    );

    const borMedAndreForelderCheckbox = useFelt<ESvar>({
        verdi:
            barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].svar ===
            AlternativtSvarForInput.UKJENT
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

    const søkerFlyttetFraAndreForelderDato = useDatovelgerFeltMedUkjent(
        barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].id,
        barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].svar ===
            AlternativtSvarForInput.UKJENT
            ? ''
            : barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].svar,
        borMedAndreForelderCheckbox,
        'ombarnet.nårflyttetfra.feilmelding',
        søkerHarBoddMedAndreForelder.verdi === ESvar.JA &&
            barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.NEI,
        true,
        dagensDato()
    );

    const { kanSendeSkjema, skjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmBarnetUtvidetFeltTyper,
        string
    >({
        felter: {
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

    const oppdaterSøknad = () => {
        const oppdatertBarnInkludertISøknaden: IBarnMedISøknad[] =
            søknad.barnInkludertISøknaden.map(barn =>
                barn.id === barnetsUuid
                    ? {
                          ...barn,
                          barnErFyltUt: true,
                          utenlandsperioder: skalFeltetVises(
                              barnDataKeySpørsmål.boddMindreEnn12MndINorge
                          )
                              ? utenlandsperioder
                              : [],
                          institusjonsnavn: {
                              ...barn.institusjonsnavn,
                              svar: trimWhiteSpace(institusjonsnavn.verdi),
                          },
                          institusjonsadresse: {
                              ...barn.institusjonsadresse,
                              svar: trimWhiteSpace(institusjonsadresse.verdi),
                          },
                          institusjonspostnummer: {
                              ...barn.institusjonspostnummer,
                              svar: institusjonspostnummer.verdi,
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
                          andreForelderNavn: {
                              ...barn.andreForelderNavn,
                              svar: trimWhiteSpace(
                                  svarForSpørsmålMedUkjent(
                                      andreForelderNavnUkjent,
                                      andreForelderNavn
                                  )
                              ),
                          },
                          andreForelderFnr: {
                              ...barn.andreForelderFnr,
                              svar: svarForSpørsmålMedUkjent(
                                  andreForelderFnrUkjent,
                                  andreForelderFnr
                              ),
                          },
                          andreForelderFødselsdato: {
                              ...barn.andreForelderFødselsdato,
                              svar: svarForSpørsmålMedUkjent(
                                  andreForelderFødselsdatoUkjent,
                                  andreForelderFødselsdato
                              ),
                          },
                          andreForelderArbeidUtlandet: {
                              ...barn.andreForelderArbeidUtlandet,
                              svar: andreForelderArbeidUtlandet.verdi,
                          },
                          andreForelderArbeidUtlandetHvilketLand: {
                              ...barn.andreForelderArbeidUtlandetHvilketLand,
                              svar: andreForelderArbeidUtlandetHvilketLand.verdi,
                          },
                          andreForelderPensjonUtland: {
                              ...barn.andreForelderPensjonUtland,
                              svar: andreForelderPensjonUtland.verdi,
                          },
                          andreForelderPensjonHvilketLand: {
                              ...barn.andreForelderPensjonHvilketLand,
                              svar: andreForelderPensjonHvilketLand.verdi,
                          },
                          borFastMedSøker: {
                              ...barn.borFastMedSøker,
                              svar: borFastMedSøker.verdi,
                          },
                          skriftligAvtaleOmDeltBosted: {
                              ...barn.skriftligAvtaleOmDeltBosted,
                              svar: skriftligAvtaleOmDeltBosted.verdi,
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
                          utvidet: {
                              søkerHarBoddMedAndreForelder: {
                                  ...barn.utvidet.søkerHarBoddMedAndreForelder,
                                  svar: søkerHarBoddMedAndreForelder.verdi,
                              },
                              søkerFlyttetFraAndreForelderDato: {
                                  ...barn.utvidet.søkerFlyttetFraAndreForelderDato,
                                  svar: svarForSpørsmålMedUkjent(
                                      borMedAndreForelderCheckbox,
                                      søkerFlyttetFraAndreForelderDato
                                  ),
                              },
                          },
                      }
                    : barn
            );

        settSøknad({
            ...søknad,
            barnInkludertISøknaden: oppdatertBarnInkludertISøknaden,
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                switch (dok.dokumentasjonsbehov) {
                    case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
                        return genererOppdatertDokumentasjon(
                            dok,
                            skriftligAvtaleOmDeltBosted.verdi === ESvar.JA &&
                                barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI,
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
                                søknad.søker.sivilstand.type === ESivilstand.SKILT &&
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
        settSammeForelder,
        validerAlleSynligeFelter,
        leggTilUtenlandsperiode,
        fjernUtenlandsperiode,
        utenlandsperioder,
    };
};

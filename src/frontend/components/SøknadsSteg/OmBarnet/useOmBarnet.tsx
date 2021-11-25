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
import { erNorskPostnummer } from '../../../utils/adresse';
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
        feilmeldingSpråkId: 'ombarnet.planlagt-sammenhengende-opphold.feilmelding',
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
    const andreForelderNavn = useInputFeltMedUkjent({
        søknadsfelt: barn[barnDataKeySpørsmål.andreForelderNavn],
        avhengighet: andreForelderNavnUkjent,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.navn.feilmelding',
        skalVises: barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI,
    });

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

    const andreForelderFnr = useInputFeltMedUkjent({
        søknadsfelt: barn[barnDataKeySpørsmål.andreForelderFnr],
        avhengighet: andreForelderFnrUkjent,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.fnr.feilmelding',
        erFnrInput: true,
        skalVises:
            andreForelderNavnUkjent.verdi === ESvar.NEI &&
            barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.NEI,
    });

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
    const andreForelderFødselsdato = useDatovelgerFeltMedUkjent({
        feltId: barn[barnDataKeySpørsmål.andreForelderFødselsdato].id,
        initiellVerdi: formaterInitVerdiForInputMedUkjent(
            barn[barnDataKeySpørsmål.andreForelderFødselsdato].svar
        ),
        vetIkkeCheckbox: andreForelderFødselsdatoUkjent,
        feilmeldingSpråkId: 'ombarnet.andre-forelder.fødselsdato.feilmelding',
        skalFeltetVises:
            andreForelderFnrUkjent.verdi === ESvar.JA &&
            andreForelderNavnUkjent.verdi === ESvar.NEI,
        nullstillVedAvhengighetEndring:
            sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === ANNEN_FORELDER,
        sluttdatoAvgrensning: dagensDato(),
    });

    useEffect(() => {
        if (andreForelderNavnUkjent.verdi === ESvar.JA) {
            andreForelderFnr.validerOgSettFelt('');
            andreForelderFnrUkjent.validerOgSettFelt(ESvar.NEI);
            andreForelderFødselsdato.validerOgSettFelt('');
            andreForelderFødselsdatoUkjent.validerOgSettFelt(ESvar.NEI);
        }
    }, [andreForelderNavnUkjent.verdi]);

    const andreForelderArbeidUtlandet = useJaNeiSpmFelt({
        søknadsfelt: barn[barnDataKeySpørsmål.andreForelderArbeidUtlandet],
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
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(barn, intl) },
    });

    const andreForelderArbeidUtlandetHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: barn.andreForelderArbeidUtlandetHvilketLand,
        feilmeldingSpråkId:
            barn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
                : 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: andreForelderArbeidUtlandet,
        nullstillVedAvhengighetEndring:
            sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === ANNEN_FORELDER,
    });

    const andreForelderPensjonUtland = useJaNeiSpmFelt({
        søknadsfelt: barn[barnDataKeySpørsmål.andreForelderPensjonUtland],
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
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(barn, intl) },
    });

    const andreForelderPensjonHvilketLand = useLanddropdownFeltMedJaNeiAvhengighet({
        søknadsfelt: barn.andreForelderPensjonHvilketLand,
        feilmeldingSpråkId:
            barn.andreForelderErDød.svar === ESvar.JA
                ? 'enkeenkemann.andre-forelder.utenlandspensjon.land.feilmelding'
                : 'ombarnet.andre-forelder.utenlandspensjon.land.feilmelding',
        avhengigSvarCondition: ESvar.JA,
        avhengighet: andreForelderPensjonUtland,
        nullstillVedAvhengighetEndring:
            sammeForelderSomAnnetBarn.verdi === null ||
            sammeForelderSomAnnetBarn.verdi === ANNEN_FORELDER,
    });

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

    const borFastMedSøker = useJaNeiSpmFelt({
        søknadsfelt: barn[barnDataKeySpørsmål.borFastMedSøker],
        feilmeldingSpråkId: 'ombarnet.bor-fast.feilmelding',
        avhengigheter: avhengigheterForBosted(),
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(barn, intl) },
    });

    const skriftligAvtaleOmDeltBosted = useJaNeiSpmFelt({
        søknadsfelt: barn[barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted],
        feilmeldingSpråkId: 'ombarnet.delt-bosted.feilmelding',
        avhengigheter: avhengigheterForBosted(),
        skalSkjules:
            barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA ||
            barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA,
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
        søknadsfelt: barn.utvidet[barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder],
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
        skalSkjules: !erUtvidet || barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA,
        feilmeldingSpråkVerdier: { navn: barnetsNavnValue(barn, intl) },
    });

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

    const søkerFlyttetFraAndreForelderDato = useDatovelgerFeltMedUkjent({
        feltId: barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].id,
        initiellVerdi:
            barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].svar ===
            AlternativtSvarForInput.UKJENT
                ? ''
                : barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato].svar,
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
                          institusjonIUtland: {
                              ...barn.institusjonIUtland,
                              svar: institusjonIUtlandCheckbox.verdi,
                          },
                          institusjonsnavn: {
                              ...barn.institusjonsnavn,
                              svar: institusjonsnavn.erSynlig
                                  ? trimWhiteSpace(institusjonsnavn.verdi)
                                  : '',
                          },
                          institusjonsadresse: {
                              ...barn.institusjonsadresse,
                              svar: institusjonsadresse.erSynlig
                                  ? trimWhiteSpace(institusjonsadresse.verdi)
                                  : '',
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

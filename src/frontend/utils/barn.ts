import { Alpha3Code } from 'i18n-iso-countries';
import type { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { EøsBarnSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { idNummerLandMedPeriodeType } from '../components/SøknadsSteg/EøsSteg/idnummerUtils';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { barnDataKeySpørsmål, IAndreForelder, IBarnMedISøknad } from '../typer/barn';
import { tomString } from '../typer/common';
import { IEøsBarnetrygdsperiode, IUtenlandsperiode } from '../typer/perioder';
import { IBarn, IBarnRespons, IIdNummer } from '../typer/person';
import { ISøknad } from '../typer/søknad';

import { formaterFnr } from './visning';

export const genererInitiellAndreForelder = (
    andreForelder: IAndreForelder | null,
    andreForelderErDød: boolean
): IAndreForelder => {
    return {
        kanIkkeGiOpplysninger: {
            id: OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger,
            svar: andreForelder?.kanIkkeGiOpplysninger.svar ?? ESvar.NEI,
        },
        arbeidsperioderNorge: andreForelder?.arbeidsperioderNorge ?? [],
        arbeidsperioderUtland: andreForelder?.arbeidsperioderUtland ?? [],
        andreUtbetalingsperioder: andreForelder?.andreUtbetalingsperioder ?? [],
        pensjonsperioderNorge: andreForelder?.pensjonsperioderNorge ?? [],
        pensjonsperioderUtland: andreForelder?.pensjonsperioderUtland ?? [],
        eøsBarnetrygdsperioder: andreForelder?.eøsBarnetrygdsperioder ?? [],
        idNummer: andreForelder?.idNummer ?? [],
        navn: {
            id: OmBarnetSpørsmålsId.andreForelderNavn,
            svar: andreForelder?.navn.svar ?? '',
        },
        fnr: {
            id: OmBarnetSpørsmålsId.andreForelderFnr,
            svar: andreForelder?.fnr.svar ?? '',
        },
        fødselsdato: {
            id: OmBarnetSpørsmålsId.andreForelderFødselsdato,
            svar: andreForelder?.fødselsdato.svar ?? '',
        },
        arbeidUtlandet: {
            svar: andreForelder?.arbeidUtlandet.svar ?? null,
            id: andreForelderErDød
                ? OmBarnetSpørsmålsId.andreForelderArbeidUtlandetEnke
                : OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
        },
        pensjonUtland: {
            svar: andreForelder?.pensjonUtland.svar ?? null,
            id: andreForelderErDød
                ? OmBarnetSpørsmålsId.andreForelderPensjonUtlandEnke
                : OmBarnetSpørsmålsId.andreForelderPensjonUtland,
        },
        skriftligAvtaleOmDeltBosted: {
            id: OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted,
            svar:
                andreForelder && !andreForelderErDød
                    ? andreForelder.skriftligAvtaleOmDeltBosted.svar
                    : null,
        },
        arbeidNorge: {
            svar: andreForelder?.arbeidNorge.svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderArbeidNorgeEnke
                : EøsBarnSpørsmålId.andreForelderArbeidNorge,
        },
        pensjonNorge: {
            svar: andreForelder?.pensjonNorge.svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderPensjonNorgeEnke
                : EøsBarnSpørsmålId.andreForelderPensjonNorge,
        },
        andreUtbetalinger: {
            svar: andreForelder?.andreUtbetalinger.svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke
                : EøsBarnSpørsmålId.andreForelderAndreUtbetalinger,
        },
        adresse: {
            svar: andreForelder?.adresse.svar ?? '',
            id: EøsBarnSpørsmålId.andreForelderAdresse,
        },
        pågåendeSøknadFraAnnetEøsLand: {
            svar:
                andreForelder?.pågåendeSøknadFraAnnetEøsLand.svar && !andreForelderErDød
                    ? andreForelder?.pågåendeSøknadFraAnnetEøsLand.svar
                    : null,
            id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadFraAnnetEøsLand,
        },
        pågåendeSøknadHvilketLand: {
            svar:
                andreForelder?.pågåendeSøknadHvilketLand.svar && !andreForelderErDød
                    ? andreForelder?.pågåendeSøknadHvilketLand.svar
                    : '',
            id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadHvilketLand,
        },
        barnetrygdFraEøs: {
            svar: andreForelder?.barnetrygdFraEøs.svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderBarnetrygdGjenlevende
                : EøsBarnSpørsmålId.andreForelderBarnetrygd,
        },
        utvidet: {
            ...andreForelder?.utvidet,
            søkerHarBoddMedAndreForelder: {
                id: OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder,
                svar: andreForelder?.utvidet.søkerHarBoddMedAndreForelder.svar ?? null,
            },
            søkerFlyttetFraAndreForelderDato: {
                id: OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato,
                svar:
                    andreForelder && !andreForelderErDød
                        ? andreForelder.utvidet.søkerFlyttetFraAndreForelderDato.svar
                        : '',
            },
        },
    };
};

export const hentAlder = (dato: string): string => {
    const idag = new Date();
    const fødselsdato = new Date(dato);
    let alder = idag.getFullYear() - fødselsdato.getFullYear();
    const månedDiff = idag.getMonth() - fødselsdato.getMonth();
    if (månedDiff < 0 || (månedDiff === 0 && idag.getDate() < fødselsdato.getDate())) {
        alder--;
    }
    return alder.toString();
};

export const erBarnRegistrertFraFør = (søknad: ISøknad, ident: string) => {
    const barnFraPdl = søknad.søker.barn.find(barn => barn.ident === ident);
    const barnRegistrertManuelt = søknad.barnRegistrertManuelt.find(barn => barn.ident === ident);
    return barnFraPdl || barnRegistrertManuelt;
};

export const genererInitialBarnMedISøknad = (barn: IBarn): IBarnMedISøknad => {
    return {
        ...barn,
        barnErFyltUt: false,
        utenlandsperioder: [],
        eøsBarnetrygdsperioder: [],
        idNummer: [],
        andreForelder: null,
        omsorgsperson: null,
        triggetEøs: false,
        [barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId]: {
            id: OmBarnetSpørsmålsId.sammeForelderSomAnnetBarn,
            svar: null,
        },
        [barnDataKeySpørsmål.erFosterbarn]: {
            id: OmBarnaDineSpørsmålId.hvemErFosterbarn,
            svar: null,
        },
        [barnDataKeySpørsmål.erAdoptertFraUtland]: {
            id: OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland,
            svar: null,
        },
        [barnDataKeySpørsmål.erAsylsøker]: {
            id: OmBarnaDineSpørsmålId.hvemErSøktAsylFor,
            svar: null,
        },
        [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
            id: OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland,
            svar: null,
        },
        [barnDataKeySpørsmål.andreForelderErDød]: {
            id: OmBarnaDineSpørsmålId.hvemAvdødPartner,
            svar: null,
        },
        [barnDataKeySpørsmål.oppholderSegIInstitusjon]: {
            id: OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon,
            svar: null,
        },
        [barnDataKeySpørsmål.institusjonIUtland]: {
            id: OmBarnetSpørsmålsId.institusjonIUtland,
            svar: ESvar.NEI,
        },
        [barnDataKeySpørsmål.institusjonsnavn]: {
            id: OmBarnetSpørsmålsId.institusjonsnavn,
            svar: '',
        },
        [barnDataKeySpørsmål.institusjonsadresse]: {
            id: OmBarnetSpørsmålsId.institusjonsadresse,
            svar: '',
        },
        [barnDataKeySpørsmål.institusjonspostnummer]: {
            id: OmBarnetSpørsmålsId.institusjonspostnummer,
            svar: '',
        },
        [barnDataKeySpørsmål.institusjonOppholdStartdato]: {
            id: OmBarnetSpørsmålsId.institusjonOppholdStartdato,
            svar: '',
        },
        [barnDataKeySpørsmål.institusjonOppholdSluttdato]: {
            id: OmBarnetSpørsmålsId.institusjonOppholdSluttdato,
            svar: '',
        },
        [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: {
            id: OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge,
            svar: null,
        },
        [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: {
            id: OmBarnetSpørsmålsId.planleggerÅBoINorge12Mnd,
            svar: null,
        },
        [barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: {
            id: OmBarnetSpørsmålsId.pågåendeSøknadFraAnnetEøsLand,
            svar: null,
        },
        [barnDataKeySpørsmål.pågåendeSøknadHvilketLand]: {
            id: OmBarnetSpørsmålsId.pågåendeSøknadHvilketLand,
            svar: '',
        },
        [barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd]: {
            id: OmBarnetSpørsmålsId.mottarEllerMottokEøsBarnetrygd,
            svar: null,
        },
        [barnDataKeySpørsmål.borFastMedSøker]: {
            id: OmBarnetSpørsmålsId.borFastMedSøker,
            svar: null,
        },
        [barnDataKeySpørsmål.søkersSlektsforhold]: {
            id: EøsBarnSpørsmålId.søkersSlektsforhold,
            svar: '',
        },
        [barnDataKeySpørsmål.søkersSlektsforholdSpesifisering]: {
            id: EøsBarnSpørsmålId.søkersSlektsforholdSpesifisering,
            svar: '',
        },
        [barnDataKeySpørsmål.borMedAndreForelder]: {
            id: EøsBarnSpørsmålId.borMedAndreForelder,
            svar: null,
        },
        [barnDataKeySpørsmål.borMedOmsorgsperson]: {
            id: EøsBarnSpørsmålId.borMedOmsorgsperson,
            svar: null,
        },
        [barnDataKeySpørsmål.adresse]: {
            id: EøsBarnSpørsmålId.barnetsAdresse,
            svar: '',
        },
    };
};

export const hentUid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const mapBarnResponsTilBarn = (barn: IBarnRespons[], intl): IBarn[] => {
    return barn.map(barnRespons => ({
        id: hentUid(),
        navn: barnetsNavnValue(barnRespons, intl),
        ident: barnRespons.ident,
        alder: barnRespons.fødselsdato ? hentAlder(barnRespons.fødselsdato) : null,
        borMedSøker: barnRespons.borMedSøker,
        adressebeskyttelse: barnRespons.adressebeskyttelse,
    }));
};

export const barnetsNavnValue = (barn: IBarnRespons, intl: IntlShape): string => {
    return barn.navn
        ? barn.navn
        : intl.formatMessage(
              { id: 'felles.anonym.barn.fnr' },
              { fødselsnummer: formaterFnr(barn.ident) }
          );
};

export const skalSkjuleAndreForelderFelt = (barn: IBarnMedISøknad) => {
    return (
        barn.andreForelder?.kanIkkeGiOpplysninger.svar === ESvar.JA ||
        barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA
    );
};

export const skalSpørreOmIdNummerForPågåendeSøknadEøsLand = (
    barn: IBarnMedISøknad,
    erEøsLand: (land: Alpha3Code | '') => boolean
): boolean => {
    return (
        barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar !== '' &&
        !idNummerLandMedPeriodeType(
            {
                utenlandsperioder: barn.utenlandsperioder,
                eøsBarnetrygdsperioder: barn.eøsBarnetrygdsperioder,
            },
            erEøsLand
        )
            .map(landMedPeriode => landMedPeriode.land)
            .includes(barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand].svar)
    );
};

export const filtrerteRelevanteIdNummerForBarn = (
    perioder: {
        eøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
        utenlandsperioder: IUtenlandsperiode[];
    },
    pågåendeSøknadFraAnnetEøsLand: ESvar | null,
    pågåendeSøknadHvilketLand: Alpha3Code | '',
    barn: IBarnMedISøknad,
    erEøsLand: (land: Alpha3Code | '') => boolean
): IIdNummer[] => {
    const relevanteLandForPerioder = idNummerLandMedPeriodeType(
        {
            eøsBarnetrygdsperioder: perioder.eøsBarnetrygdsperioder,
            utenlandsperioder: perioder.utenlandsperioder,
        },
        erEøsLand
    ).map(landMedPeriode => landMedPeriode.land);

    const inkluderPågåendeSøknadIAnnetLand =
        pågåendeSøknadFraAnnetEøsLand === ESvar.JA &&
        pågåendeSøknadHvilketLand !== '' &&
        !relevanteLandForPerioder.includes(pågåendeSøknadHvilketLand);

    const relevanteLand = inkluderPågåendeSøknadIAnnetLand
        ? relevanteLandForPerioder.concat(pågåendeSøknadHvilketLand)
        : relevanteLandForPerioder;

    return barn.idNummer.filter(idNummerObj => relevanteLand.includes(idNummerObj.land));
};

export const nullstilteEøsFelterForAndreForelder = (
    andreForelder: IAndreForelder
): IAndreForelder => ({
    ...andreForelder,
    idNummer: [],
    pensjonNorge: {
        ...andreForelder.pensjonNorge,
        svar: null,
    },
    arbeidNorge: {
        ...andreForelder.arbeidNorge,
        svar: null,
    },
    andreUtbetalinger: {
        ...andreForelder.andreUtbetalinger,
        svar: null,
    },
    pågåendeSøknadFraAnnetEøsLand: {
        ...andreForelder.pågåendeSøknadFraAnnetEøsLand,
        svar: null,
    },
    pågåendeSøknadHvilketLand: {
        ...andreForelder.pågåendeSøknadHvilketLand,
        svar: '',
    },
    barnetrygdFraEøs: {
        ...andreForelder.barnetrygdFraEøs,
        svar: null,
    },
    pensjonsperioderNorge: [],
    arbeidsperioderNorge: [],
    andreUtbetalingsperioder: [],
    eøsBarnetrygdsperioder: [],
    adresse: { ...andreForelder.adresse, svar: '' },
});

export const nullstilteEøsFelterForBarn = (barn: IBarnMedISøknad) => ({
    idNummer: [],
    søkersSlektsforhold: { ...barn.søkersSlektsforhold, svar: tomString },
    søkersSlektsforholdSpesifisering: {
        ...barn.søkersSlektsforholdSpesifisering,
        svar: '',
    },
    borMedAndreForelder: { ...barn.borMedAndreForelder, svar: null },
    borMedOmsorgsperson: { ...barn.borMedOmsorgsperson, svar: null },
    omsorgsperson: null,
    adresse: { ...barn.adresse, svar: '' },
    ...(barn.andreForelder && {
        andreForelder: nullstilteEøsFelterForAndreForelder(barn.andreForelder),
    }),
});

export const skalViseBorMedOmsorgsperson = (
    borMedAndreForelder: ESvar | null,
    borFastMedSøker: ESvar | null,
    oppholderSegIInstitusjon: ESvar | null,
    andreForelderErDød: ESvar | null,
    erFosterbarn: ESvar | null
) => {
    const andreSituasjonerSomUtløserOmsorgsperson =
        borFastMedSøker === ESvar.NEI &&
        oppholderSegIInstitusjon === ESvar.NEI &&
        (andreForelderErDød === ESvar.JA || erFosterbarn === ESvar.JA);

    return borMedAndreForelder === ESvar.NEI || andreSituasjonerSomUtløserOmsorgsperson;
};

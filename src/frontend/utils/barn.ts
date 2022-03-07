import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { EøsBarnSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../typer/barn';
import { AlternativtSvarForInput } from '../typer/common';
import { IBarn, IBarnRespons } from '../typer/person';
import { IOmBarnaDineFeltTyper } from '../typer/skjema';
import { ISøknad } from '../typer/søknad';
import { formaterFnr } from './visning';

export const genererSvarForSpørsmålBarn = (barn: IBarnMedISøknad, felt: Felt<string[]>): ESvar =>
    felt.verdi.includes(barn.id) ? ESvar.JA : ESvar.NEI;

export const genererSvarForOppfølgningspørsmålBarn = (
    svarPåGrunnSpørsmål,
    søknadsfelt,
    nullstillingsVerdi
) => {
    return svarPåGrunnSpørsmål === ESvar.JA ? søknadsfelt.svar : nullstillingsVerdi;
};

export const genererAndreForelder = (
    andreForelder: IAndreForelder | null,
    andreForelderErDød: boolean
): IAndreForelder => {
    return {
        arbeidsperioderNorge: andreForelder?.arbeidsperioderNorge ?? [],
        arbeidsperioderUtland: andreForelder?.arbeidsperioderUtland ?? [],
        andreUtbetalingsperioder: andreForelder?.andreUtbetalingsperioder ?? [],
        pensjonsperioderNorge: andreForelder?.pensjonsperioderNorge ?? [],
        pensjonsperioderUtland: andreForelder?.pensjonsperioderUtland ?? [],
        [andreForelderDataKeySpørsmål.navn]: {
            id: OmBarnetSpørsmålsId.andreForelderNavn,
            svar: andreForelder?.[andreForelderDataKeySpørsmål.navn].svar ?? '',
        },
        [andreForelderDataKeySpørsmål.fnr]: {
            id: OmBarnetSpørsmålsId.andreForelderFnr,
            svar: andreForelder?.[andreForelderDataKeySpørsmål.fnr].svar ?? '',
        },
        [andreForelderDataKeySpørsmål.fødselsdato]: {
            id: OmBarnetSpørsmålsId.andreForelderFødselsdato,
            svar: andreForelder?.[andreForelderDataKeySpørsmål.fødselsdato].svar ?? '',
        },
        [andreForelderDataKeySpørsmål.arbeidUtlandet]: {
            svar: andreForelder?.[andreForelderDataKeySpørsmål.arbeidUtlandet].svar ?? null,
            id: andreForelderErDød
                ? OmBarnetSpørsmålsId.andreForelderArbeidUtlandetEnke
                : OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
        },
        [andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]: {
            svar:
                andreForelder?.[andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand].svar ?? '',
            id: andreForelderErDød
                ? OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLandEnke
                : OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand,
        },
        [andreForelderDataKeySpørsmål.pensjonUtland]: {
            svar: andreForelder?.[andreForelderDataKeySpørsmål.pensjonUtland].svar ?? null,
            id: andreForelderErDød
                ? OmBarnetSpørsmålsId.andreForelderPensjonUtlandEnke
                : OmBarnetSpørsmålsId.andreForelderPensjonUtland,
        },
        [andreForelderDataKeySpørsmål.pensjonHvilketLand]: {
            svar: andreForelder?.[andreForelderDataKeySpørsmål.pensjonHvilketLand].svar ?? '',
            id: andreForelderErDød
                ? OmBarnetSpørsmålsId.andreForelderPensjonHvilketLandEnke
                : OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand,
        },
        [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: {
            id: OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted,
            svar:
                andreForelder && !andreForelderErDød
                    ? andreForelder[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted].svar
                    : null,
        },
        [andreForelderDataKeySpørsmål.arbeidNorge]: {
            svar: andreForelder?.[andreForelderDataKeySpørsmål.arbeidNorge].svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderArbeidNorgeEnke
                : EøsBarnSpørsmålId.andreForelderArbeidNorge,
        },
        [andreForelderDataKeySpørsmål.pensjonNorge]: {
            svar: andreForelder?.[andreForelderDataKeySpørsmål.pensjonNorge].svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderPensjonNorgeEnke
                : EøsBarnSpørsmålId.andreForelderPensjonNorge,
        },
        [andreForelderDataKeySpørsmål.andreUtbetalinger]: {
            svar: andreForelder?.[andreForelderDataKeySpørsmål.andreUtbetalinger].svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke
                : EøsBarnSpørsmålId.andreForelderAndreUtbetalinger,
        },
        utvidet: {
            ...andreForelder?.utvidet,
            [andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]: {
                id: OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder,
                svar:
                    andreForelder?.utvidet[
                        andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder
                    ].svar ?? null,
            },
            [andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]: {
                id: OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato,
                svar:
                    andreForelder && !andreForelderErDød
                        ? andreForelder.utvidet[
                              andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato
                          ].svar
                        : '',
            },
        },
    };
};

export const genererOppdaterteBarn = (
    søknad: ISøknad,
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>,
    skalTriggeEøsForBarn: (barn: IBarnMedISøknad) => boolean
): IBarnMedISøknad[] => {
    return søknad.barnInkludertISøknaden.map(barn => {
        const oppholderSegIInstitusjon: ESvar = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemOppholderSegIInstitusjon
        );

        const boddMindreEnn12MndINorge: ESvar = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemTolvMndSammenhengendeINorge
        );

        const mottarBarnetrygdFraAnnetEøsland: ESvar = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemBarnetrygdFraAnnetEøsland
        );
        const andreForelderErDød: boolean =
            genererSvarForSpørsmålBarn(barn, skjema.felter.hvemAvdødPartner) === ESvar.JA;

        const erFosterbarn: boolean =
            genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn) === ESvar.JA;

        const oppholdtSegIUtlandSiste12Mnd: boolean =
            skjema.felter.hvemTolvMndSammenhengendeINorge.verdi.includes(barn.id);

        const oppdatertBarn = {
            ...barn,
            utenlandsperioder: oppholdtSegIUtlandSiste12Mnd ? barn.utenlandsperioder : [],
            eøsBarnetrygdsperioder:
                mottarBarnetrygdFraAnnetEøsland === ESvar.JA ? barn.eøsBarnetrygdsperioder : [],
            andreForelder: erFosterbarn
                ? null
                : genererAndreForelder(barn.andreForelder, andreForelderErDød),
            [barnDataKeySpørsmål.erFosterbarn]: {
                ...barn[barnDataKeySpørsmål.erFosterbarn],
                svar: erFosterbarn ? ESvar.JA : ESvar.NEI,
            },
            [barnDataKeySpørsmål.erAsylsøker]: {
                ...barn[barnDataKeySpørsmål.erAsylsøker],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErSøktAsylFor),
            },
            [barnDataKeySpørsmål.erAdoptertFraUtland]: {
                ...barn[barnDataKeySpørsmål.erAdoptertFraUtland],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErAdoptertFraUtland),
            },
            [barnDataKeySpørsmål.oppholderSegIInstitusjon]: {
                ...barn[barnDataKeySpørsmål.oppholderSegIInstitusjon],
                svar: oppholderSegIInstitusjon,
            },
            [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: {
                ...barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge],
                svar: boddMindreEnn12MndINorge,
            },
            [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
                ...barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland],
                svar: mottarBarnetrygdFraAnnetEøsland,
            },
            [barnDataKeySpørsmål.andreForelderErDød]: {
                ...barn[barnDataKeySpørsmål.andreForelderErDød],
                svar: andreForelderErDød ? ESvar.JA : ESvar.NEI,
            },
            [barnDataKeySpørsmål.institusjonIUtland]: {
                ...barn[barnDataKeySpørsmål.institusjonIUtland],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonIUtland],
                    ESvar.NEI
                ),
            },
            [barnDataKeySpørsmål.institusjonsnavn]: {
                ...barn[barnDataKeySpørsmål.institusjonsnavn],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonsnavn],
                    ''
                ),
            },
            [barnDataKeySpørsmål.institusjonsadresse]: {
                ...barn[barnDataKeySpørsmål.institusjonsadresse],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonsadresse],
                    ''
                ),
            },
            [barnDataKeySpørsmål.institusjonspostnummer]: {
                ...barn[barnDataKeySpørsmål.institusjonspostnummer],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonspostnummer],
                    ''
                ),
            },
            [barnDataKeySpørsmål.institusjonOppholdStartdato]: {
                ...barn[barnDataKeySpørsmål.institusjonOppholdStartdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonOppholdStartdato],
                    ''
                ),
            },
            [barnDataKeySpørsmål.institusjonOppholdSluttdato]: {
                ...barn[barnDataKeySpørsmål.institusjonOppholdSluttdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonOppholdSluttdato],
                    ''
                ),
            },
            [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: {
                ...barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    boddMindreEnn12MndINorge,
                    barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
                    null
                ),
            },
            [barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]: {
                ...barn[barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    mottarBarnetrygdFraAnnetEøsland,
                    barn[barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand],
                    ''
                ),
            },
            [barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd]: {
                ...barn[barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    mottarBarnetrygdFraAnnetEøsland,
                    barn[barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd],
                    null
                ),
            },
        };

        return { ...oppdatertBarn, triggetEøs: skalTriggeEøsForBarn(oppdatertBarn) };
    });
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
        andreForelder: null,
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
        [barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]: {
            id: OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand,
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
        [barnDataKeySpørsmål.søkerForTidsrom]: {
            id: OmBarnetSpørsmålsId.søkerForTidsrom,
            svar: null,
        },
        [barnDataKeySpørsmål.søkerForTidsromStartdato]: {
            id: OmBarnetSpørsmålsId.søkerForTidsromStartdato,
            svar: '',
        },
        [barnDataKeySpørsmål.søkerForTidsromSluttdato]: {
            id: OmBarnetSpørsmålsId.søkerForTidsromSluttdato,
            svar: '',
        },
        [barnDataKeySpørsmål.søkersSlektsforhold]: {
            id: EøsBarnSpørsmålId.søkersSlektsforhold,
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

export const mapBarnResponsTilBarn = (barn: IBarnRespons[]): IBarn[] => {
    return barn.map(barnRespons => ({
        id: hentUid(),
        navn: barnRespons.navn,
        ident: barnRespons.ident,
        alder: barnRespons.fødselsdato && hentAlder(barnRespons.fødselsdato),
        borMedSøker: barnRespons.borMedSøker,
        adressebeskyttelse: barnRespons.adressebeskyttelse,
    }));
};

export const barnetsNavnValue = (barn: IBarn, intl: IntlShape): string => {
    return barn.navn
        ? barn.navn.toUpperCase()
        : intl.formatMessage(
              { id: 'felles.anonym.barn.fnr' },
              { fødselsnummer: formaterFnr(barn.ident) }
          );
};

export const skalSkjuleAndreForelderFelt = (barn: IBarnMedISøknad) => {
    const kanIkkeGiOpplysningerOmAndreForelder =
        barn.andreForelder?.[andreForelderDataKeySpørsmål.navn].svar ===
        AlternativtSvarForInput.UKJENT;
    return (
        kanIkkeGiOpplysningerOmAndreForelder ||
        barn[barnDataKeySpørsmål.erFosterbarn].svar === ESvar.JA
    );
};

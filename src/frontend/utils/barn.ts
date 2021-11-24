import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import {
    barnDataKeySpørsmål,
    barnDataKeySpørsmålUtvidet,
    IBarn,
    IBarnRespons,
} from '../typer/person';
import { IOmBarnaDineFeltTyper } from '../typer/skjema';
import { IBarnMedISøknad, ISøknad } from '../typer/søknad';
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

export const genererOppdaterteBarn = (
    søknad: ISøknad,
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>
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

        return {
            ...barn,
            utenlandsperioder: oppholdtSegIUtlandSiste12Mnd ? barn.utenlandsperioder : [],
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
            [barnDataKeySpørsmål.andreForelderArbeidUtlandet]: {
                ...barn[barnDataKeySpørsmål.andreForelderArbeidUtlandet],
                id: andreForelderErDød
                    ? OmBarnetSpørsmålsId.andreForelderArbeidUtlandetEnke
                    : OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
            },
            [barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand]: {
                ...barn[barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand],
                id: andreForelderErDød
                    ? OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLandEnke
                    : OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand,
            },
            [barnDataKeySpørsmål.andreForelderPensjonUtland]: {
                ...barn[barnDataKeySpørsmål.andreForelderPensjonUtland],
                id: andreForelderErDød
                    ? OmBarnetSpørsmålsId.andreForelderPensjonUtlandEnke
                    : OmBarnetSpørsmålsId.andreForelderPensjonUtland,
            },
            [barnDataKeySpørsmål.andreForelderPensjonHvilketLand]: {
                ...barn[barnDataKeySpørsmål.andreForelderPensjonHvilketLand],
                id: andreForelderErDød
                    ? OmBarnetSpørsmålsId.andreForelderPensjonHvilketLandEnke
                    : OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand,
            },
            [barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: {
                ...barn[barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted],
                svar:
                    andreForelderErDød || erFosterbarn
                        ? null
                        : barn[barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted].svar,
            },
            utvidet: {
                ...barn.utvidet,
                [barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder]: {
                    ...barn.utvidet[barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder],
                    svar: erFosterbarn
                        ? null
                        : barn.utvidet[barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder]
                              .svar,
                },
                [barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato]: {
                    ...barn.utvidet[barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato],
                    svar:
                        andreForelderErDød || erFosterbarn
                            ? ''
                            : barn.utvidet[
                                  barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato
                              ].svar,
                },
            },
        };
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
        utvidet: {
            [barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder]: {
                id: OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder,
                svar: null,
            },
            [barnDataKeySpørsmålUtvidet.søkerFlyttetFraAndreForelderDato]: {
                id: OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato,
                svar: '',
            },
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
        [barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]: {
            id: OmBarnetSpørsmålsId.barnetrygdFraEøslandHvilketLand,
            svar: '',
        },
        [barnDataKeySpørsmål.andreForelderNavn]: {
            id: OmBarnetSpørsmålsId.andreForelderNavn,
            svar: '',
        },
        [barnDataKeySpørsmål.andreForelderFnr]: {
            id: OmBarnetSpørsmålsId.andreForelderFnr,
            svar: '',
        },
        [barnDataKeySpørsmål.andreForelderFødselsdato]: {
            id: OmBarnetSpørsmålsId.andreForelderFødselsdato,
            svar: '',
        },
        [barnDataKeySpørsmål.andreForelderArbeidUtlandet]: {
            id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandet,
            svar: null,
        },
        [barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand]: {
            id: OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand,
            svar: '',
        },
        [barnDataKeySpørsmål.andreForelderPensjonUtland]: {
            id: OmBarnetSpørsmålsId.andreForelderPensjonUtland,
            svar: null,
        },
        [barnDataKeySpørsmål.andreForelderPensjonHvilketLand]: {
            id: OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand,
            svar: '',
        },
        [barnDataKeySpørsmål.borFastMedSøker]: {
            id: OmBarnetSpørsmålsId.borFastMedSøker,
            svar: null,
        },
        [barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: {
            id: OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted,
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
    return barn.adressebeskyttelse
        ? (intl.formatMessage(
              { id: 'felles.anonym.barn.fnr' },
              { fødselsnummer: formaterFnr(barn.ident) }
          ) as string)
        : barn.navn.toUpperCase();
};

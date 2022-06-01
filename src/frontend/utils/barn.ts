import { Alpha3Code } from 'i18n-iso-countries';
import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { EøsBarnSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { idNummerLandMedPeriodeType } from '../components/SøknadsSteg/EøsSteg/idnummerUtils';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../typer/barn';
import { tomString } from '../typer/common';
import { IOmsorgsperson } from '../typer/omsorgsperson';
import { IEøsBarnetrygdsperiode, IUtenlandsperiode } from '../typer/perioder';
import { IBarn, IBarnRespons, IIdNummer } from '../typer/person';
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

export const genererInitiellAndreForelder = (
    andreForelder: IAndreForelder | null,
    andreForelderErDød: boolean
): IAndreForelder => {
    return {
        kanIkkeGiOpplysninger: false,
        arbeidsperioderNorge: andreForelder?.arbeidsperioderNorge ?? [],
        arbeidsperioderUtland: andreForelder?.arbeidsperioderUtland ?? [],
        andreUtbetalingsperioder: andreForelder?.andreUtbetalingsperioder ?? [],
        pensjonsperioderNorge: andreForelder?.pensjonsperioderNorge ?? [],
        pensjonsperioderUtland: andreForelder?.pensjonsperioderUtland ?? [],
        eøsBarnetrygdsperioder: andreForelder?.eøsBarnetrygdsperioder ?? [],
        idNummer: andreForelder?.idNummer ?? [],
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
        [andreForelderDataKeySpørsmål.pensjonUtland]: {
            svar: andreForelder?.[andreForelderDataKeySpørsmål.pensjonUtland].svar ?? null,
            id: andreForelderErDød
                ? OmBarnetSpørsmålsId.andreForelderPensjonUtlandEnke
                : OmBarnetSpørsmålsId.andreForelderPensjonUtland,
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
        [andreForelderDataKeySpørsmål.adresse]: {
            svar: andreForelder?.adresse.svar ?? '',
            id: EøsBarnSpørsmålId.andreForelderAdresse,
        },
        [andreForelderDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: {
            svar:
                andreForelder?.[andreForelderDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand].svar &&
                !andreForelderErDød
                    ? andreForelder?.[andreForelderDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]
                          .svar
                    : null,
            id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadFraAnnetEøsLand,
        },
        [andreForelderDataKeySpørsmål.pågåendeSøknadHvilketLand]: {
            svar:
                andreForelder?.[andreForelderDataKeySpørsmål.pågåendeSøknadHvilketLand].svar &&
                !andreForelderErDød
                    ? andreForelder?.[andreForelderDataKeySpørsmål.pågåendeSøknadHvilketLand].svar
                    : '',
            id: EøsBarnSpørsmålId.andreForelderPågåendeSøknadHvilketLand,
        },
        [andreForelderDataKeySpørsmål.barnetrygdFraEøs]: {
            svar: andreForelder?.[andreForelderDataKeySpørsmål.barnetrygdFraEøs].svar ?? null,
            id: andreForelderErDød
                ? EøsBarnSpørsmålId.andreForelderBarnetrygdGjenlevende
                : EøsBarnSpørsmålId.andreForelderBarnetrygd,
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
    skalTriggeEøsForBarn: (barn: IBarnMedISøknad) => boolean,
    erEøsLand: (land: Alpha3Code | '') => boolean
): IBarnMedISøknad[] => {
    return søknad.barnInkludertISøknaden.map((barn): IBarnMedISøknad => {
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
        const andreForelderErDød: ESvar = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemAvdødPartner
        );

        const erFosterbarn: ESvar = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemErFosterbarn
        );

        const utenlandsperioder =
            boddMindreEnn12MndINorge === ESvar.JA ? barn.utenlandsperioder : [];
        const eøsBarnetrygdsperioder =
            mottarBarnetrygdFraAnnetEøsland === ESvar.JA ? barn.eøsBarnetrygdsperioder : [];

        const pågåendeSøknadFraAnnetEøsLand: ESvar | null = genererSvarForOppfølgningspørsmålBarn(
            mottarBarnetrygdFraAnnetEøsland,
            barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand],
            null
        );

        const pågåendeSøknadHvilketLand: Alpha3Code | '' = genererSvarForOppfølgningspørsmålBarn(
            mottarBarnetrygdFraAnnetEøsland,
            barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand],
            ''
        );

        const borMedAnnenForelderErIkkeRelevant = () =>
            erFosterbarn === ESvar.JA ||
            oppholderSegIInstitusjon === ESvar.JA ||
            andreForelderErDød === ESvar.JA;

        const borMedAndreForelder = borMedAnnenForelderErIkkeRelevant()
            ? null
            : barn.borMedAndreForelder.svar;

        const borMedOmsorgsperson: ESvar | null = skalViseBorMedOmsorgsperson(
            borMedAndreForelder,
            barn.borFastMedSøker.svar,
            oppholderSegIInstitusjon,
            andreForelderErDød,
            erFosterbarn
        )
            ? barn[barnDataKeySpørsmål.borMedOmsorgsperson].svar
            : null;

        const omsorgsperson: IOmsorgsperson | null =
            barn.omsorgsperson && borMedOmsorgsperson === ESvar.JA
                ? {
                      ...barn.omsorgsperson,
                      ...(erFosterbarn === ESvar.JA && {
                          slektsforhold: { ...barn.omsorgsperson?.slektsforhold, svar: '' },
                          slektsforholdSpesifisering: {
                              ...barn.omsorgsperson?.slektsforholdSpesifisering,
                              svar: '',
                          },
                      }),
                  }
                : null;

        const oppdatertBarn = {
            ...barn,
            idNummer: filtrerteRelevanteIdNummerForBarn(
                { eøsBarnetrygdsperioder, utenlandsperioder },
                pågåendeSøknadFraAnnetEøsLand,
                pågåendeSøknadHvilketLand,
                barn,
                erEøsLand
            ),
            utenlandsperioder,
            eøsBarnetrygdsperioder,
            andreForelder:
                erFosterbarn === ESvar.JA
                    ? null
                    : genererInitiellAndreForelder(
                          barn.andreForelder,
                          andreForelderErDød === ESvar.JA
                      ),
            omsorgsperson,
            [barnDataKeySpørsmål.borMedAndreForelder]: {
                ...barn[barnDataKeySpørsmål.borMedAndreForelder],
                svar: borMedAndreForelder,
            },
            [barnDataKeySpørsmål.søkersSlektsforhold]: {
                id: EøsBarnSpørsmålId.søkersSlektsforhold,
                svar: erFosterbarn === ESvar.JA ? '' : barn.søkersSlektsforhold.svar,
            },
            [barnDataKeySpørsmål.søkersSlektsforholdSpesifisering]: {
                id: EøsBarnSpørsmålId.søkersSlektsforholdSpesifisering,
                svar: erFosterbarn === ESvar.JA ? '' : barn.søkersSlektsforholdSpesifisering.svar,
            },
            [barnDataKeySpørsmål.borMedOmsorgsperson]: {
                ...barn[barnDataKeySpørsmål.borMedOmsorgsperson],
                svar: borMedOmsorgsperson,
            },
            [barnDataKeySpørsmål.erFosterbarn]: {
                ...barn[barnDataKeySpørsmål.erFosterbarn],
                svar: erFosterbarn,
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
                svar: andreForelderErDød,
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
            [barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd]: {
                ...barn[barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    mottarBarnetrygdFraAnnetEøsland,
                    barn[barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd],
                    null
                ),
            },
            [barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: {
                ...barn[barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand],
                svar: pågåendeSøknadFraAnnetEøsLand,
            },
            [barnDataKeySpørsmål.pågåendeSøknadHvilketLand]: {
                ...barn[barnDataKeySpørsmål.pågåendeSøknadHvilketLand],
                svar: pågåendeSøknadHvilketLand,
            },
            [barnDataKeySpørsmål.adresse]: {
                ...barn[barnDataKeySpørsmål.adresse],
                svar:
                    erFosterbarn === ESvar.JA ||
                    (barn.andreForelder?.kanIkkeGiOpplysninger &&
                        barn.borMedAndreForelder.svar === ESvar.JA)
                        ? barn.adresse.svar
                        : '',
            },
        };

        const barnTriggetEøs = skalTriggeEøsForBarn(oppdatertBarn);
        const harEøsSteg = barnTriggetEøs || søknad.søker.triggetEøs;

        return {
            ...oppdatertBarn,
            triggetEøs: barnTriggetEøs,
            ...(!harEøsSteg && nullstilteEøsFelterForBarn(oppdatertBarn)),
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
        barn.andreForelder?.kanIkkeGiOpplysninger ||
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

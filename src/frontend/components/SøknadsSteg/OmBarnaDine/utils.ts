import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../../typer/person';
import { ISøknad } from '../../../typer/søknad';
import { IOmBarnaDineFeltTyper } from './useOmBarnaDine';

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
        const oppholderSegIInstitusjon = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemOppholderSegIInstitusjon
        );
        const oppholderSegIUtlandet = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemOppholderSegIUtland
        );

        const boddMindreEnn12MndINorge = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemTolvMndSammenhengendeINorge
        );

        const mottarBarnetrygdFraAnnetEøsland = genererSvarForSpørsmålBarn(
            barn,
            skjema.felter.hvemBarnetrygdFraAnnetEøsland
        );

        return {
            ...barn,
            [barnDataKeySpørsmål.erFosterbarn]: {
                ...barn[barnDataKeySpørsmål.erFosterbarn],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn),
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
            [barnDataKeySpørsmål.oppholderSegIUtland]: {
                ...barn[barnDataKeySpørsmål.oppholderSegIUtland],
                svar: oppholderSegIUtlandet,
            },
            [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
                ...barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland],
                svar: mottarBarnetrygdFraAnnetEøsland,
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
            [barnDataKeySpørsmål.oppholdsland]: {
                ...barn[barnDataKeySpørsmål.oppholdsland],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIUtlandet,
                    barn[barnDataKeySpørsmål.oppholdsland],
                    ''
                ),
            },
            [barnDataKeySpørsmål.oppholdslandStartdato]: {
                ...barn[barnDataKeySpørsmål.oppholdslandStartdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIUtlandet,
                    barn[barnDataKeySpørsmål.oppholdslandStartdato],
                    ''
                ),
            },
            [barnDataKeySpørsmål.oppholdslandSluttdato]: {
                ...barn[barnDataKeySpørsmål.oppholdslandSluttdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    oppholderSegIUtlandet,
                    barn[barnDataKeySpørsmål.oppholdslandSluttdato],
                    ''
                ),
            },
            [barnDataKeySpørsmål.nårKomBarnTilNorgeDato]: {
                ...barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    boddMindreEnn12MndINorge,
                    barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato],
                    ''
                ),
            },
            [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: {
                ...barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    boddMindreEnn12MndINorge,
                    barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
                    undefined
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
        };
    });
};

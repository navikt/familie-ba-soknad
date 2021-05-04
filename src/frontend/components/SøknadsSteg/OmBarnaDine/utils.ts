import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { barnDataKeySpørsmål, IBarn, IBarnMedISøknad } from '../../../typer/person';
import { ISøknad } from '../../../typer/søknad';
import { IOmBarnaDineFeltTyper } from './useOmBarnaDine';

export const genererSvarForSpørsmålBarn = (barn: IBarn, felt: Felt<string[]>): ESvar =>
    felt.verdi.includes(barn.ident) ? ESvar.JA : ESvar.NEI;

export const genererSvarForOppfølgningspørsmålBarn = (
    feltSpørsmåletErAvhengigAv: Felt<ESvar | undefined>,
    søknadsfelt
) => (feltSpørsmåletErAvhengigAv.verdi === ESvar.JA ? søknadsfelt.svar : '');

export const genererOppdaterteBarn = (
    søknad: ISøknad,
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>
): IBarnMedISøknad[] => {
    return søknad.barnInkludertISøknaden.map(barn => {
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
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemOppholderSegIInstitusjon),
            },
            [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: {
                ...barn[barnDataKeySpørsmål.boddMindreEnn12MndINorge],
                svar: genererSvarForSpørsmålBarn(
                    barn,
                    skjema.felter.hvemTolvMndSammenhengendeINorge
                ),
            },
            [barnDataKeySpørsmål.oppholderSegIUtland]: {
                ...barn[barnDataKeySpørsmål.oppholderSegIUtland],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemOppholderSegIUtland),
            },
            [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: {
                ...barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemBarnetrygdFraAnnetEøsland),
            },
            [barnDataKeySpørsmål.institusjonsnavn]: {
                ...barn[barnDataKeySpørsmål.institusjonsnavn],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonsnavn]
                ),
            },
            [barnDataKeySpørsmål.institusjonsadresse]: {
                ...barn[barnDataKeySpørsmål.institusjonsadresse],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonsadresse]
                ),
            },
            [barnDataKeySpørsmål.institusjonspostnummer]: {
                ...barn[barnDataKeySpørsmål.institusjonspostnummer],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonspostnummer]
                ),
            },
            [barnDataKeySpørsmål.institusjonOppholdStartdato]: {
                ...barn[barnDataKeySpørsmål.institusjonOppholdStartdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonOppholdStartdato]
                ),
            },
            [barnDataKeySpørsmål.institusjonOppholdSluttdato]: {
                ...barn[barnDataKeySpørsmål.institusjonOppholdSluttdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonOppholdSluttdato]
                ),
            },
            [barnDataKeySpørsmål.oppholdsland]: {
                ...barn[barnDataKeySpørsmål.oppholdsland],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIUtland,
                    barn[barnDataKeySpørsmål.oppholdsland]
                ),
            },
            [barnDataKeySpørsmål.oppholdslandStartdato]: {
                ...barn[barnDataKeySpørsmål.oppholdslandStartdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIUtland,
                    barn[barnDataKeySpørsmål.oppholdslandStartdato]
                ),
            },
            [barnDataKeySpørsmål.oppholdslandSluttdato]: {
                ...barn[barnDataKeySpørsmål.oppholdslandSluttdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIUtland,
                    barn[barnDataKeySpørsmål.oppholdslandSluttdato]
                ),
            },
            [barnDataKeySpørsmål.nårKomBarnTilNorgeDato]: {
                ...barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato],
                svar:
                    skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge.verdi === ESvar.NEI
                        ? barn[barnDataKeySpørsmål.nårKomBarnTilNorgeDato].svar
                        : '',
            },
            [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: {
                ...barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd],
                svar:
                    skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge.verdi === ESvar.NEI
                        ? barn[barnDataKeySpørsmål.planleggerÅBoINorge12Mnd].svar
                        : undefined,
            },
        };
    });
};

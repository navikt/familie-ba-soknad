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
            erFosterbarn: {
                ...barn[barnDataKeySpørsmål.erFosterbarn],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn),
            },
            erAsylsøker: {
                ...barn[barnDataKeySpørsmål.erAsylsøker],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErSøktAsylFor),
            },
            erAdoptertFraUtland: {
                ...barn[barnDataKeySpørsmål.erAdoptertFraUtland],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErAdoptertFraUtland),
            },
            oppholderSegIInstitusjon: {
                ...barn[barnDataKeySpørsmål.oppholderSegIInstitusjon],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemOppholderSegIInstitusjon),
            },
            oppholdtSegINorgeSammenhengendeTolvMnd: {
                ...barn[barnDataKeySpørsmål.oppholdtSegINorgeSammenhengendeTolvMnd],
                svar: genererSvarForSpørsmålBarn(
                    barn,
                    skjema.felter.hvemTolvMndSammenhengendeINorge
                ),
            },
            oppholderSegIUtland: {
                ...barn[barnDataKeySpørsmål.oppholderSegIUtland],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemOppholderSegIUtland),
            },
            barnetrygdFraAnnetEøsland: {
                ...barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland],
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemBarnetrygdFraAnnetEøsland),
            },
            institusjonsnavn: {
                ...barn[barnDataKeySpørsmål.institusjonsnavn],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonsnavn]
                ),
            },
            institusjonsadresse: {
                ...barn[barnDataKeySpørsmål.institusjonsadresse],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonsadresse]
                ),
            },
            institusjonspostnummer: {
                ...barn[barnDataKeySpørsmål.institusjonspostnummer],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonspostnummer]
                ),
            },
            institusjonOppholdStartdato: {
                ...barn[barnDataKeySpørsmål.institusjonOppholdStartdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonOppholdStartdato]
                ),
            },
            institusjonOppholdSluttdato: {
                ...barn[barnDataKeySpørsmål.institusjonOppholdSluttdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIInstitusjon,
                    barn[barnDataKeySpørsmål.institusjonOppholdSluttdato]
                ),
            },
            oppholdsland: {
                ...barn[barnDataKeySpørsmål.oppholdsland],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIUtland,
                    barn[barnDataKeySpørsmål.oppholdsland]
                ),
            },
            oppholdslandStartdato: {
                ...barn[barnDataKeySpørsmål.oppholdslandStartdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIUtland,
                    barn[barnDataKeySpørsmål.oppholdslandStartdato]
                ),
            },
            oppholdslandSluttdato: {
                ...barn[barnDataKeySpørsmål.oppholdslandSluttdato],
                svar: genererSvarForOppfølgningspørsmålBarn(
                    skjema.felter.oppholderBarnSegIUtland,
                    barn[barnDataKeySpørsmål.oppholdslandSluttdato]
                ),
            },
        };
    });
};

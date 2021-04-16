import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarn, IBarnMedISøknad } from '../../../typer/person';
import { ISøknad } from '../../../typer/søknad';
import { IOmBarnaDineFeltTyper } from './useOmBarnaDine';

export const genererSvarForSpørsmålBarn = (barn: IBarn, felt: Felt<string[]>): ESvar =>
    felt.verdi.includes(barn.ident) ? ESvar.JA : ESvar.NEI;

export const genererOppdaterteBarn = (
    søknad: ISøknad,
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>
): IBarnMedISøknad[] => {
    return søknad.barnInkludertISøknaden.map(barn => {
        return {
            ...barn,
            erFosterbarn: {
                ...barn.erFosterbarn,
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn),
            },
            erAsylsøker: {
                ...barn.erAsylsøker,
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErSøktAsylFor),
            },
            erAdoptertFraUtland: {
                ...barn.erAdoptertFraUtland,
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemErAdoptertFraUtland),
            },
            oppholderSegIInstitusjon: {
                ...barn.oppholderSegIInstitusjon,
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemOppholderSegIInstitusjon),
            },
            oppholdtSegINorgeSammenhengendeTolvMnd: {
                ...barn.oppholdtSegINorgeSammenhengendeTolvMnd,
                svar: genererSvarForSpørsmålBarn(
                    barn,
                    skjema.felter.hvemTolvMndSammenhengendeINorge
                ),
            },
            oppholderSegIUtland: {
                ...barn.oppholderSegIUtland,
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemOppholderSegIUtland),
            },
            barnetrygdFraAnnetEøsland: {
                ...barn.barnetrygdFraAnnetEøsland,
                svar: genererSvarForSpørsmålBarn(barn, skjema.felter.hvemBarnetrygdFraAnnetEøsland),
            },
        };
    });
};

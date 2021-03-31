import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IBarn } from '../../../typer/person';
import { ISøknad } from '../../../typer/søknad';
import { BarnetsIdent } from './HvilkeBarnCheckboxGruppe';
import { IOmBarnaDineFeltTyper } from './useOmBarnaDine';

export type JaNeiSpmOgCheckboxPar = {
    jaNeiSpm: Felt<ESvar | undefined>;
    checkbox: Felt<BarnetsIdent[]>;
}[];

export const hentFiltrerteAvhengigheter = (jaNeiSpmOgCheckboxPar: JaNeiSpmOgCheckboxPar) => {
    let avhengigheter = {};

    jaNeiSpmOgCheckboxPar.forEach(par => {
        if (par.jaNeiSpm.verdi === ESvar.JA) {
            avhengigheter = {
                ...avhengigheter,
                [par.checkbox.id]: par.checkbox,
            };
        } else {
            avhengigheter = {
                ...avhengigheter,
                [par.jaNeiSpm.id]: par.jaNeiSpm,
            };
        }
    });
    return avhengigheter;
};

export const genererSvarForSpørsmålBarn = (barn: IBarn, felt: Felt<string[]>): ESvar =>
    felt.verdi.includes(barn.ident) ? ESvar.JA : ESvar.NEI;

export const genererOppdaterteBarn = (
    søknad: ISøknad,
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>
): IBarn[] => {
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

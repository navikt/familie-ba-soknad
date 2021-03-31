import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

export const hentTilfeldigElement = (array: string[]): string => {
    return array[Math.floor(Math.random() * array.length)];
};

export type SpørsmålPar = {
    jaNeiSpm: Felt<ESvar | undefined>;
    // eslint-disable-next-line
    tilhørendeFelter?: { [key: string]: Felt<any> };
};

export const hentFiltrerteAvhengigheter = (spørsmålPar: SpørsmålPar[], svarCondition: ESvar) => {
    let avhengigheter = {};

    spørsmålPar.forEach(par => {
        if (par.tilhørendeFelter && par.jaNeiSpm.verdi === svarCondition) {
            Object.values(par.tilhørendeFelter).forEach(felt => {
                avhengigheter = {
                    ...avhengigheter,
                    [felt.id]: felt,
                };
            });
        } else {
            avhengigheter = {
                ...avhengigheter,
                [par.jaNeiSpm.id]: par.jaNeiSpm,
            };
        }
    });
    return avhengigheter;
};

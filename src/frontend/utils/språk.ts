import { Årsak } from '../typer/søknad';

export const toÅrsakSpråkId = (årsak: Årsak): string => {
    switch (årsak) {
        case Årsak.SEPARERT:
            return 'omdeg.velgårsak.separert';
        case Årsak.SKILT:
            return 'omdeg.velgårsak.skilt';
        case Årsak.BRUDD_SAMBOER:
            return 'omdeg.velgårsak.bruddsamboer';
        case Årsak.BODD_ALENE:
            return 'omdeg.velgårsak.boddalene';
        case Årsak.ENKE_ENKEMANN:
            return 'omdeg.velgårsak.enkeenkemann';
        case Årsak.FENGSEL_VARETEKT:
            return 'omdeg.velgårsak.fengselvaretekt';
        case Årsak.BRUDD_GIFT:
            return 'omdeg.velgårsak.bruddgift';
    }
};

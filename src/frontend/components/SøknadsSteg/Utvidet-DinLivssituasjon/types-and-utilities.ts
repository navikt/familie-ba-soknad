export enum Årsak {
    SEPARERT = 'SEPARERT',
    SKILT = 'SKILT',
    BRUDD_SAMBOER = 'BRUDD_SAMBOER',
    BODD_ALENE = 'BODD_ALENE',
    ENKE_ENKEMANN = 'ENKE_ENKEMANN',
    FENGSEL_VARETEKT = 'FENGSEL_VARETEKT',
    BRUDD_GIFT = 'BRUDD_GIFT',
}

export const muligeÅrsaker: Årsak[] = [
    Årsak.SEPARERT,
    Årsak.SKILT,
    Årsak.BRUDD_SAMBOER,
    Årsak.BODD_ALENE,
    Årsak.ENKE_ENKEMANN,
    Årsak.FENGSEL_VARETEKT,
    Årsak.BRUDD_GIFT,
];

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

export enum Årsak {
    SEPARERT = 'omdeg.velgårsak.separert',
    SKILT = 'omdeg.velgårsak.skilt',
    BRUDD_SAMBOER = 'omdeg.velgårsak.bruddsamboer',
    BODD_ALENE = 'omdeg.velgårsak.boddalene',
    ENKE_ENKEMANN = 'omdeg.velgårsak.enkeenkemann',
    FENGSEL_VARETEKT = 'omdeg.velgårsak.fengselvaretekt',
    BURDD_GIFT = 'omdeg.velgårsak.burddgift',
}

export const muligeÅrsaker: Årsak[] = [
    Årsak.SEPARERT,
    Årsak.SKILT,
    Årsak.BRUDD_SAMBOER,
    Årsak.BODD_ALENE,
    Årsak.ENKE_ENKEMANN,
    Årsak.FENGSEL_VARETEKT,
    Årsak.BURDD_GIFT,
];

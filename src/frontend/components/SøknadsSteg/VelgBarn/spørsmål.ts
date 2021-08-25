export enum VelgBarnSpørsmålId {
    velgBarn = 'velg-barn',
    barnetsNavn = 'barnets-navn',
}

export const velgBarnSpørsmålSpråkId: Record<VelgBarnSpørsmålId, string> = {
    [VelgBarnSpørsmålId.velgBarn]: 'hvilkebarn.sidetittel',
    [VelgBarnSpørsmålId.barnetsNavn]: 'hvilkebarn.leggtilbarn.barnets-navn',
};

export enum DinLivssituasjonSpørsmålId {
    årsak = 'årsak',
    separertEnkeSkilt = 'separert-enke-skilt',
}

export const dinLivssituasjonSpørsmålSpråkId: Record<DinLivssituasjonSpørsmålId, string> = {
    [DinLivssituasjonSpørsmålId.årsak]: 'omdeg.hvorforsøkerutvidet.spm',
    [DinLivssituasjonSpørsmålId.separertEnkeSkilt]: 'omdeg.separertellerskilt.spm',
};

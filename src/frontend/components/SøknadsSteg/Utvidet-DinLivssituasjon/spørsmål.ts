export enum DinLivssituasjonSpørsmålId {
    årsak = 'årsak',
    separertEnkeSkilt = 'separert-enke-skilt',
    separertEnkeSkiltUtland = 'separert-enke-skilt-utland',
    separertEnkeSkiltDato = 'separert-enke-skilt-dato',
    harSamboerNå = 'har-samboer-nå',
    hattAnnenSamboerForSøktPeriode = 'hatt-annen-samboer-i-perioden',
    hattFlereSamboereForSøktPeriode = 'hatt-flere-samboere-i-perioden',
}

export const dinLivssituasjonSpørsmålSpråkId: Record<DinLivssituasjonSpørsmålId, string> = {
    [DinLivssituasjonSpørsmålId.årsak]: 'omdeg.hvorforsøkerutvidet.spm',
    [DinLivssituasjonSpørsmålId.separertEnkeSkilt]: 'omdeg.separertellerskilt.spm',
    [DinLivssituasjonSpørsmålId.separertEnkeSkiltUtland]: 'omdeg.separertskiltiutlandet.spm',
    [DinLivssituasjonSpørsmålId.separertEnkeSkiltDato]: 'omdeg.frahvilkendatoseparertskilt.spm',
    [DinLivssituasjonSpørsmålId.harSamboerNå]: 'omdeg.samboernå.spm',
    [DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode]: 'omdeg.annensamboer.spm',
    [DinLivssituasjonSpørsmålId.hattFlereSamboereForSøktPeriode]: 'omdeg.leggtilfleresamboere.spm',
};

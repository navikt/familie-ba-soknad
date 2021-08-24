export enum DinLivssituasjonSpørsmålId {
    årsak = 'årsak',
    separertEnkeSkilt = 'separert-enke-skilt',
    separertEnkeSkiltUtland = 'separert-enke-skilt-utland',
    separertEnkeSkiltDato = 'separert-enke-skilt-dato',
    harSamboerNå = 'har-samboer-nå',
    hattAnnenSamboerForSøktPeriode = 'hatt-annen-samboer-i-perioden',
}

export const dinLivssituasjonSpørsmålSpråkId: Record<DinLivssituasjonSpørsmålId, string> = {
    [DinLivssituasjonSpørsmålId.årsak]: 'omdeg.hvorforsøkerutvidet.spm',
    [DinLivssituasjonSpørsmålId.separertEnkeSkilt]: 'omdeg.separertellerskilt.spm',
    [DinLivssituasjonSpørsmålId.separertEnkeSkiltUtland]: 'omdeg.separertskiltiutlandet.spm',
    [DinLivssituasjonSpørsmålId.separertEnkeSkiltDato]: 'omdeg.frahvilkendatoseparertskilt.spm',
    [DinLivssituasjonSpørsmålId.harSamboerNå]: 'omdeg.samboernå.spm',
    [DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode]: 'omdeg.annensamboer.spm',
};

export enum SamboerSpørsmålId {
    nåværendeSamboerNavn = 'utvidet-nåværende-samboer-navn',
    nåværendeSamboerFnr = 'utvidet-nåværende-samboer-fnr',
    nåværendeSamboerFnrUkjent = 'utvidet-nåværende-samboer-fnrUkjent',
    nåværendeSamboerFødselsdato = 'utvidet-nåværende-samboer-fødselsdato',
    nåværendeSamboerFødselsdatoUkjent = 'utvidet-nåværende-samboer-fødselsdatoUkjent',
    nåværendeSamboerFraDato = 'utvidet-nåværende-samboer-samboerFraDato',
}

export const samboerSpørsmålSpråkId: Record<SamboerSpørsmålId, string> = {
    [SamboerSpørsmålId.nåværendeSamboerNavn]: 'felles.samboernavn.spm',
    [SamboerSpørsmålId.nåværendeSamboerFnr]: 'felles.fødsels-eller-dnummer.label',
    [SamboerSpørsmålId.nåværendeSamboerFnrUkjent]: 'omdeg.nåværendeSamboer.ident.ukjent',
    [SamboerSpørsmålId.nåværendeSamboerFødselsdato]: 'felles.fødselsdato.label',
    [SamboerSpørsmålId.nåværendeSamboerFødselsdatoUkjent]: 'felles.fødselsdato-ukjent',
    [SamboerSpørsmålId.nåværendeSamboerFraDato]: 'omdeg.nårstartetsamboerforhold.spm',
};

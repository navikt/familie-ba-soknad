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
    navn = 'utvidet-nåværende-samboer-navn',
    fnr = 'utvidet-nåværende-samboer-ident',
    fnrUkjent = 'utvidet-nåværende-samboer-identUkjent',
    fødselsdato = 'utvidet-nåværende-samboer-fødselsdato',
    fødselsdatoUkjent = 'utvidet-nåværende-samboer-fødselsdatoUkjent',
    samboerFraDato = 'utvidet-nåværende-samboer-samboerFraDato',
}

export const samboerSpørsmålSpråkId: Record<SamboerSpørsmålId, string> = {
    [SamboerSpørsmålId.navn]: 'felles.samboernavn.spm',
    [SamboerSpørsmålId.fnr]: 'felles.fødsels-eller-dnummer.label',
    [SamboerSpørsmålId.fnrUkjent]: 'omdeg.nåværendeSamboer.ident.ukjent',
    [SamboerSpørsmålId.fødselsdato]: 'felles.fødselsdato.label',
    [SamboerSpørsmålId.fødselsdatoUkjent]: 'felles.fødselsdato-ukjent',
    [SamboerSpørsmålId.samboerFraDato]: 'omdeg.nårstartetsamboerforhold.spm',
};

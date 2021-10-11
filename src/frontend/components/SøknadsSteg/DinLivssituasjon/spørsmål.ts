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

export const samboerSpråkIder = {
    navn: 'felles.samboernavn.spm',
    fnr: 'felles.fødsels-eller-dnummer.label',
    fnrUkjent: 'omdeg.nåværendeSamboer.ident.ukjent',
    fødselsdato: 'felles.fødselsdato.label',
    fødselsdatoUkjent: 'felles.fødselsdato-ukjent',
    samboerFraDato: 'omdeg.nårstartetsamboerforhold.spm',
    samboerTilDato: 'omdeg.nårsamboerforholdavsluttet.spm',
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
    [SamboerSpørsmålId.nåværendeSamboerNavn]: samboerSpråkIder.navn,
    [SamboerSpørsmålId.nåværendeSamboerFnr]: samboerSpråkIder.fnr,
    [SamboerSpørsmålId.nåværendeSamboerFnrUkjent]: samboerSpråkIder.fnrUkjent,
    [SamboerSpørsmålId.nåværendeSamboerFødselsdato]: samboerSpråkIder.fødselsdato,
    [SamboerSpørsmålId.nåværendeSamboerFødselsdatoUkjent]: samboerSpråkIder.fødselsdatoUkjent,
    [SamboerSpørsmålId.nåværendeSamboerFraDato]: samboerSpråkIder.samboerFraDato,
};

export enum TidligereSamboerSpørsmålId {
    tidligereSamboerNavn = 'utvidet-tidligere-samboer-navn',
    tidligereSamboerFnr = 'utvidet-tidligere-samboer-fnr',
    tidligereSamboerFnrUkjent = 'utvidet-tidligere-samboer-fnrUkjent',
    tidligereSamboerFødselsdato = 'utvidet-tidligere-samboer-fødselsdato',
    tidligereSamboerFødselsdatoUkjent = 'utvidet-tidligere-samboer-fødselsdatoUkjent',
    tidligereSamboerFraDato = 'utvidet-tidligere-samboer-samboerFraDato',
    tidligereSamboerTilDato = 'utvidet-tidligere-samboer-samboerTilDato',
}

export const tidligereSamboerSpørsmålSpråkId: Record<TidligereSamboerSpørsmålId, string> = {
    [TidligereSamboerSpørsmålId.tidligereSamboerNavn]: samboerSpråkIder.navn,
    [TidligereSamboerSpørsmålId.tidligereSamboerFnr]: samboerSpråkIder.fnr,
    [TidligereSamboerSpørsmålId.tidligereSamboerFnrUkjent]: samboerSpråkIder.fnrUkjent,
    [TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato]: samboerSpråkIder.fødselsdato,
    [TidligereSamboerSpørsmålId.tidligereSamboerFødselsdatoUkjent]:
        samboerSpråkIder.fødselsdatoUkjent,
    [TidligereSamboerSpørsmålId.tidligereSamboerFraDato]: samboerSpråkIder.samboerFraDato,
    [TidligereSamboerSpørsmålId.tidligereSamboerTilDato]: samboerSpråkIder.samboerTilDato,
};

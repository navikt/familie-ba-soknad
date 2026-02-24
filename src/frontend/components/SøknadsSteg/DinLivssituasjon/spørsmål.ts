export enum DinLivssituasjonSpørsmålId {
    årsak = 'årsak',
    separertEnkeSkilt = 'separert-enke-skilt',
    separertEnkeSkiltUtland = 'separert-enke-skilt-utland',
    separertEnkeSkiltDato = 'separert-enke-skilt-dato',
    harSamboerNå = 'har-samboer-nå',
    harSamboerNåGift = 'har-samboer-nå-og-gift',
    hattAnnenSamboerForSøktPeriode = 'hatt-annen-samboer-i-perioden',
    erAsylsøker = 'er-asylsøker',
    arbeidIUtlandet = 'arbeid-i-utlandet',
    mottarUtenlandspensjon = 'mottar-utenlandspensjon',
}

export enum SamboerSpørsmålId {
    nåværendeSamboerNavn = 'utvidet-nåværende-samboer-navn',
    nåværendeSamboerFnr = 'utvidet-nåværende-samboer-fnr',
    nåværendeSamboerFnrUkjent = 'utvidet-nåværende-samboer-fnrUkjent',
    nåværendeSamboerFødselsdato = 'utvidet-nåværende-samboer-fødselsdato',
    nåværendeSamboerFødselsdatoUkjent = 'utvidet-nåværende-samboer-fødselsdatoUkjent',
    nåværendeSamboerFraDato = 'utvidet-nåværende-samboer-samboerFraDato',
}

export enum TidligereSamboerSpørsmålId {
    tidligereSamboerNavn = 'utvidet-tidligere-samboer-navn',
    tidligereSamboerFnr = 'utvidet-tidligere-samboer-fnr',
    tidligereSamboerFnrUkjent = 'utvidet-tidligere-samboer-fnrUkjent',
    tidligereSamboerFødselsdato = 'utvidet-tidligere-samboer-fødselsdato',
    tidligereSamboerFødselsdatoUkjent = 'utvidet-tidligere-samboer-fødselsdatoUkjent',
    tidligereSamboerFraDato = 'utvidet-tidligere-samboer-samboerFraDato',
    tidligereSamboerTilDato = 'utvidet-tidligere-samboer-samboerTilDato',
}

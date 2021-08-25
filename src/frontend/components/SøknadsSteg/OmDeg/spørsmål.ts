export const omDegPersonopplysningerSpråkId = {
    søkerStatsborgerskap: 'omdeg.personopplysninger.statsborgerskap',
    søkerSivilstatus: 'omdeg.personopplysninger.sivilstatus',
    søkerAdresse: 'omdeg.personopplysninger.adresse',
};

export enum OmDegSpørsmålId {
    borPåRegistrertAdresse = 'bor-på-registrert-adresse',
    oppholderSegINorge = 'søker-oppholder-seg-i-norge',
    søkerOppholdsland = 'søker-oppholdsland',
    oppholdslandDato = 'søker-oppholdsland-dato',
    værtINorgeITolvMåneder = 'søker-vært-i-norge-sammenhengende-tolv-måneder',
    komTilNorgeDato = 'søker-kom-til-norge-dato',
    planleggerÅBoINorgeTolvMnd = 'søker-planlegger-å-bo-i-norge-sammenhengende-tolv-måneder',
    erAsylsøker = 'er-asylsøker',
    jobberPåBåt = 'jobber-på-båt',
    arbeidsland = 'arbeidsland',
    mottarUtenlandspensjon = 'mottar-utenlandspensjon',
    pensjonsland = 'pensjonsland',
}

export const omDegSpørsmålSpråkId: Record<OmDegSpørsmålId, string> = {
    [OmDegSpørsmålId.borPåRegistrertAdresse]: 'omdeg.borpådenneadressen.spm',
    [OmDegSpørsmålId.oppholderSegINorge]: 'omdeg.opphold-i-norge.spm',
    [OmDegSpørsmålId.søkerOppholdsland]: 'omdeg.opphold-i-norge.land.spm',
    [OmDegSpørsmålId.oppholdslandDato]: 'omdeg.opphold-i-norge.dato.spm',
    [OmDegSpørsmålId.værtINorgeITolvMåneder]: 'omdeg.opphold-sammenhengende.spm',
    [OmDegSpørsmålId.komTilNorgeDato]: 'omdeg.opphold-sammenhengende.dato.spm',
    [OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]: 'omdeg.planlagt-opphold-sammenhengende.spm',
    [OmDegSpørsmålId.erAsylsøker]: 'omdeg.asylsøker.spm',
    [OmDegSpørsmålId.jobberPåBåt]: 'omdeg.arbeid-utland.spm',
    [OmDegSpørsmålId.arbeidsland]: 'omdeg.arbeid-utland.land.spm',
    [OmDegSpørsmålId.mottarUtenlandspensjon]: 'omdeg.utenlandspensjon.spm',
    [OmDegSpørsmålId.pensjonsland]: 'omdeg.utenlandspensjon.land.spm',
};

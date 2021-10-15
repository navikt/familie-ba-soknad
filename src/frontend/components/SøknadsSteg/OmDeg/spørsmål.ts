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
    komTilNorgeDatoVetIkke = 'søker-ikke-ankommet-norge',
    reistFraNorgeDato = 'søker-reiste-fra-norge-dato',
    reistFraNorgeDatoVetIkke = 'søker-ikke-reist-fra-norge-dato',
    planleggerÅBoINorgeTolvMnd = 'søker-planlegger-å-bo-i-norge-sammenhengende-tolv-måneder',
}

export const omDegSpørsmålSpråkId: Record<OmDegSpørsmålId, string> = {
    [OmDegSpørsmålId.borPåRegistrertAdresse]: 'omdeg.borpådenneadressen.spm',
    [OmDegSpørsmålId.oppholderSegINorge]: 'omdeg.opphold-i-norge.spm',
    [OmDegSpørsmålId.søkerOppholdsland]: 'omdeg.opphold-i-norge.land.spm',
    [OmDegSpørsmålId.oppholdslandDato]: 'omdeg.opphold-i-norge.dato.spm',
    [OmDegSpørsmålId.værtINorgeITolvMåneder]: 'omdeg.opphold-sammenhengende.spm',
    [OmDegSpørsmålId.komTilNorgeDato]: 'omdeg.opphold-sammenhengende.dato.spm',
    [OmDegSpørsmålId.komTilNorgeDatoVetIkke]: 'omdeg.opphold-sammenhengende.dato.sjekkboks',
    [OmDegSpørsmålId.reistFraNorgeDato]: 'omdeg.opphold-sammenhengende.datoreist.spm',
    [OmDegSpørsmålId.reistFraNorgeDatoVetIkke]: 'omdeg.opphold-sammenhengende.datoreist.sjekkboks',
    [OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]: 'omdeg.planlagt-opphold-sammenhengende.spm',
};

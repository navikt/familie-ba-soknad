export const omDegPersonopplysningerSpråkId = {
    søkerStatsborgerskap: 'omdeg.personopplysninger.statsborgerskap',
    søkerSivilstatus: 'omdeg.personopplysninger.sivilstatus',
    søkerAdresse: 'omdeg.personopplysninger.adresse',
};

export enum OmDegSpørsmålId {
    borPåRegistrertAdresse = 'bor-på-registrert-adresse',
    værtINorgeITolvMåneder = 'søker-vært-i-norge-sammenhengende-tolv-måneder',
    komTilNorgeDato = 'søker-kom-til-norge-dato',
    planleggerÅBoINorgeTolvMnd = 'søker-planlegger-å-bo-i-norge-sammenhengende-tolv-måneder',
    registrertMedUtenlandsperiode = 'søker-registert-med-utenlandsperiode',
}

export const omDegSpørsmålSpråkId: Record<OmDegSpørsmålId, string> = {
    [OmDegSpørsmålId.borPåRegistrertAdresse]: 'omdeg.borpådenneadressen.spm',
    [OmDegSpørsmålId.værtINorgeITolvMåneder]: 'omdeg.oppholdtsammenhengende.spm',
    [OmDegSpørsmålId.komTilNorgeDato]: 'omdeg.opphold-sammenhengende.dato.spm',
    [OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]: 'omdeg.planlagt-opphold-sammenhengende.spm',
    [OmDegSpørsmålId.registrertMedUtenlandsperiode]: 'felles.leggtilutenlands.knapp',
};

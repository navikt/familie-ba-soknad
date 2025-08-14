export const omDegPersonopplysningerSpråkId = {
    søkerStatsborgerskap: 'omdeg.personopplysninger.statsborgerskap',
    søkerSivilstatus: 'omdeg.personopplysninger.sivilstatus',
    søkerAdresse: 'omdeg.personopplysninger.adresse',
};

export enum OmDegSpørsmålId {
    borPåRegistrertAdresse = 'bor-på-registrert-adresse',
    borPåSvalbard = 'bor-på-svalbard',
    værtINorgeITolvMåneder = 'søker-vært-i-norge-sammenhengende-tolv-måneder',
    planleggerÅBoINorgeTolvMnd = 'søker-planlegger-å-bo-i-norge-sammenhengende-tolv-måneder',
}

export const omDegSpørsmålSpråkId: Record<OmDegSpørsmålId, string> = {
    [OmDegSpørsmålId.borPåRegistrertAdresse]: 'omdeg.borpådenneadressen.spm',
    [OmDegSpørsmålId.borPåSvalbard]: 'omdeg.borpåsvalbard.spm',
    [OmDegSpørsmålId.værtINorgeITolvMåneder]: 'omdeg.oppholdtsammenhengende.spm',
    [OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd]: 'omdeg.planlagt-opphold-sammenhengende.spm',
};

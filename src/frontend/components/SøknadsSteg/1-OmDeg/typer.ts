export enum OmDegSpørsmålId {
    'borPåRegistrertAdresse' = 'bor-på-registrert-adresse',
    'telefonnummer' = 'telefonnummer',
    'oppholderSegINorge' = 'oppholder-seg-i-norge',
    'oppholdsland' = 'oppholdsland',
    'værtINorgeITolvMåneder' = 'vært-i-norge-i-tolv-måneder',
    'erAsylsøker' = 'er-asylsøker',
    'jobberPåBåt' = 'jobber-på-båt',
    'arbeidsland' = 'arbeidsland',
    'mottarUtenlandspensjon' = 'mottar-utenlandspensjon',
    'pensjonsland' = 'pensjonsland',
}

export const omDegSpråkTekstId: Record<OmDegSpørsmålId, string> = {
    [OmDegSpørsmålId.borPåRegistrertAdresse]: 'personopplysninger.spm.riktigAdresse',
    [OmDegSpørsmålId.oppholderSegINorge]: 'omdeg.spm.oppholderSegINorge',
    [OmDegSpørsmålId.oppholdsland]: 'omdeg.spm.landopphold',
    [OmDegSpørsmålId.telefonnummer]: 'personopplysninger.spm.telefonnr',
    [OmDegSpørsmålId.værtINorgeITolvMåneder]: 'omdeg.spm.vært-i-tolv-måneder',
    [OmDegSpørsmålId.erAsylsøker]: 'omdeg.spm.erasylsøker',
    [OmDegSpørsmålId.jobberPåBåt]: 'omdeg.spm.jobberpåbåt',
    [OmDegSpørsmålId.arbeidsland]: 'omdeg.spm.hvilket-arbeidsland',
    [OmDegSpørsmålId.mottarUtenlandspensjon]: 'omdeg.spm.mottar-du-pensjon-fra-utland',
    [OmDegSpørsmålId.pensjonsland]: 'omdeg.spm.hvilket-pensjonsland',
};

export enum SpørsmålIdOmDeg {
    'borPåRegistrertAdresse' = 'bor-på-registrert-adresse',
    'oppholderSegINorge' = 'oppholder-seg-i-norge',
    'oppholdsland' = 'oppholdsland',
    'telefonnummer' = 'telefonnummer',
    'værtINorgeITolvMåneder' = 'vært-i-norge-i-tolv-måneder',
    'asylsøker' = 'asylsøker',
    'jobberPåBåt' = 'jobber-på-båt',
    'arbeidsland' = 'arbeidsland',
    'mottarUtlandspensjon' = 'mottar-utlandspensjon',
    'pensjonsland' = 'pensjonsland',
}

export const omDegSpråkTekstId: Record<SpørsmålIdOmDeg, string> = {
    [SpørsmålIdOmDeg.borPåRegistrertAdresse]: 'personopplysninger.spm.riktigAdresse',
    [SpørsmålIdOmDeg.oppholderSegINorge]: 'omdeg.spm.oppholderSegINorge',
    [SpørsmålIdOmDeg.oppholdsland]: 'omdeg.spm.landopphold',
    [SpørsmålIdOmDeg.telefonnummer]: 'personopplysninger.telefonnr',
    [SpørsmålIdOmDeg.værtINorgeITolvMåneder]: 'omdeg.spm.vært-i-tolv-måneder',
    [SpørsmålIdOmDeg.asylsøker]: 'omdeg.spm.erasylsøker',
    [SpørsmålIdOmDeg.jobberPåBåt]: 'omdeg.spm.jobberpåbåt',
    [SpørsmålIdOmDeg.arbeidsland]: 'omdeg.spm.hvilket-arbeidsland',
    [SpørsmålIdOmDeg.mottarUtlandspensjon]: 'omdeg.spm.mottar-du-pensjon-fra-utland',
    [SpørsmålIdOmDeg.pensjonsland]: 'omdeg.spm.hvilket-pensjonsland',
};

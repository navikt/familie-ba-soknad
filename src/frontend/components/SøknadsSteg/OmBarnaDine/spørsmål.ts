export enum OmBarnaDineSpørsmålId {
    erNoenAvBarnaFosterbarn = 'er-noen-av-barna-fosterbarn',
    hvemErFosterbarn = 'hvem-er-fosterbarn',
    oppholderBarnSegIInstitusjon = 'oppholder-barn-seg-i-institusjon',
    hvemOppholderSegIInstitusjon = 'hvem-oppholder-seg-i-institusjon',
    erBarnAdoptertFraUtland = 'er-barn-adoptert-fra-utland',
    hvemErAdoptertFraUtland = 'hvem-er-adoptert-fra-utland',
    oppholderBarnSegIUtland = 'oppholder-barn-seg-i-utland',
    hvemOppholderSegIUtland = 'hvem-oppholder-seg-i-utland',
    søktAsylForBarn = 'søkt-asyl-for-barn',
    hvemErSøktAsylFor = 'hvem-er-søkt-asyl-for',
    barnOppholdtSegTolvMndSammenhengendeINorge = 'tolv-mnd-sammenhengende-i-norge',
    hvemTolvMndSammenhengendeINorge = 'hvem-tolv-mnd-sammenhengende-i-norge',
    mottarBarnetrygdForBarnFraAnnetEøsland = 'barnetrygd-fra-annet-eøsland',
    hvemBarnetrygdFraAnnetEøsland = 'hvem-mottar-barnetrygd-eøsland',
}

export const omBarnaDineSpørsmålSpråkId: Record<OmBarnaDineSpørsmålId, string> = {
    [OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn]: 'ombarna.fosterbarn.spm',
    [OmBarnaDineSpørsmålId.hvemErFosterbarn]: 'ombarna.fosterbarn.hvem.spm',
    [OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon]: 'ombarna.institusjon.spm',
    [OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon]: 'ombarna.institusjon.hvem.spm',
    [OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland]: 'ombarna.adoptert.spm',
    [OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland]: 'ombarna.adoptert.hvem.spm',
    [OmBarnaDineSpørsmålId.oppholderBarnSegIUtland]: 'ombarna.opphold-utland.spm',
    [OmBarnaDineSpørsmålId.hvemOppholderSegIUtland]: 'ombarna.opphold-utland.hvem.spm',
    [OmBarnaDineSpørsmålId.søktAsylForBarn]: 'ombarna.asyl.spm',
    [OmBarnaDineSpørsmålId.hvemErSøktAsylFor]: 'ombarna.asyl.hvem.spm',
    [OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge]:
        'ombarna.sammenhengende-opphold.spm',
    [OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge]:
        'ombarna.sammenhengende-opphold.hvem.spm',
    [OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland]: 'ombarna.barnetrygd-eøs.spm',
    [OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland]: 'ombarna.barnetrygd-eøs.hvem.spm',
};

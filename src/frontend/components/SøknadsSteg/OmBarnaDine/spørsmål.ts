export enum OmBarnaDineSpørsmålId {
    'erNoenAvBarnaFosterbarn' = 'er-noen-av-barna-fosterbarn',
    'hvemErFosterbarn' = 'hvem-er-fosterbarn',
    'oppholderBarnSegIInstitusjon' = 'oppholder-barn-seg-i-institusjon',
    'hvemOppholderSegIInstitusjon' = 'hvem-oppholder-seg-i-institusjon',
    'erBarnAdoptertFraUtland' = 'er-barn-adoptert-fra-utland',
    'hvemErAdoptertFraUtland' = 'hvem-er-adoptert-fra-utland',
    'oppholderBarnSegIUtland' = 'oppholder-barn-seg-i-utland',
    'hvemOppholderSegIUtland' = 'hvem-oppholder-seg-i-utland',
    'søktAsylForBarn' = 'søkt-asyl-for-barn',
    'hvemErSøktAsylFor' = 'hvem-er-søkt-asyl-for',
    'barnOppholdtSegTolvMndSammenhengendeINorge' = 'tolv-mnd-sammenhengende-i-norge',
    'hvemTolvMndSammenhengendeINorge' = 'hvem-tolv-mnd-sammenhengende-i-norge',
    'mottarBarnetrygdFraAnnetEøsland' = 'barnetrygd-fra-annet-eøsland',
    'hvemBarnetrygdFraAnnetEøsland' = 'hvem-mottar-barnetrygd-eøsland',
}

export const omBarnaDineSpråkTekstId: Record<OmBarnaDineSpørsmålId, string> = {
    [OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn]: 'ombarnadine.spm.er-barn-fosterbarn',
    [OmBarnaDineSpørsmålId.hvemErFosterbarn]: 'ombarnadine.spm.hvem-er-fosterbarn',
    [OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon]:
        'ombarnadine.spm.oppholder-barn-seg-i-institusjon',
    [OmBarnaDineSpørsmålId.hvemOppholderSegIInstitusjon]:
        'ombarnadine.spm.hvem-oppholder-seg-i-institusjon',
    [OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland]: 'ombarnadine.spm.er-barn-adoptert-fra-utland',
    [OmBarnaDineSpørsmålId.hvemErAdoptertFraUtland]: 'ombarnadine.spm.hvem-er-adoptert-fra-utland',
    [OmBarnaDineSpørsmålId.oppholderBarnSegIUtland]: 'ombarnadine.spm.oppholder-barn-seg-i-utland',
    [OmBarnaDineSpørsmålId.hvemOppholderSegIUtland]: 'ombarnadine.spm.hvem-oppholder-seg-i-utland',
    [OmBarnaDineSpørsmålId.søktAsylForBarn]: 'ombarnadine.spm.søkt-asyl-for-barn',
    [OmBarnaDineSpørsmålId.hvemErSøktAsylFor]: 'ombarnadine.spm.hvem-er-søkt-asyl-for',
    [OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge]:
        'ombarnadine.spm.tolv-mnd-sammenhengende-i-norge',
    [OmBarnaDineSpørsmålId.hvemTolvMndSammenhengendeINorge]:
        'ombarnadine.spm.hvem-tolv-mnd-sammenhengende-i-norge',
    [OmBarnaDineSpørsmålId.mottarBarnetrygdFraAnnetEøsland]:
        'ombarnadine.spm.barnetrygd-fra-annet-eøsland',
    [OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland]:
        'ombarnadine.spm.hvem-mottar-barnetrygd-eøsland',
};

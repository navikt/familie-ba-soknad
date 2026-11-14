export enum Scenario {
    ORDINÆR = 'ORDINÆR',
    UTVIDET = 'UTVIDET',
    EØS_SØKER = 'EØS_SØKER',
    EØS_BARN = 'EØS_BARN',
    EØS_ANDRE_FORELDER = 'EØS_ANDRE_FORELDER',
}

export const scenarioNavn: Record<Scenario, string> = {
    [Scenario.ORDINÆR]: 'Happy case – ordinær barnetrygd',
    [Scenario.UTVIDET]: 'Utvidet barnetrygd',
    [Scenario.EØS_SØKER]: 'EØS – søker arbeider i et EØS-land',
    [Scenario.EØS_BARN]: 'EØS – barna får barnetrygd fra et EØS-land',
    [Scenario.EØS_ANDRE_FORELDER]: 'EØS – den andre forelderen arbeider i et EØS-land',
};

export enum Avvik {
    DELT_BOSTED = 'DELT_BOSTED',
    BOR_IKKE_FAST_MED_SØKER = 'BOR_IKKE_FAST_MED_SØKER',
    SØKER_ER_ASYLSØKER = 'SØKER_ER_ASYLSØKER',
    BARNA_ER_ASYLSØKERE = 'BARNA_ER_ASYLSØKERE',
    ADOPTERT_FRA_UTLANDET = 'ADOPTERT_FRA_UTLANDET',
    FOSTERBARN = 'FOSTERBARN',
    INSTITUSJON = 'INSTITUSJON',
    SØKER_UTENFOR_NORGE = 'SØKER_UTENFOR_NORGE',
    BARNA_UTENFOR_NORGE = 'BARNA_UTENFOR_NORGE',
}

export const avvikNavn: Record<Avvik, string> = {
    [Avvik.DELT_BOSTED]: 'Skriftlig avtale om delt bosted',
    [Avvik.BOR_IKKE_FAST_MED_SØKER]: 'Barna bor ikke fast sammen med søker',
    [Avvik.SØKER_ER_ASYLSØKER]: 'Søker er asylsøker',
    [Avvik.BARNA_ER_ASYLSØKERE]: 'Det er søkt om asyl for barna',
    [Avvik.ADOPTERT_FRA_UTLANDET]: 'Barna er adoptert fra utlandet',
    [Avvik.FOSTERBARN]: 'Barna er fosterbarn',
    [Avvik.INSTITUSJON]: 'Barna bor i institusjon',
    [Avvik.SØKER_UTENFOR_NORGE]: 'Søker har oppholdt seg utenfor Norge de siste 12 månedene',
    [Avvik.BARNA_UTENFOR_NORGE]: 'Barna har oppholdt seg utenfor Norge de siste 12 månedene',
};

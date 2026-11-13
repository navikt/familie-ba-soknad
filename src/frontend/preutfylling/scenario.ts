export enum Scenario {
    ORDINÆR = 'ORDINÆR',
    UTVIDET = 'UTVIDET',
    EØS_SØKER = 'EØS_SØKER',
    EØS_BARN = 'EØS_BARN',
    EØS_ANDRE_FORELDER = 'EØS_ANDRE_FORELDER',
}

export const scenarioNavn: Record<Scenario, string> = {
    [Scenario.ORDINÆR]: 'Happy case – ordinær barnetrygd uten avvik',
    [Scenario.UTVIDET]: 'Utvidet barnetrygd',
    [Scenario.EØS_SØKER]: 'EØS – søker har arbeidet i et EØS-land',
    [Scenario.EØS_BARN]: 'EØS – barna får barnetrygd fra et EØS-land',
    [Scenario.EØS_ANDRE_FORELDER]: 'EØS – den andre forelderen arbeider i et EØS-land',
};

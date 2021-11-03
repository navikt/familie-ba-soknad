export interface IRoute {
    path: string;
    label: string;
    route: RouteEnum;
    // Vi kan ha routes som ser helt like ut (to barn uten navn f.eks), trenger å kunne skille mellom dem
    spesifisering?: string;
}

export enum RouteEnum {
    Forside = 'Forside',
    OmDeg = 'OmDeg',
    DinLivssituasjon = 'DinLivssituasjon',
    VelgBarn = 'VelgBarn',
    OmBarna = 'OmBarna',
    OmBarnet = 'OmBarnet',
    Oppsummering = 'Oppsummering',
    Dokumentasjon = 'Dokumentasjon',
    Kvittering = 'Kvittering',
}

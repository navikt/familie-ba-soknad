import { PersonType } from '../../../typer/personType';

export const barnetrygdslandFeilmelding = (periodenErAvsluttet: boolean, personType: PersonType): string => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return periodenErAvsluttet
                ? 'modal.annenforelder-barnetrygd-fortid.feilmelding'
                : 'modal.annenforelder-barnetrygd-nåtid.feilmelding';
        }
        case PersonType.Omsorgsperson: {
            return periodenErAvsluttet
                ? 'modal.omsorgsperson-barnetrygd-fortid.feilmelding'
                : 'modal.omsorgsperson-barnetrygd-nåtid.feilmelding';
        }
        case PersonType.Søker:
        default: {
            return periodenErAvsluttet
                ? 'modal.hvilketlandbarnetrygd.feilmelding'
                : 'ombarnet.hvilketlandfår.feilmelding';
        }
    }
};

export const mottarBarnetrygdNåFeilmelding = (personType: PersonType) => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'modal.barnetrygdnå-annenforelder.feilmelding';
        case PersonType.Omsorgsperson:
            return 'modal.barnetrygdnå-omsorgsperson.feilmelding';
        case PersonType.Søker:
        default:
            return 'modal.barnetrygdnå.feilmelding';
    }
};

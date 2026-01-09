import { ESanitySteg, ISanitySpørsmålDokument } from '../../../../common/sanity';
import { PersonType } from '../../../typer/personType';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

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

export const barnetrygdSpørsmålDokument = (
    personType: Exclude<PersonType, PersonType.Barn>,
    tekster: ITekstinnhold,
    erDød?: boolean
): ISanitySpørsmålDokument => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return erDød
                ? tekster[ESanitySteg.EØS_FOR_BARN].ytelseFraAnnetLandAndreForelderGjenlevende
                : tekster[ESanitySteg.EØS_FOR_BARN].ytelseFraAnnetLandAndreForelder;
        }
        case PersonType.Omsorgsperson: {
            return tekster[ESanitySteg.EØS_FOR_BARN].ytelseFraAnnetLandOmsorgsperson;
        }
        case PersonType.Søker:
        default:
            return tekster[ESanitySteg.OM_BARNET].faarEllerHarFaattYtelseFraAnnetLand;
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

import { PersonType } from '../../../typer/personType';
import { ESanitySteg, ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

export const mottarPensjonNåFeilmeldingSpråkId = (personType: PersonType): string => {
    switch (personType) {
        case PersonType.AndreForelder:
            return 'ombarnet.andre-forelder.pensjonnå.feilmelding';
        case PersonType.Omsorgsperson:
            return 'modal.omsorgsperson.pensjonnå.feilmelding';
        case PersonType.Søker:
        default:
            return 'modal.fårdupensjonnå.feilmelding';
    }
};

export const pensjonslandFeilmeldingSpråkId = (personType, periodenErAvsluttet) => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return periodenErAvsluttet
                ? 'modal.hvilketlandpensjonandreforelder.feilmelding'
                : 'ombarnet.andre-forelder.utenlandspensjon.land.feilmelding';
        }
        case PersonType.Omsorgsperson: {
            return periodenErAvsluttet
                ? 'modal.hvilketlandpensjon-fortid-omsorgsperson.feilmelding'
                : 'modal.hvilketlandpensjon-nåtid-omsorgsperson.feilmelding';
        }
        case PersonType.Søker:
        default: {
            return periodenErAvsluttet
                ? 'felles.hvilketlandpensjon.feilmelding'
                : 'omdeg.utenlandspensjon.land.feilmelding';
        }
    }
};

export const pensjonSpørsmålDokument = (
    gjelderUtlandet: boolean,
    personType: PersonType,
    tekster: () => ITekstinnhold,
    erDød?: boolean
): ISanitySpørsmålDokument => {
    switch (personType) {
        case PersonType.AndreForelder: {
            if (erDød) {
                return gjelderUtlandet
                    ? tekster()[ESanitySteg.OM_BARNET].pensjonUtlandAndreForelderGjenlevende
                    : tekster()[ESanitySteg.EØS_FOR_BARN].pensjonNorgeAndreForelderGjenlevende;
            } else {
                return gjelderUtlandet
                    ? tekster()[ESanitySteg.OM_BARNET].pensjonUtlandAndreForelder
                    : tekster()[ESanitySteg.EØS_FOR_BARN].pensjonNorgeAndreForelder;
            }
        }
        case PersonType.Omsorgsperson: {
            return gjelderUtlandet
                ? tekster()[ESanitySteg.EØS_FOR_BARN].pensjonUtlandOmsorgsperson
                : tekster()[ESanitySteg.EØS_FOR_BARN].pensjonNorgeOmsorgsperson;
        }
        case PersonType.Søker:
        default: {
            return gjelderUtlandet
                ? tekster()[ESanitySteg.DIN_LIVSSITUASJON].pensjonUtland
                : tekster()[ESanitySteg.EØS_FOR_SØKER].pensjonNorge;
        }
    }
};

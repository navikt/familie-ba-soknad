import { PersonType } from '../../../typer/personType';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

export const arbeidslandFeilmelding = (
    periodenErAvsluttet: boolean,
    personType: PersonType
): string => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return periodenErAvsluttet
                ? 'enkeenkemann.andreforelder-arbeidutland.land.feilmelding'
                : 'ombarnet.andre-forelder.arbeid-utland.land.feilmelding';
        }
        case PersonType.Omsorgsperson: {
            return periodenErAvsluttet
                ? 'modal.omsorgsperson-arbeid-utland.land-fortid.feilmelding'
                : 'modal.omsorgsperson-arbeid-utland.land-nåtid.feilmelding';
        }
        case PersonType.Søker:
        default:
            return periodenErAvsluttet
                ? 'dinlivssituasjon.arbeid-utland.land.feilmelding'
                : 'omdeg.arbeid-utland.land.feilmelding';
    }
};

export const arbeidsperiodeOppsummeringOverskrift = (gjelderUtlandet: boolean): string =>
    gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.periode'
        : 'felles.flerearbeidsperiodernorge.periode';

export const arbeidsperiodeSpørsmålDokument = (
    gjelderUtlandet: boolean,
    personType: PersonType,
    tekster: () => ITekstinnhold,
    erDød?: boolean
): ISanitySpørsmålDokument => {
    switch (personType) {
        case PersonType.AndreForelder: {
            if (erDød) {
                return gjelderUtlandet
                    ? tekster().OM_BARNET.arbeidUtenforNorgeAndreForelderGjenlevende
                    : tekster().EØS_FOR_BARN.arbeidNorgeAndreForelderGjenlevende;
            } else {
                return gjelderUtlandet
                    ? tekster().OM_BARNET.arbeidUtenforNorgeAndreForelder
                    : tekster().EØS_FOR_BARN.arbeidNorgeAndreForelder;
            }
        }
        case PersonType.Omsorgsperson: {
            return gjelderUtlandet
                ? tekster().EØS_FOR_BARN.arbeidUtenforNorgeOmsorgsperson
                : tekster().EØS_FOR_BARN.arbeidNorgeOmsorgsperson;
        }
        case PersonType.Søker:
        default:
            return gjelderUtlandet
                ? tekster().DIN_LIVSSITUASJON.arbeidUtenforNorge
                : tekster().EØS_FOR_SØKER.arbeidNorge;
    }
};

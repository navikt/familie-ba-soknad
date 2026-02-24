import { ISanitySpørsmålDokument } from '../../../../common/sanity';
import { PersonType } from '../../../typer/personType';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

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

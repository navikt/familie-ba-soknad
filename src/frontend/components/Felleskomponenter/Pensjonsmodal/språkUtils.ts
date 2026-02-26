import { ESanitySteg, ISanitySpørsmålDokument } from '../../../../common/sanity';
import { PersonType } from '../../../typer/personType';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

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

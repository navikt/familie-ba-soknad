import { ESanitySteg, ISanitySpørsmålDokument } from '../../../../common/sanity';
import { PersonType } from '../../../typer/personType';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

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

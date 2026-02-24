import { ISanitySpørsmålDokument } from '../../../../common/sanity';
import { PersonType } from '../../../typer/personType';
import { ITekstinnhold } from '../../../typer/sanity/tekstInnhold';

export const mottarEllerMottattUtbetalingApiNavn = (
    personType: PersonType,
    tekster: ITekstinnhold,
    erDød?: boolean
): ISanitySpørsmålDokument => {
    switch (personType) {
        case PersonType.AndreForelder:
            return erDød
                ? tekster.EØS_FOR_BARN.utbetalingerAndreForelderGjenlevende
                : tekster.EØS_FOR_BARN.utbetalingerAndreForelder;
        case PersonType.Omsorgsperson:
            return tekster.EØS_FOR_BARN.utbetalingerOmsorgsperson;
        case PersonType.Søker:
        default:
            return tekster.EØS_FOR_SØKER.utbetalinger;
    }
};

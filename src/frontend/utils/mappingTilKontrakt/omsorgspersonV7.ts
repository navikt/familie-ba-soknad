import {
    EøsBarnSpørsmålId,
    eøsBarnSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { IBarnMedISøknad, IOmsorgsperson } from '../../typer/barn';
import { Slektsforhold } from '../../typer/kontrakt/barn';
import { IOmsorgspersonIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import { hentTekster, toSlektsforholdSpråkId } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    språktekstIdFraSpørsmålId,
    søknadsfeltBarn,
} from './hjelpefunksjoner';

export const omsorgspersonTilISøknadsfeltV7 = (
    omsorgsperson: IOmsorgsperson,
    barn: IBarnMedISøknad
): IOmsorgspersonIKontraktFormatV7 => {
    const { navn, slektsforhold, slektsforholdSpesifisering, idNummer, adresse } = omsorgsperson;
    return {
        navn: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonNavn),
            sammeVerdiAlleSpråk(navn.svar),
            barn
        ),

        slektsforhold: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonSlektsforhold),
            hentTekster(toSlektsforholdSpråkId(slektsforhold.svar as Slektsforhold)),
            barn
        ),

        slektsforholdSpesifisering: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonSlektsforholdSpesifisering),
            sammeVerdiAlleSpråk(slektsforholdSpesifisering.svar),
            barn
        ),

        idNummer: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonIdNummer),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                idNummer.svar,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke]
            ),
            barn
        ),

        adresse: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonAdresse),
            sammeVerdiAlleSpråk(adresse.svar),
            barn
        ),
    };
};

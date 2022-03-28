import { IntlShape } from 'react-intl';

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
    intl: IntlShape,
    omsorgsperson: IOmsorgsperson,
    barn: IBarnMedISøknad
): IOmsorgspersonIKontraktFormatV7 => {
    const { navn, slektsforhold, slektsforholdSpesifisering, idNummer, adresse } = omsorgsperson;
    return {
        navn: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonNavn),
            sammeVerdiAlleSpråk(navn.svar),
            barn
        ),

        slektsforhold: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonSlektsforhold),
            hentTekster(toSlektsforholdSpråkId(slektsforhold.svar as Slektsforhold)),
            barn
        ),

        slektsforholdSpesifisering: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonSlektsforholdSpesifisering),
            sammeVerdiAlleSpråk(slektsforholdSpesifisering.svar),
            barn
        ),

        idNummer: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonIdNummer),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                idNummer.svar,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke]
            ),
            barn
        ),

        adresse: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonAdresse),
            sammeVerdiAlleSpråk(adresse.svar),
            barn
        ),
    };
};

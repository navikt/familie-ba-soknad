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
    const {
        omsorgspersonNavn,
        omsorgspersonSlektsforhold,
        omsorgpersonSlektsforholdSpesifisering,
        omsorgspersonIdNummer,
        omsorgspersonAdresse,
    } = omsorgsperson;
    return {
        omsorgspersonNavn: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonNavn),
            sammeVerdiAlleSpråk(omsorgspersonNavn.svar),
            barn
        ),

        omsorgspersonSlektsforhold: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonSlektsforhold),
            hentTekster(toSlektsforholdSpråkId(omsorgspersonSlektsforhold.svar as Slektsforhold)),
            barn
        ),

        omsorgpersonSlektsforholdSpesifisering: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonSlektsforholdSpesifisering),
            sammeVerdiAlleSpråk(omsorgpersonSlektsforholdSpesifisering.svar),
            barn
        ),

        omsorgspersonIdNummer: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonIdNummer),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                omsorgspersonIdNummer.svar,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.omsorgspersonIdNummerVetIkke]
            ),
            barn
        ),

        omsorgspersonAdresse: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonAdresse),
            sammeVerdiAlleSpråk(omsorgspersonAdresse.svar),
            barn
        ),
    };
};

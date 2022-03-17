import { IntlShape } from 'react-intl';

import { EøsBarnSpørsmålId } from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { IBarnMedISøknad, IOmsorgsperson } from '../../typer/barn';
import { IOmsorgspersonIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import {
    sammeVerdiAlleSpråk,
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
            sammeVerdiAlleSpråk(omsorgspersonSlektsforhold.svar),
            barn
        ),
        omsorgpersonSlektsforholdSpesifisering: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgpersonSlektsforholdSpesifisering),
            sammeVerdiAlleSpråk(omsorgpersonSlektsforholdSpesifisering.svar),
            barn
        ),
        omsorgspersonIdNummer: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonIdNummer),
            sammeVerdiAlleSpråk(omsorgspersonIdNummer.svar),
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

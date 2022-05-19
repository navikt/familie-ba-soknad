import {
    EøsBarnSpørsmålId,
    eøsBarnSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { Slektsforhold } from '../../typer/kontrakt/barn';
import { IOmsorgspersonIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import { IOmsorgsperson } from '../../typer/omsorgsperson';
import { PersonType } from '../perioder';
import { hentTekster, toSlektsforholdSpråkId } from '../språk';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
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
    const {
        navn,
        slektsforhold,
        slektsforholdSpesifisering,
        idNummer,
        adresse,
        arbeidUtland,
        arbeidsperioderUtland,
        arbeidNorge,
        arbeidsperioderNorge,
    } = omsorgsperson;
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
        arbeidUtland: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonArbeidUtland),
            sammeVerdiAlleSpråk(arbeidUtland.svar),
            barn
        ),
        arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                personType: PersonType.Omsorgsperson,
            })
        ),
        arbeidNorge: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonArbeidNorge),
            sammeVerdiAlleSpråk(arbeidNorge.svar),
            barn
        ),
        arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                personType: PersonType.Omsorgsperson,
            })
        ),
    };
};

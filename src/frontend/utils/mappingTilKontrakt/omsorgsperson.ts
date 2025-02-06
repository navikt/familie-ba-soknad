import {
    EøsBarnSpørsmålId,
    eøsBarnSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { Slektsforhold, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IOmsorgspersonIKontraktFormat } from '../../typer/kontrakt/kontrakt';
import { IOmsorgsperson } from '../../typer/omsorgsperson';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { hentTekster, landkodeTilSpråk, toSlektsforholdSpråkId } from '../språk';

import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { tilIEøsBarnetrygsperiodeIKontraktFormat } from './eøsBarnetrygdsperiode';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    språktekstIdFraSpørsmålId,
    søknadsfeltBarn,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';

export const omsorgspersonTilISøknadsfelt = (
    omsorgsperson: IOmsorgsperson,
    barn: IBarnMedISøknad,
    tilRestLocaleRecord: TilRestLocaleRecord,
    tekster: ITekstinnhold
): IOmsorgspersonIKontraktFormat => {
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
        pensjonUtland,
        pensjonsperioderUtland,
        pensjonNorge,
        pensjonsperioderNorge,
        pågåendeSøknadFraAnnetEøsLand,
        pågåendeSøknadHvilketLand,
        barnetrygdFraEøs,
        eøsBarnetrygdsperioder,
        andreUtbetalinger,
        andreUtbetalingsperioder,
    } = omsorgsperson;

    if (
        !arbeidUtland.svar ||
        !arbeidNorge.svar ||
        !pensjonUtland.svar ||
        !pensjonNorge.svar ||
        !barnetrygdFraEøs.svar ||
        !pågåendeSøknadFraAnnetEøsLand.svar ||
        !andreUtbetalinger.svar
    ) {
        throw new TypeError('Omsorgspersonfelter mangler');
    }

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
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.omsorgsperson,
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
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.omsorgsperson,
                personType: PersonType.Omsorgsperson,
            })
        ),
        pensjonUtland: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonPensjonUtland),
            sammeVerdiAlleSpråk(pensjonUtland.svar),
            barn
        ),
        pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.omsorgsperson,
                barn: barn,
                personType: PersonType.Omsorgsperson,
            })
        ),
        pensjonNorge: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonPensjonNorge),
            sammeVerdiAlleSpråk(pensjonNorge.svar),
            barn
        ),
        pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.omsorgsperson,
                barn: barn,
                personType: PersonType.Omsorgsperson,
            })
        ),
        andreUtbetalinger: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonAndreUtbetalinger),
            sammeVerdiAlleSpråk(andreUtbetalinger.svar),
            barn
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                personType: PersonType.Omsorgsperson,
                barn,
            })
        ),
        pågåendeSøknadFraAnnetEøsLand: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonPågåendeSøknadFraAnnetEøsLand),
            sammeVerdiAlleSpråk(pågåendeSøknadFraAnnetEøsLand.svar),
            barn
        ),
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(
                      EøsBarnSpørsmålId.omsorgspersonPågåendeSøknadHvilketLand
                  ),
                  verdiCallbackAlleSpråk(locale =>
                      landkodeTilSpråk(pågåendeSøknadHvilketLand.svar, locale)
                  ),
                  barn
              )
            : null,
        barnetrygdFraEøs: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.omsorgspersonBarnetrygd),
            sammeVerdiAlleSpråk(barnetrygdFraEøs.svar),
            barn
        ),
        eøsBarnetrygdsperioder: eøsBarnetrygdsperioder.map((periode, index) =>
            tilIEøsBarnetrygsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                personType: PersonType.Omsorgsperson,
                barn: barn,
            })
        ),
    };
};

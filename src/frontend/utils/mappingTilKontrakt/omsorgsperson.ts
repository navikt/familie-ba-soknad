import { Slektsforhold, TilRestLocaleRecord } from '../../../common/typer/kontrakt/generelle';
import { IOmsorgspersonIKontraktFormat } from '../../../common/typer/kontrakt/kontrakt';
import { IBarnMedISøknad } from '../../typer/barn';
import { IOmsorgsperson } from '../../typer/omsorgsperson';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { hentSlektsforhold, landkodeTilSpråk } from '../språk';

import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { tilIEøsBarnetrygsperiodeIKontraktFormat } from './eøsBarnetrygdsperiode';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    søknadsfeltBarnHof,
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

    const søknadsfeltBarn = søknadsfeltBarnHof(tilRestLocaleRecord);
    const eøsTekster = tekster.EØS_FOR_BARN;

    return {
        navn: søknadsfeltBarn(eøsTekster.hvaHeterOmsorgspersonen.sporsmal, sammeVerdiAlleSpråk(navn.svar), barn),
        slektsforhold: søknadsfeltBarn(
            eøsTekster.slektsforholdOmsorgsperson.sporsmal,
            tilRestLocaleRecord(hentSlektsforhold(slektsforhold.svar as Slektsforhold, eøsTekster)),
            barn
        ),
        slektsforholdSpesifisering: søknadsfeltBarn(
            eøsTekster.hvilkenRelasjonOmsorgsperson.sporsmal,
            sammeVerdiAlleSpråk(slektsforholdSpesifisering.svar),
            barn
        ),
        idNummer: søknadsfeltBarn(
            eøsTekster.idNummerOmsorgsperson.sporsmal,
            sammeVerdiAlleSpråkEllerUkjent(
                tilRestLocaleRecord,
                idNummer.svar,
                eøsTekster.idNummerOmsorgsperson.checkboxLabel
            ),
            barn
        ),
        adresse: søknadsfeltBarn(eøsTekster.hvorBorOmsorgsperson.sporsmal, sammeVerdiAlleSpråk(adresse.svar), barn),
        arbeidUtland: søknadsfeltBarn(
            eøsTekster.arbeidUtenforNorgeOmsorgsperson.sporsmal,
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
            eøsTekster.arbeidNorgeOmsorgsperson.sporsmal,
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
            eøsTekster.pensjonUtlandOmsorgsperson.sporsmal,
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
            eøsTekster.pensjonNorgeOmsorgsperson.sporsmal,
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
            eøsTekster.utbetalingerOmsorgsperson.sporsmal,
            sammeVerdiAlleSpråk(andreUtbetalinger.svar),
            barn
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                personType: PersonType.Omsorgsperson,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.andreUtbetalinger.omsorgsperson,
                barn,
            })
        ),
        pågåendeSøknadFraAnnetEøsLand: søknadsfeltBarn(
            eøsTekster.paagaaendeSoeknadYtelseOmsorgsperson.sporsmal,
            sammeVerdiAlleSpråk(pågåendeSøknadFraAnnetEøsLand.svar),
            barn
        ),
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfeltBarn(
                  eøsTekster.hvilketLandSoektYtelseOmsorgsperson.sporsmal,
                  verdiCallbackAlleSpråk(locale => landkodeTilSpråk(pågåendeSøknadHvilketLand.svar, locale)),
                  barn
              )
            : null,
        barnetrygdFraEøs: søknadsfeltBarn(
            eøsTekster.ytelseFraAnnetLandOmsorgsperson.sporsmal,
            sammeVerdiAlleSpråk(barnetrygdFraEøs.svar),
            barn
        ),
        eøsBarnetrygdsperioder: eøsBarnetrygdsperioder.map((periode, index) =>
            tilIEøsBarnetrygsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                personType: PersonType.Omsorgsperson,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.barnetrygdsperiode.omsorgsperson,
                barn: barn,
            })
        ),
    };
};

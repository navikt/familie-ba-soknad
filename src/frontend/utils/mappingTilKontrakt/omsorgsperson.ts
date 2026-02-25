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
    søknadsfeltForESvarHof,
    søknadsfeltHof,
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
    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
    const eøsTekster = tekster.EØS_FOR_BARN;
    const søknadsfeltForESvar = søknadsfeltForESvarHof(tilRestLocaleRecord);
    const flettefelter = { barnetsNavn: barn.navn };

    return {
        navn: søknadsfelt(eøsTekster.hvaHeterOmsorgspersonen.sporsmal, sammeVerdiAlleSpråk(navn.svar)),
        slektsforhold: søknadsfelt(
            eøsTekster.slektsforholdOmsorgsperson.sporsmal,
            tilRestLocaleRecord(hentSlektsforhold(slektsforhold.svar as Slektsforhold, eøsTekster)),
            flettefelter
        ),
        slektsforholdSpesifisering: slektsforholdSpesifisering.svar
            ? søknadsfelt(
                  eøsTekster.hvilkenRelasjonOmsorgsperson.sporsmal,
                  sammeVerdiAlleSpråk(slektsforholdSpesifisering.svar),
                  flettefelter
              )
            : null,
        idNummer: søknadsfelt(
            eøsTekster.idNummerOmsorgsperson.sporsmal,
            sammeVerdiAlleSpråkEllerUkjent(
                tilRestLocaleRecord,
                idNummer.svar,
                eøsTekster.idNummerOmsorgsperson.checkboxLabel
            )
        ),
        adresse: søknadsfelt(
            eøsTekster.hvorBorOmsorgsperson.sporsmal,
            sammeVerdiAlleSpråkEllerUkjent(
                tilRestLocaleRecord,
                adresse.svar,
                eøsTekster.hvorBorOmsorgsperson.checkboxLabel
            )
        ),
        arbeidUtland: søknadsfeltForESvar(
            eøsTekster.arbeidUtenforNorgeOmsorgsperson.sporsmal,
            arbeidUtland.svar,
            flettefelter
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
        arbeidNorge: søknadsfeltForESvar(eøsTekster.arbeidNorgeOmsorgsperson.sporsmal, arbeidNorge.svar, flettefelter),
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
        pensjonUtland: søknadsfeltForESvar(
            eøsTekster.pensjonUtlandOmsorgsperson.sporsmal,
            pensjonUtland.svar,
            flettefelter
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
        pensjonNorge: søknadsfeltForESvar(
            eøsTekster.pensjonNorgeOmsorgsperson.sporsmal,
            pensjonNorge.svar,
            flettefelter
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
        andreUtbetalinger: søknadsfeltForESvar(
            eøsTekster.utbetalingerOmsorgsperson.sporsmal,
            andreUtbetalinger.svar,
            flettefelter
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
        pågåendeSøknadFraAnnetEøsLand: søknadsfeltForESvar(
            eøsTekster.paagaaendeSoeknadYtelseOmsorgsperson.sporsmal,
            pågåendeSøknadFraAnnetEøsLand.svar,
            flettefelter
        ),
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfelt(
                  eøsTekster.hvilketLandSoektYtelseOmsorgsperson.sporsmal,
                  verdiCallbackAlleSpråk(locale => landkodeTilSpråk(pågåendeSøknadHvilketLand.svar, locale)),
                  flettefelter
              )
            : null,
        barnetrygdFraEøs: søknadsfeltForESvar(
            eøsTekster.ytelseFraAnnetLandOmsorgsperson.sporsmal,
            barnetrygdFraEøs.svar,
            flettefelter
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

import { ESvar } from '@navikt/familie-form-elements';

import { TilRestLocaleRecord } from '../../../common/typer/kontrakt/generelle';
import { IAndreForelderIKontraktFormat } from '../../../common/typer/kontrakt/kontrakt';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../components/SøknadsSteg/OmBarnet/spørsmål';
import { barnDataKeySpørsmål, IAndreForelder, IBarnMedISøknad } from '../../typer/barn';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { landkodeTilSpråk } from '../språk';

import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { tilIEøsBarnetrygsperiodeIKontraktFormat } from './eøsBarnetrygdsperiode';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    søknadsfeltBarnHof,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';

export const andreForelderTilISøknadsfelt = (
    andreForelder: IAndreForelder,
    barn: IBarnMedISøknad,
    tilRestLocaleRecord: TilRestLocaleRecord,
    tekster: ITekstinnhold
): IAndreForelderIKontraktFormat => {
    const {
        navn,
        fnr,
        fødselsdato,
        pensjonUtland,
        arbeidUtlandet,
        pensjonNorge,
        arbeidNorge,
        andreUtbetalinger,
        barnetrygdFraEøs,
        skriftligAvtaleOmDeltBosted,
        arbeidsperioderUtland,
        pensjonsperioderUtland,
        arbeidsperioderNorge,
        pensjonsperioderNorge,
        andreUtbetalingsperioder,
        pågåendeSøknadFraAnnetEøsLand,
        pågåendeSøknadHvilketLand,
        eøsBarnetrygdsperioder,
        idNummer,
        adresse,
        kanIkkeGiOpplysninger,
        utvidet,
    } = andreForelder;

    const søknadsfeltBarn = søknadsfeltBarnHof(tilRestLocaleRecord);

    const eøsTekster = tekster.EØS_FOR_BARN;
    const omBarnetTekster = tekster.OM_BARNET;

    const erForelderDød = barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA;

    return {
        kanIkkeGiOpplysninger: søknadsfeltBarn(
            omBarnetTekster.navnAndreForelder.checkboxLabel,
            sammeVerdiAlleSpråk(kanIkkeGiOpplysninger.svar),
            barn
        ),
        navn: navn.svar
            ? søknadsfeltBarn(
                  omBarnetTekster.navnAndreForelder.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      navn.svar,
                      omBarnetTekster.navnAndreForelder.checkboxLabel
                  ),
                  barn
              )
            : null,
        fnr: fnr.svar
            ? søknadsfeltBarn(
                  omBarnetTekster.foedselsnummerDnummerAndreForelder.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      fnr.svar,
                      omBarnetTekster.foedselsnummerDnummerAndreForelder.checkboxLabel
                  ),
                  barn
              )
            : null,
        fødselsdato: fødselsdato.svar
            ? søknadsfeltBarn(
                  omBarnetTekster.foedselsdatoAndreForelder.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      fødselsdato.svar,
                      omBarnetTekster.foedselsdatoAndreForelder.checkboxLabel
                  ),
                  barn
              )
            : null,
        pensjonUtland: pensjonUtland.svar
            ? søknadsfeltBarn(
                  omBarnetTekster.pensjonUtlandAndreForelder.sporsmal,
                  sammeVerdiAlleSpråk(pensjonUtland.svar),
                  barn
              )
            : null,
        arbeidUtlandet: arbeidUtlandet.svar
            ? søknadsfeltBarn(
                  omBarnetTekster.arbeidUtenforNorgeAndreForelder.sporsmal,
                  sammeVerdiAlleSpråk(arbeidUtlandet.svar),
                  barn
              )
            : null,
        pensjonNorge: pensjonNorge.svar
            ? søknadsfeltBarn(
                  erForelderDød
                      ? eøsTekster.pensjonNorgeAndreForelderGjenlevende.sporsmal
                      : eøsTekster.pensjonNorgeAndreForelder.sporsmal,
                  sammeVerdiAlleSpråk(pensjonNorge.svar),
                  barn
              )
            : null,
        arbeidNorge: arbeidNorge.svar
            ? søknadsfeltBarn(
                  erForelderDød
                      ? eøsTekster.arbeidNorgeAndreForelderGjenlevende.sporsmal
                      : eøsTekster.arbeidNorgeAndreForelder.sporsmal,
                  sammeVerdiAlleSpråk(arbeidNorge.svar),
                  barn
              )
            : null,
        andreUtbetalinger: andreUtbetalinger.svar
            ? søknadsfeltBarn(
                  erForelderDød
                      ? eøsTekster.utbetalingerAndreForelderGjenlevende.sporsmal
                      : eøsTekster.utbetalingerAndreForelder.sporsmal,
                  sammeVerdiAlleSpråk(andreUtbetalinger.svar),
                  barn
              )
            : null,
        pågåendeSøknadFraAnnetEøsLand: pågåendeSøknadFraAnnetEøsLand.svar
            ? søknadsfeltBarn(
                  eøsTekster.paagaaendeSoeknadYtelseAndreForelder.sporsmal,
                  sammeVerdiAlleSpråk(pågåendeSøknadFraAnnetEøsLand.svar),
                  barn
              )
            : null,
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfeltBarn(
                  eøsTekster.hvilketLandSoektYtelseAndreForelder.sporsmal,
                  verdiCallbackAlleSpråk(locale => landkodeTilSpråk(pågåendeSøknadHvilketLand.svar, locale)),
                  barn
              )
            : null,
        barnetrygdFraEøs: barnetrygdFraEøs.svar
            ? søknadsfeltBarn(
                  erForelderDød
                      ? eøsTekster.ytelseFraAnnetLandAndreForelderGjenlevende.sporsmal
                      : eøsTekster.ytelseFraAnnetLandAndreForelder.sporsmal,
                  sammeVerdiAlleSpråk(barnetrygdFraEøs.svar),
                  barn
              )
            : null,
        skriftligAvtaleOmDeltBosted: skriftligAvtaleOmDeltBosted.svar
            ? søknadsfeltBarn(
                  omBarnetTekster.deltBosted.sporsmal,
                  sammeVerdiAlleSpråk(skriftligAvtaleOmDeltBosted.svar),
                  barn
              )
            : null,
        adresse: adresse.svar
            ? søknadsfeltBarn(
                  eøsTekster.hvorBorAndreForelder.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      adresse.svar,
                      eøsTekster.hvorBorAndreForelder.checkboxLabel
                  ),
                  barn
              )
            : null,
        utvidet: {
            søkerHarBoddMedAndreForelder: utvidet.søkerHarBoddMedAndreForelder.svar
                ? søknadsfeltBarn(
                      språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder),
                      sammeVerdiAlleSpråk(utvidet.søkerHarBoddMedAndreForelder.svar),
                      barn
                  )
                : null,
            søkerFlyttetFraAndreForelderDato: utvidet.søkerFlyttetFraAndreForelderDato.svar
                ? søknadsfeltBarn(
                      språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato),
                      sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                          utvidet.søkerFlyttetFraAndreForelderDato.svar,
                          omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.søkerBorMedAndreForelder]
                      )
                  )
                : null,
        },
        arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.andreForelder,
                barn,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
            })
        ),
        pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.andreForelder,
                barn,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
            })
        ),
        arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.andreForelder,
                barn,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
            })
        ),
        pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.andreForelder,
                barn,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
            })
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.andreUtbetalinger.andreForelder,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
                barn,
            })
        ),
        eøsBarnetrygdsperioder: eøsBarnetrygdsperioder.map((periode, index) =>
            tilIEøsBarnetrygsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                personType: PersonType.AndreForelder,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.barnetrygdsperiode.andreForelder,
                erDød: forelderErDød,
                barn,
            })
        ),
        idNummer: idNummer.map(idnummerObj =>
            idNummerTilISøknadsfelt(
                tilRestLocaleRecord,
                idnummerObj,
                tekster.EØS_FOR_BARN.idNummerAndreForelder,
                barn.navn
            )
        ),
    };
};

import { ESvar } from '@navikt/familie-form-elements';

import {
    EøsBarnSpørsmålId,
    eøsBarnSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import {
    OmBarnetSpørsmålsId,
    omBarnetSpørsmålSpråkId,
} from '../../components/SøknadsSteg/OmBarnet/spørsmål';
import { barnDataKeySpørsmål, IAndreForelder, IBarnMedISøknad } from '../../typer/barn';
import { LocaleType } from '../../typer/common';
import { TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { IAndreForelderIKontraktFormat } from '../../typer/kontrakt/kontrakt';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { landkodeTilSpråk } from '../språk';

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
import { idNummerTilISøknadsfelt } from './idNummer';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';

export const andreForelderTilISøknadsfelt = (
    andreForelder: IAndreForelder,
    barn: IBarnMedISøknad,
    valgtSpråk: LocaleType,
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
    const forelderErDød = barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA;
    return {
        kanIkkeGiOpplysninger: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(kanIkkeGiOpplysninger.id),
            sammeVerdiAlleSpråk(kanIkkeGiOpplysninger.svar),
            barn
        ),
        navn: navn.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderNavn),
                  sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                      navn.svar,
                      omBarnetSpørsmålSpråkId[
                          OmBarnetSpørsmålsId.andreForelderKanIkkeGiOpplysninger
                      ]
                  ),
                  barn
              )
            : null,
        fnr: fnr.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderFnr),
                  sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                      fnr.svar,
                      omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFnrUkjent]
                  ),
                  barn
              )
            : null,
        fødselsdato: fødselsdato.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderFødselsdato),
                  sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                      fødselsdato.svar,
                      omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.andreForelderFødselsdatoUkjent]
                  ),
                  barn
              )
            : null,
        pensjonUtland: pensjonUtland.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(pensjonUtland.id),
                  sammeVerdiAlleSpråk(pensjonUtland.svar),
                  barn
              )
            : null,
        arbeidUtlandet: arbeidUtlandet.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(arbeidUtlandet.id),
                  sammeVerdiAlleSpråk(arbeidUtlandet.svar),
                  barn
              )
            : null,
        pensjonNorge: pensjonNorge.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(pensjonNorge.id),
                  sammeVerdiAlleSpråk(pensjonNorge.svar),
                  barn
              )
            : null,
        arbeidNorge: arbeidNorge.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(arbeidNorge.id),
                  sammeVerdiAlleSpråk(arbeidNorge.svar),
                  barn
              )
            : null,
        andreUtbetalinger: andreUtbetalinger.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(andreUtbetalinger.id),
                  sammeVerdiAlleSpråk(andreUtbetalinger.svar),
                  barn
              )
            : null,
        pågåendeSøknadFraAnnetEøsLand: pågåendeSøknadFraAnnetEøsLand.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(
                      EøsBarnSpørsmålId.andreForelderPågåendeSøknadFraAnnetEøsLand
                  ),
                  sammeVerdiAlleSpråk(pågåendeSøknadFraAnnetEøsLand.svar),
                  barn
              )
            : null,
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(
                      EøsBarnSpørsmålId.andreForelderPågåendeSøknadHvilketLand
                  ),
                  verdiCallbackAlleSpråk(locale =>
                      landkodeTilSpråk(pågåendeSøknadHvilketLand.svar, locale)
                  ),
                  barn
              )
            : null,
        barnetrygdFraEøs: barnetrygdFraEøs.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(barnetrygdFraEøs.id),
                  sammeVerdiAlleSpråk(barnetrygdFraEøs.svar),
                  barn
              )
            : null,
        skriftligAvtaleOmDeltBosted: skriftligAvtaleOmDeltBosted.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted),
                  sammeVerdiAlleSpråk(skriftligAvtaleOmDeltBosted.svar),
                  barn
              )
            : null,
        adresse: adresse.svar
            ? søknadsfeltBarn(
                  språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.andreForelderAdresse),
                  sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                      adresse.svar,
                      eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAdresseVetIkke]
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
                      språktekstIdFraSpørsmålId(
                          OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato
                      ),
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
                idnummerObj,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerAndreForelder],
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerUkjent],
                valgtSpråk,
                barn.navn
            )
        ),
    };
};

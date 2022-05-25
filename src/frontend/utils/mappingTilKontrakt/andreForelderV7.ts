import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import {
    EøsBarnSpørsmålId,
    eøsBarnSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import {
    OmBarnetSpørsmålsId,
    omBarnetSpørsmålSpråkId,
} from '../../components/SøknadsSteg/OmBarnet/spørsmål';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    IAndreForelder,
    IBarnMedISøknad,
} from '../../typer/barn';
import { IAndreForelderIKontraktFormatV7 } from '../../typer/kontrakt/v7';
import { PersonType } from '../../typer/personType';
import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { tilIEøsBarnetrygsperiodeIKontraktFormat } from './eøsBarnetrygdsperiode';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    språktekstIdFraSpørsmålId,
    søknadsfeltBarn,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';

export const andreForelderTilISøknadsfeltV7 = (
    andreForelder: IAndreForelder,
    barn: IBarnMedISøknad,
    valgtSpråk: LocaleType
): IAndreForelderIKontraktFormatV7 => {
    const {
        navn,
        fnr,
        fødselsdato,
        arbeidsperioderUtland,
        pensjonsperioderUtland,
        arbeidsperioderNorge,
        pensjonsperioderNorge,
        andreUtbetalingsperioder,
        eøsBarnetrygdsperioder,
        idNummer,
        adresse,
        kanIkkeGiOpplysninger,
    } = andreForelder;
    const forelderErDød = barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA;
    return {
        kanIkkeGiOpplysninger,
        [andreForelderDataKeySpørsmål.navn]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderNavn),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                navn.svar,
                omBarnetSpørsmålSpråkId['andre-forelder-navn-ukjent']
            ),
            barn
        ),
        [andreForelderDataKeySpørsmål.fnr]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderFnr),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                fnr.svar,
                omBarnetSpørsmålSpråkId['andre-forelder-fødsels-/dnummer-ukjent']
            ),
            barn
        ),
        [andreForelderDataKeySpørsmål.fødselsdato]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderFødselsdato),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                fødselsdato.svar,
                omBarnetSpørsmålSpråkId['andre-forelder-fødselsdato-ukjent']
            ),
            barn
        ),
        [andreForelderDataKeySpørsmål.pensjonUtland]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? OmBarnetSpørsmålsId.andreForelderPensjonUtlandEnke
                    : OmBarnetSpørsmålsId.andreForelderPensjonUtland
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.arbeidUtlandet]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? OmBarnetSpørsmålsId.andreForelderArbeidUtlandetEnke
                    : OmBarnetSpørsmålsId.andreForelderArbeidUtlandet
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.pensjonNorge]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? EøsBarnSpørsmålId.andreForelderPensjonNorgeEnke
                    : EøsBarnSpørsmålId.andreForelderPensjonNorge
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.pensjonNorge].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.arbeidNorge]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? EøsBarnSpørsmålId.andreForelderArbeidNorgeEnke
                    : EøsBarnSpørsmålId.andreForelderArbeidNorge
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.arbeidNorge].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.andreUtbetalinger]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke
                    : EøsBarnSpørsmålId.andreForelderAndreUtbetalinger
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.andreUtbetalinger].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.barnetrygdFraEøs]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? EøsBarnSpørsmålId.andreForelderBarnetrygd
                    : EøsBarnSpørsmålId.andreForelderBarnetrygdGjenlevende
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.barnetrygdFraEøs].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted),
            sammeVerdiAlleSpråk(
                andreForelder[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted].svar
            ),
            barn
        ),
        [andreForelderDataKeySpørsmål.adresse]: søknadsfeltBarn(
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.andreForelderAdresse),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                adresse.svar,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAdresseVetIkke]
            ),
            barn
        ),
        utvidet: {
            [andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]: søknadsfeltBarn(
                språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder),
                sammeVerdiAlleSpråk(
                    andreForelder.utvidet[andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]
                        .svar
                ),
                barn
            ),
            [andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]: søknadsfeltBarn(
                språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.søkerFlyttetFraAndreForelderDato),
                sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    andreForelder.utvidet[
                        andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato
                    ].svar,
                    omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.søkerBorMedAndreForelder]
                )
            ),
        },
        arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
            })
        ),
        pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
                barn,
            })
        ),
        arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
            })
        ),
        pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                personType: PersonType.AndreForelder,
                erDød: forelderErDød,
                barn,
            })
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
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

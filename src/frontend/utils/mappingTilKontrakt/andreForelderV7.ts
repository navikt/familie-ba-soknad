import { IntlShape } from 'react-intl';

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
import { barnetsNavnValue } from '../barn';
import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    språktekstIdFraSpørsmålId,
    søknadsfeltBarn,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';

export const andreForelderTilISøknadsfeltV7 = (
    intl: IntlShape,
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
        idNummer,
        adresse,
        kanIkkeGiOpplysninger,
    } = andreForelder;
    const forelderErDød = barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA;
    return {
        kanIkkeGiOpplysninger,
        [andreForelderDataKeySpørsmål.navn]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderNavn),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                navn.svar,
                omBarnetSpørsmålSpråkId['andre-forelder-navn-ukjent']
            ),
            barn
        ),
        [andreForelderDataKeySpørsmål.fnr]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderFnr),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                fnr.svar,
                omBarnetSpørsmålSpråkId['andre-forelder-fødsels-/dnummer-ukjent']
            ),
            barn
        ),
        [andreForelderDataKeySpørsmål.fødselsdato]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.andreForelderFødselsdato),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                fødselsdato.svar,
                omBarnetSpørsmålSpråkId['andre-forelder-fødselsdato-ukjent']
            ),
            barn
        ),
        [andreForelderDataKeySpørsmål.pensjonUtland]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? OmBarnetSpørsmålsId.andreForelderPensjonUtlandEnke
                    : OmBarnetSpørsmålsId.andreForelderPensjonUtland
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.pensjonUtland].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.arbeidUtlandet]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? OmBarnetSpørsmålsId.andreForelderArbeidUtlandetEnke
                    : OmBarnetSpørsmålsId.andreForelderArbeidUtlandet
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandet].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.pensjonNorge]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? EøsBarnSpørsmålId.andreForelderPensjonNorgeEnke
                    : EøsBarnSpørsmålId.andreForelderPensjonNorge
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.pensjonNorge].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.arbeidNorge]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? EøsBarnSpørsmålId.andreForelderArbeidNorgeEnke
                    : EøsBarnSpørsmålId.andreForelderArbeidNorge
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.arbeidNorge].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.andreUtbetalinger]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? EøsBarnSpørsmålId.andreForelderAndreUtbetalingerEnke
                    : EøsBarnSpørsmålId.andreForelderAndreUtbetalinger
            ),
            sammeVerdiAlleSpråk(andreForelder[andreForelderDataKeySpørsmål.andreUtbetalinger].svar),
            barn
        ),
        [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.skriftligAvtaleOmDeltBosted),
            sammeVerdiAlleSpråk(
                andreForelder[andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted].svar
            ),
            barn
        ),
        [andreForelderDataKeySpørsmål.adresse]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.andreForelderAdresse),
            sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                adresse.svar,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderAdresseVetIkke]
            ),
            barn
        ),
        utvidet: {
            [andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]: søknadsfeltBarn(
                intl,
                språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.søkerHarBoddMedAndreForelder),
                sammeVerdiAlleSpråk(
                    andreForelder.utvidet[andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]
                        .svar
                ),
                barn
            ),
            [andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]: søknadsfeltBarn(
                intl,
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
                gjelderAndreForelder: true,
                erAndreForelderDød: forelderErDød,
            })
        ),
        pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderAndreForelder: true,
                erAndreForelderDød: forelderErDød,
                gjelderUtlandet: true,
                barn,
                intl,
            })
        ),
        arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                gjelderAndreForelder: true,
                erAndreForelderDød: forelderErDød,
            })
        ),
        pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderAndreForelder: true,
                erAndreForelderDød: forelderErDød,
                gjelderUtlandet: false,
                barn,
                intl,
            })
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderAndreForelder: true,
                erAndreForelderDød: forelderErDød,
                barn,
                intl,
            })
        ),
        idNummer: idNummer.map(idnummerObj =>
            idNummerTilISøknadsfelt(
                idnummerObj,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerAndreForelder],
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerUkjent],
                valgtSpråk,
                barnetsNavnValue(barn, intl)
            )
        ),
    };
};

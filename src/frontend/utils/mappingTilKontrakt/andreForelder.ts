import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

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
import { IAndreForelderIKontraktFormat } from '../../typer/kontrakt/generelle';
import { landkodeTilSpråk } from '../språk';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    språktekstIdFraSpørsmålId,
    søknadsfeltBarn,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';

export const andreForelderTilISøknadsfelt = (
    intl: IntlShape,
    andreForelder: IAndreForelder,
    barn: IBarnMedISøknad
): IAndreForelderIKontraktFormat => {
    const { navn, fnr, fødselsdato } = andreForelder;
    const forelderErDød = barn[barnDataKeySpørsmål.andreForelderErDød].svar === ESvar.JA;
    return {
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

        [andreForelderDataKeySpørsmål.pensjonHvilketLand]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? OmBarnetSpørsmålsId.andreForelderPensjonHvilketLandEnke
                    : OmBarnetSpørsmålsId.andreForelderPensjonHvilketLand
            ),
            verdiCallbackAlleSpråk(locale =>
                landkodeTilSpråk(
                    andreForelder[andreForelderDataKeySpørsmål.pensjonHvilketLand].svar,
                    locale
                )
            ),
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
        [andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]: søknadsfeltBarn(
            intl,
            språktekstIdFraSpørsmålId(
                forelderErDød
                    ? OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLandEnke
                    : OmBarnetSpørsmålsId.andreForelderArbeidUtlandetHvilketLand
            ),
            verdiCallbackAlleSpråk(locale =>
                landkodeTilSpråk(
                    andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand].svar,
                    locale
                )
            ),
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
    };
};

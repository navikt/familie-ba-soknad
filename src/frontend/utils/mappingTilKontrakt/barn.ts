import {
    OmBarnetSpørsmålsId,
    omBarnetSpørsmålSpråkId,
} from '../../components/SøknadsSteg/OmBarnet/spørsmål';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../typer/barn';
import { ISøknadKontraktBarn } from '../../typer/kontrakt/barn';
import { ERegistrertBostedType } from '../../typer/kontrakt/generelle';
import { ISøknadSpørsmålMap } from '../../typer/spørsmål';
import { hentTekster } from '../språk';
import { formaterFnr } from '../visning';
import { andreForelderTilISøknadsfelt } from './andreForelder';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    språktekstIdFraSpørsmålId,
    spørmålISøknadsFormat,
    søknadsfeltBarn,
} from './hjelpefunksjoner';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

export const barnISøknadsFormat = (barn: IBarnMedISøknad): ISøknadKontraktBarn => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
        id,
        barnErFyltUt,
        ident,
        navn,
        borMedSøker,
        alder,
        adressebeskyttelse,
        andreForelder,
        omsorgsperson,
        søkerForTidsromSluttdato,
        institusjonOppholdSluttdato,
        utenlandsperioder,
        // Nye felter under utvikling av EØS full
        eøsBarnetrygdsperioder,
        triggetEøs,
        idNummer,
        // resterende felter, hvor alle må være av type ISøknadSpørsmål
        ...barnSpørsmål
    } = barn;
    const typetBarnSpørsmål = barnSpørsmål as unknown as ISøknadSpørsmålMap;

    const registertBostedVerdi = (): ERegistrertBostedType => {
        /**
         * 4 caser:
         *
         * 1. Adressesperre
         * 2. Manuelt registrert, "Ikke fylt inn"
         * 3. Bor med søker "registrert på søkers adresse"
         * 4. Bor ikke med søker "registrert på annen adresse"
         */
        if (barn.adressebeskyttelse) {
            return ERegistrertBostedType.ADRESSESPERRE;
        }

        switch (barn.borMedSøker) {
            case undefined:
                return ERegistrertBostedType.IKKE_FYLT_INN;
            case true:
                return ERegistrertBostedType.REGISTRERT_SOKERS_ADRESSE;
            case false:
                return ERegistrertBostedType.REGISTRERT_ANNEN_ADRESSE;
            default:
                return ERegistrertBostedType.IKKE_FYLT_INN;
        }
    };

    return {
        navn: søknadsfeltBarn(
            'pdf.barn.navn.label',
            sammeVerdiAlleSpråk(navn ?? `Barn ${formaterFnr(ident)}`),
            barn
        ),
        ident: søknadsfeltBarn(
            'pdf.barn.ident.label',
            ident ? sammeVerdiAlleSpråk(ident) : hentTekster('pdf.barn.ikke-oppgitt'),
            barn
        ),
        registrertBostedType: søknadsfeltBarn(
            'hvilkebarn.barn.bosted',
            sammeVerdiAlleSpråk(registertBostedVerdi()),
            barn
        ),
        alder: søknadsfeltBarn(
            'pdf.barn.alder.label',
            alder ? hentTekster('felles.år', { alder }) : sammeVerdiAlleSpråk(undefined),
            barn
        ),
        utenlandsperioder: utenlandsperioder.map((periode, index) =>
            utenlandsperiodeTilISøknadsfelt(periode, index + 1, barn)
        ),
        andreForelder: andreForelder ? andreForelderTilISøknadsfelt(andreForelder, barn) : null,
        spørsmål: {
            ...spørmålISøknadsFormat(typetBarnSpørsmål, {
                navn: barn.navn,
                barn: barn.navn,
            }),
            [barnDataKeySpørsmål.søkerForTidsromSluttdato]: søknadsfeltBarn(
                språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.søkerForTidsromSluttdato),
                sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    søkerForTidsromSluttdato.svar,
                    omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.søkerForTidsromSluttdatoVetIkke]
                ),
                barn
            ),

            [barnDataKeySpørsmål.institusjonOppholdSluttdato]: søknadsfeltBarn(
                språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.institusjonOppholdSluttdato),
                sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    institusjonOppholdSluttdato.svar,
                    omBarnetSpørsmålSpråkId['institusjon-opphold-ukjent-sluttdato']
                ),
                barn
            ),
        },
    };
};

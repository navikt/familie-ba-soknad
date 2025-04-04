import {
    EøsBarnSpørsmålId,
    eøsBarnSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import {
    OmBarnetSpørsmålsId,
    omBarnetSpørsmålSpråkId,
} from '../../components/SøknadsSteg/OmBarnet/spørsmål';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../typer/barn';
import { LocaleType } from '../../typer/common';
import { ERegistrertBostedType, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadIKontraktBarn } from '../../typer/kontrakt/kontrakt';
import { ISøker } from '../../typer/person';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknadSpørsmålMap } from '../../typer/spørsmål';
import { hentTekster } from '../språk';

import { andreForelderTilISøknadsfelt } from './andreForelder';
import { tilIEøsBarnetrygsperiodeIKontraktFormat } from './eøsBarnetrygdsperiode';
import {
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    språktekstIdFraSpørsmålId,
    spørmålISøknadsFormat,
    søknadsfeltBarn,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { omsorgspersonTilISøknadsfelt } from './omsorgsperson';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

export const barnISøknadsFormat = (
    barn: IBarnMedISøknad,
    søker: ISøker,
    valgtSpråk: LocaleType,
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord,
    toggleSpørOmMånedIkkeDato: boolean
): ISøknadIKontraktBarn => {
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
        institusjonOppholdSluttdato,
        utenlandsperioder,
        // Nye felter under utvikling av EØS full
        eøsBarnetrygdsperioder,
        idNummer,
        triggetEøs,
        adresse,
        // resterende felter, hvor alle må være av type ISøknadSpørsmål
        ...barnSpørsmål
    } = barn;
    const fellesTekster = tekster.FELLES;
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
        if (adressebeskyttelse) {
            return ERegistrertBostedType.ADRESSESPERRE;
        }

        switch (borMedSøker) {
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
        harEøsSteg: triggetEøs || søker.triggetEøs,
        navn: søknadsfeltBarn('pdf.barn.navn.label', sammeVerdiAlleSpråk(navn), barn),
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
        alder: alder
            ? søknadsfeltBarn('pdf.barn.alder.label', hentTekster('felles.år', { alder }), barn)
            : null,
        utenlandsperioder: utenlandsperioder.map((periode, index) =>
            utenlandsperiodeTilISøknadsfelt({
                utenlandperiode: periode,
                periodeNummer: index + 1,
                tekster: fellesTekster.modaler.utenlandsopphold[PersonType.Barn],
                tilRestLocaleRecord,
                barn,
            })
        ),
        eøsBarnetrygdsperioder: eøsBarnetrygdsperioder.map((periode, index) =>
            tilIEøsBarnetrygsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                personType: PersonType.Søker,
                tilRestLocaleRecord,
                tekster: fellesTekster.modaler.barnetrygdsperiode.søker,
                barn,
                toggleSpørOmMånedIkkeDato,
            })
        ),
        idNummer: idNummer.map(idnummerObj =>
            idNummerTilISøknadsfelt(
                idnummerObj,
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummer],
                eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerUkjent],
                valgtSpråk,
                navn
            )
        ),
        andreForelder: andreForelder
            ? andreForelderTilISøknadsfelt(
                  andreForelder,
                  barn,
                  valgtSpråk,
                  tilRestLocaleRecord,
                  tekster,
                  toggleSpørOmMånedIkkeDato
              )
            : null,

        omsorgsperson: omsorgsperson
            ? omsorgspersonTilISøknadsfelt(
                  omsorgsperson,
                  barn,
                  tilRestLocaleRecord,
                  tekster,
                  toggleSpørOmMånedIkkeDato
              )
            : null,
        spørsmål: {
            ...spørmålISøknadsFormat(
                typetBarnSpørsmål,
                {
                    navn: navn,
                    barn: navn,
                },
                tekster
            ),
            [barnDataKeySpørsmål.institusjonOppholdSluttdato]: søknadsfeltBarn(
                språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.institusjonOppholdSluttdato),
                sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    institusjonOppholdSluttdato.svar,
                    omBarnetSpørsmålSpråkId['institusjon-opphold-ukjent-sluttdato']
                ),
                barn
            ),
            [barnDataKeySpørsmål.adresse]: søknadsfeltBarn(
                språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.barnetsAdresse),
                sammeVerdiAlleSpråkEllerUkjentSpråktekst(
                    adresse.svar,
                    eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.barnetsAdresseVetIkke]
                ),
                barn
            ),
        },
    };
};

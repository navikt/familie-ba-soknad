import {
    EøsBarnSpørsmålId,
    eøsBarnSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { OmBarnaDineSpørsmålId } from '../../components/SøknadsSteg/OmBarnaDine/spørsmål';
import {
    OmBarnetSpørsmålsId,
    omBarnetSpørsmålSpråkId,
} from '../../components/SøknadsSteg/OmBarnet/spørsmål';
import { barnDataKeySpørsmål, IBarnMedISøknad } from '../../typer/barn';
import { ERegistrertBostedType, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadIKontraktBarn } from '../../typer/kontrakt/kontrakt';
import { ISøker } from '../../typer/person';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknadSpørsmålMap } from '../../typer/spørsmål';
import { ISøknad } from '../../typer/søknad';
import { hentTekster } from '../språk';

import { andreForelderTilISøknadsfelt } from './andreForelder';
import { tilIEøsBarnetrygsperiodeIKontraktFormat } from './eøsBarnetrygdsperiode';
import {
    nullableSøknadsfeltForESvarHof,
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
    sammeVerdiAlleSpråkEllerUkjentSpråktekst,
    språktekstIdFraSpørsmålId,
    spørmålISøknadsFormat,
    søknadsfeltBarn,
    søknadsfeltForESvarHof,
    søknadsfeltHof,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { omsorgspersonTilISøknadsfelt } from './omsorgsperson';
import { svalbardOppholdPeriodeTilISøknadsfelt } from './svalbardOppholdPeriode';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

export const barnISøknadsFormat = (
    barn: IBarnMedISøknad,
    søknad: ISøknad,
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord
): ISøknadIKontraktBarn => {
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
        svalbardOppholdPerioder,
        utenlandsperioder,
        // Nye felter under utvikling av EØS full
        eøsBarnetrygdsperioder,
        idNummer,
        triggetEøs,
        adresse,
        // Nytt
        erFosterbarn,
        erAdoptertFraUtland,
        pågåendeSøknadFraAnnetEøsLand,
        pågåendeSøknadHvilketLand,
        barnetrygdFraAnnetEøsland,
        mottarEllerMottokEøsBarnetrygd,
        erAsylsøker,
        andreForelderErDød,
        oppholderSegIInstitusjon,
        institusjonIUtland,
        institusjonsnavn,
        institusjonsadresse,
        institusjonspostnummer,
        institusjonOppholdStartdato,
        institusjonOppholdSluttdato,
        boddMindreEnn12MndINorge,
        planleggerÅBoINorge12Mnd,
        sammeForelderSomAnnetBarnMedId,
        søkersSlektsforhold,
        søkersSlektsforholdSpesifisering,
        borMedAndreForelder,
        borMedOmsorgsperson,
        harBoddPåSvalbard,
    } = barn;
    const fellesTekster = tekster.FELLES;
    const eøsTekster = tekster.EØS_FOR_BARN;
    const omBarnaTekster = tekster.OM_BARNA;
    const omBarnetTekster = tekster.OM_BARNET;
    const leggTilBarnModalTekster = tekster.FELLES.modaler.leggTilBarn;
    const velgBarnTekster = tekster.VELG_BARN;

    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
    const søknadsfeltForESvar = søknadsfeltForESvarHof(tilRestLocaleRecord);
    const nullableSøknadsfeltForESvar = nullableSøknadsfeltForESvarHof(tilRestLocaleRecord);

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

    const flettefelter = { barnetsNavn: navn };

    return {
        harEøsSteg: triggetEøs || søknad.søker.triggetEøs,
        // navn: søknadsfeltBarn('pdf.barn.navn.label', sammeVerdiAlleSpråk(navn), barn),
        navn: søknadsfelt(leggTilBarnModalTekster.barnetsNavnSubtittel, sammeVerdiAlleSpråk(navn)),
        // ident: søknadsfeltBarn(
        //     'pdf.barn.ident.label',
        //     ident ? sammeVerdiAlleSpråk(ident) : hentTekster('pdf.barn.ikke-oppgitt'),
        //     barn
        // ),
        ident: søknadsfelt(velgBarnTekster.foedselsnummerLabel, sammeVerdiAlleSpråk(ident)),
        // registrertBostedType: søknadsfeltBarn(
        //     'hvilkebarn.barn.bosted',
        //     sammeVerdiAlleSpråk(registertBostedVerdi()),
        //     barn
        // ),
        registrertBostedType: søknadsfelt(
            velgBarnTekster.registrertBostedLabel,
            sammeVerdiAlleSpråk(registertBostedVerdi())
        ),
        // alder: alder
        //     ? søknadsfeltBarn('pdf.barn.alder.label', hentTekster('felles.år', { alder }), barn)
        //     : null,
        alder: alder ? søknadsfelt(velgBarnTekster.alderLabel, sammeVerdiAlleSpråk(alder)) : null,
        svalbardOppholdPerioder: svalbardOppholdPerioder.map((svalbardOppholdPeriode, index) =>
            svalbardOppholdPeriodeTilISøknadsfelt({
                svalbardOppholdPeriode,
                periodeNummer: index + 1,
                tekster: fellesTekster.modaler.svalbardOpphold[PersonType.Barn],
                tilRestLocaleRecord,
            })
        ),
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
            })
        ),
        idNummer: idNummer.map(idnummerObj =>
            idNummerTilISøknadsfelt(
                tilRestLocaleRecord,
                idnummerObj,
                tekster.EØS_FOR_BARN.idNummerBarn,
                navn
            )
        ),
        andreForelder: andreForelder
            ? andreForelderTilISøknadsfelt(andreForelder, barn, tilRestLocaleRecord, tekster)
            : null,

        omsorgsperson: omsorgsperson
            ? omsorgspersonTilISøknadsfelt(omsorgsperson, barn, tilRestLocaleRecord, tekster)
            : null,
        spørsmål: {
            // Nytt
            adresse: adresse.svar
                ? søknadsfelt(
                      eøsTekster.hvorBorBarnet.sporsmal,
                      sammeVerdiAlleSpråkEllerUkjent(
                          tilRestLocaleRecord,
                          adresse.svar,
                          eøsTekster.hvorBorBarnet.checkboxLabel
                      ),
                      flettefelter
                  )
                : null,
            erFosterbarn: søknadsfeltForESvar(
                omBarnaTekster.hvemFosterbarn.sporsmal,
                erFosterbarn.svar
            ),
            oppholderSegIInstitusjon: søknadsfeltForESvar(
                omBarnaTekster.hvemInstitusjon.sporsmal,
                oppholderSegIInstitusjon.svar
            ),
            erAdoptertFraUtland: søknadsfeltForESvar(
                omBarnaTekster.adoptertFraUtlandet.sporsmal,
                erAdoptertFraUtland.svar
            ),
            pågåendeSøknadFraAnnetEøsLand: søknadsfeltForESvar(
                omBarnetTekster.paagaaendeSoeknadYtelse.sporsmal,
                pågåendeSøknadFraAnnetEøsLand.svar
            ),
            pågåendeSøknadHvilketLand: søknadsfelt(
                omBarnetTekster.hvilketLandYtelse.sporsmal,
                sammeVerdiAlleSpråkEllerUkjent(
                    tilRestLocaleRecord,
                    pågåendeSøknadHvilketLand.svar,
                    omBarnetTekster.hvilketLandYtelse.checkboxLabel
                ),
                flettefelter
            ),
            barnetrygdFraAnnetEøsland: søknadsfeltForESvar(
                omBarnetTekster.paagaaendeSoeknadYtelse.sporsmal,
                barnetrygdFraAnnetEøsland.svar
            ),
            mottarEllerMottokEøsBarnetrygd: søknadsfeltForESvar(
                omBarnetTekster.faarEllerHarFaattYtelseFraAnnetLand.sporsmal,
                mottarEllerMottokEøsBarnetrygd.svar
            ),
            erAsylsøker: søknadsfeltForESvar(omBarnaTekster.hvemAsyl.sporsmal, erAsylsøker.svar),
            andreForelderErDød: nullableSøknadsfeltForESvar(
                omBarnaTekster.hvemAvBarnaAvdoedPartner.sporsmal,
                andreForelderErDød.svar
            ),
            // Gammelt
            // ...spørmålISøknadsFormat(
            //     typetBarnSpørsmål,
            //     {
            //         navn: navn,
            //         barn: navn,
            //     },
            //     tekster
            // ),
            // [barnDataKeySpørsmål.institusjonOppholdSluttdato]: søknadsfeltBarn(
            //     språktekstIdFraSpørsmålId(OmBarnetSpørsmålsId.institusjonOppholdSluttdato),
            //     sammeVerdiAlleSpråkEllerUkjentSpråktekst(
            //         institusjonOppholdSluttdato.svar,
            //         omBarnetSpørsmålSpråkId['institusjon-opphold-ukjent-sluttdato']
            //     ),
            //     barn
            // ),
            // [barnDataKeySpørsmål.adresse]: søknadsfeltBarn(
            //     språktekstIdFraSpørsmålId(EøsBarnSpørsmålId.barnetsAdresse),
            //     sammeVerdiAlleSpråkEllerUkjentSpråktekst(
            //         adresse.svar,
            //         eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.barnetsAdresseVetIkke]
            //     ),
            //     barn
            // ),
        },
    };
};

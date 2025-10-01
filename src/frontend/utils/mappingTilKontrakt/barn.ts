import { IBarnMedISøknad } from '../../typer/barn';
import {
    ERegistrertBostedType,
    fjernNullVerdierFraSpørsmål,
    SpørsmålMapMedNullVerdier,
    TilRestLocaleRecord,
} from '../../typer/kontrakt/generelle';
import { ISøknadIKontraktBarn } from '../../typer/kontrakt/kontrakt';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknad } from '../../typer/søknad';

import { andreForelderTilISøknadsfelt } from './andreForelder';
import { tilIEøsBarnetrygsperiodeIKontraktFormat } from './eøsBarnetrygdsperiode';
import {
    nullableSøknadsfeltForESvarHof,
    sammeVerdiAlleSpråk,
    sammeVerdiAlleSpråkEllerUkjent,
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
        ident,
        navn,
        borMedSøker,
        alder,
        adressebeskyttelse,
        andreForelder,
        omsorgsperson,
        svalbardOppholdPerioder,
        utenlandsperioder,
        eøsBarnetrygdsperioder,
        idNummer,
        triggetEøs,
        adresse,
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

    const spørsmål: SpørsmålMapMedNullVerdier = {
        // Om barna tekster
        erFosterbarn: søknadsfeltForESvar(omBarnaTekster.hvemFosterbarn.sporsmal, erFosterbarn.svar),
        oppholderSegIInstitusjon: søknadsfeltForESvar(
            omBarnaTekster.hvemInstitusjon.sporsmal,
            oppholderSegIInstitusjon.svar
        ),
        erAdoptertFraUtland: søknadsfeltForESvar(omBarnaTekster.adoptertFraUtlandet.sporsmal, erAdoptertFraUtland.svar),
        harBoddPåSvalbard: nullableSøknadsfeltForESvar(
            omBarnaTekster.hvemBoddPaaSvalbard.sporsmal,
            harBoddPåSvalbard.svar
        ),
        erAsylsøker: søknadsfeltForESvar(omBarnaTekster.hvemAsyl.sporsmal, erAsylsøker.svar),
        andreForelderErDød: nullableSøknadsfeltForESvar(
            omBarnaTekster.hvemAvBarnaAvdoedPartner.sporsmal,
            andreForelderErDød.svar
        ),
        boddMindreEnn12MndINorge: nullableSøknadsfeltForESvar(
            omBarnaTekster.hvemOppholdUtenforNorge.sporsmal,
            boddMindreEnn12MndINorge.svar
        ),
        // Om barnet tekster
        pågåendeSøknadFraAnnetEøsLand: nullableSøknadsfeltForESvar(
            omBarnetTekster.paagaaendeSoeknadYtelse.sporsmal,
            pågåendeSøknadFraAnnetEøsLand.svar
        ),
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfelt(
                  omBarnetTekster.hvilketLandYtelse.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      pågåendeSøknadHvilketLand.svar,
                      omBarnetTekster.hvilketLandYtelse.checkboxLabel
                  ),
                  flettefelter
              )
            : null,
        barnetrygdFraAnnetEøsland: søknadsfeltForESvar(
            omBarnetTekster.paagaaendeSoeknadYtelse.sporsmal,
            barnetrygdFraAnnetEøsland.svar
        ),
        mottarEllerMottokEøsBarnetrygd: nullableSøknadsfeltForESvar(
            omBarnetTekster.faarEllerHarFaattYtelseFraAnnetLand.sporsmal,
            mottarEllerMottokEøsBarnetrygd.svar
        ),
        institusjonIUtland: søknadsfeltForESvar(
            omBarnetTekster.opplystInstitusjon,
            institusjonIUtland.svar,
            flettefelter
        ),
        institusjonsnavn: institusjonsnavn.svar
            ? søknadsfelt(omBarnetTekster.institusjonNavn.sporsmal, sammeVerdiAlleSpråk(institusjonsnavn.svar))
            : null,
        institusjonsadresse: institusjonsadresse.svar
            ? søknadsfelt(omBarnetTekster.institusjonAdresse.sporsmal, sammeVerdiAlleSpråk(institusjonsadresse.svar))
            : null,
        institusjonspostnummer: institusjonspostnummer.svar
            ? søknadsfelt(
                  omBarnetTekster.institusjonPostnummer.sporsmal,
                  sammeVerdiAlleSpråk(institusjonspostnummer.svar)
              )
            : null,
        institusjonOppholdStartdato: institusjonOppholdStartdato.svar
            ? søknadsfelt(
                  omBarnetTekster.institusjonStartdato.sporsmal,
                  sammeVerdiAlleSpråk(institusjonOppholdStartdato.svar)
              )
            : null,
        institusjonOppholdSluttdato: institusjonOppholdSluttdato.svar
            ? søknadsfelt(
                  omBarnetTekster.institusjonSluttdato.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      institusjonOppholdSluttdato.svar,
                      omBarnetTekster.institusjonSluttdato.checkboxLabel
                  )
              )
            : null,
        planleggerÅBoINorge12Mnd: nullableSøknadsfeltForESvar(
            omBarnetTekster.planlagtBoSammenhengendeINorge.sporsmal,
            planleggerÅBoINorge12Mnd.svar,
            flettefelter
        ),
        // EØS for barn tekster
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
        sammeForelderSomAnnetBarnMedId: sammeForelderSomAnnetBarnMedId.svar
            ? søknadsfelt(
                  eøsTekster.idNummerAndreForelder.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      sammeForelderSomAnnetBarnMedId.svar,
                      eøsTekster.idNummerAndreForelder.checkboxLabel,
                      { barnetsNavn: navn }
                  ),
                  flettefelter
              )
            : null,
        søkersSlektsforhold: søkersSlektsforhold.svar
            ? søknadsfelt(eøsTekster.slektsforhold.sporsmal, sammeVerdiAlleSpråk(søkersSlektsforhold.svar))
            : null,
        søkersSlektsforholdSpesifisering: søkersSlektsforholdSpesifisering.svar
            ? søknadsfelt(
                  eøsTekster.hvilkenRelasjon.sporsmal,
                  sammeVerdiAlleSpråk(søkersSlektsforholdSpesifisering.svar)
              )
            : null,
        borMedAndreForelder: nullableSøknadsfeltForESvar(
            eøsTekster.borMedAndreForelder.sporsmal,
            borMedAndreForelder.svar
        ),
        borMedOmsorgsperson: nullableSøknadsfeltForESvar(
            eøsTekster.borMedOmsorgsperson.sporsmal,
            borMedOmsorgsperson.svar
        ),
    };

    return {
        harEøsSteg: triggetEøs || søknad.søker.triggetEøs,
        navn: søknadsfelt(leggTilBarnModalTekster.barnetsNavnSubtittel, sammeVerdiAlleSpråk(navn)),
        ident: søknadsfelt(velgBarnTekster.foedselsnummerLabel, sammeVerdiAlleSpråk(ident)),
        registrertBostedType: søknadsfelt(
            velgBarnTekster.registrertBostedLabel,
            sammeVerdiAlleSpråk(registertBostedVerdi())
        ),
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
            idNummerTilISøknadsfelt(tilRestLocaleRecord, idnummerObj, tekster.EØS_FOR_BARN.idNummerBarn, navn)
        ),
        andreForelder: andreForelder
            ? andreForelderTilISøknadsfelt(andreForelder, barn, tilRestLocaleRecord, tekster)
            : null,

        omsorgsperson: omsorgsperson
            ? omsorgspersonTilISøknadsfelt(omsorgsperson, barn, tilRestLocaleRecord, tekster)
            : null,
        spørsmål: fjernNullVerdierFraSpørsmål(spørsmål),
    };
};

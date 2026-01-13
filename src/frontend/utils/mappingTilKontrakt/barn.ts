import {
    ERegistrertBostedType,
    fjernNullVerdierFraSpørsmål,
    SpørsmålMapMedNullVerdier,
    TilRestLocaleRecord,
} from '../../../common/typer/kontrakt/generelle';
import { ISøknadIKontraktBarn } from '../../../common/typer/kontrakt/kontrakt';
import { IBarnMedISøknad } from '../../typer/barn';
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
        borFastMedSøker,
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
        søkersSlektsforhold,
        søkersSlektsforholdSpesifisering,
        borMedAndreForelder,
        borMedOmsorgsperson,
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

    const spørsmål: SpørsmålMapMedNullVerdier = {
        // Om barna tekster
        erFosterbarn: søknadsfeltForESvar(omBarnaTekster.hvemFosterbarn.sporsmal, erFosterbarn.svar),
        oppholderSegIInstitusjon: søknadsfeltForESvar(
            omBarnaTekster.hvemInstitusjon.sporsmal,
            oppholderSegIInstitusjon.svar
        ),
        erAdoptertFraUtland: søknadsfeltForESvar(omBarnaTekster.adoptertFraUtlandet.sporsmal, erAdoptertFraUtland.svar),
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
        borFastMedSøker: nullableSøknadsfeltForESvar(
            omBarnetTekster.borBarnFastSammenMedDeg.sporsmal,
            borFastMedSøker.svar,
            { barnetsNavn: navn }
        ),
        pågåendeSøknadFraAnnetEøsLand: nullableSøknadsfeltForESvar(
            omBarnetTekster.paagaaendeSoeknadYtelse.sporsmal,
            pågåendeSøknadFraAnnetEøsLand.svar,
            { barnetsNavn: navn }
        ),
        pågåendeSøknadHvilketLand: pågåendeSøknadHvilketLand.svar
            ? søknadsfelt(
                  omBarnetTekster.hvilketLandYtelse.sporsmal,
                  sammeVerdiAlleSpråkEllerUkjent(
                      tilRestLocaleRecord,
                      pågåendeSøknadHvilketLand.svar,
                      omBarnetTekster.hvilketLandYtelse.checkboxLabel
                  ),
                  { barnetsNavn: navn }
              )
            : null,
        barnetrygdFraAnnetEøsland: søknadsfeltForESvar(
            omBarnetTekster.paagaaendeSoeknadYtelse.sporsmal,
            barnetrygdFraAnnetEøsland.svar,
            { barnetsNavn: navn }
        ),
        mottarEllerMottokEøsBarnetrygd: nullableSøknadsfeltForESvar(
            omBarnetTekster.faarEllerHarFaattYtelseFraAnnetLand.sporsmal,
            mottarEllerMottokEøsBarnetrygd.svar
        ),
        institusjonIUtland: søknadsfeltForESvar(omBarnetTekster.opplystInstitusjon, institusjonIUtland.svar, {
            barnetsNavn: navn,
        }),
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
            { barnetsNavn: navn }
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
                  { barnetsNavn: navn }
              )
            : null,
        søkersSlektsforhold: søkersSlektsforhold.svar
            ? søknadsfelt(eøsTekster.slektsforhold.sporsmal, sammeVerdiAlleSpråk(søkersSlektsforhold.svar), {
                  barnetsNavn: navn,
              })
            : null,
        søkersSlektsforholdSpesifisering: søkersSlektsforholdSpesifisering.svar
            ? søknadsfelt(
                  eøsTekster.hvilkenRelasjon.sporsmal,
                  sammeVerdiAlleSpråk(søkersSlektsforholdSpesifisering.svar),
                  { barnetsNavn: navn }
              )
            : null,
        borMedAndreForelder: nullableSøknadsfeltForESvar(
            eøsTekster.borMedAndreForelder.sporsmal,
            borMedAndreForelder.svar,
            { barnetsNavn: navn }
        ),
        borMedOmsorgsperson: nullableSøknadsfeltForESvar(
            eøsTekster.borMedOmsorgsperson.sporsmal,
            borMedOmsorgsperson.svar,
            { barnetsNavn: navn }
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

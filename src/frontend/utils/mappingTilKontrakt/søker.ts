import {
    filtrertSpørsmålUtenNull,
    SpørsmålMapMedNull,
    TilRestLocaleRecord,
} from '../../typer/kontrakt/generelle';
import { ISøknadKontraktSøker } from '../../typer/kontrakt/kontrakt';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknad } from '../../typer/søknad';
import { hentÅrsak, landkodeTilSpråk } from '../språk';

import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import {
    nullableSøknadsfeltForESvarHof,
    sammeVerdiAlleSpråk,
    søknadsfeltForESvarHof,
    søknadsfeltHof,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';
import { samboerISøknadKontraktFormat } from './samboer';
import { svalbardOppholdPeriodeTilISøknadsfelt } from './svalbardOppholdPeriode';
import { tidligereSamboerISøknadKontraktFormat } from './tidligereSamboer';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

export const søkerIKontraktFormat = (
    søknad: ISøknad,
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord
): ISøknadKontraktSøker => {
    const { søker, barnInkludertISøknaden } = søknad;
    const {
        navn,
        ident,
        sivilstand,
        statsborgerskap,
        adresse,
        utvidet,
        svalbardOppholdPerioder,
        utenlandsperioder,
        arbeidsperioderUtland,
        pensjonsperioderUtland,
        arbeidsperioderNorge,
        pensjonsperioderNorge,
        andreUtbetalingsperioder,
        idNummer,
        triggetEøs,
        borPåRegistrertAdresse,
        borPåSvalbard,
        værtINorgeITolvMåneder,
        planleggerÅBoINorgeTolvMnd,
        erAsylsøker,
        arbeidIUtlandet,
        mottarUtenlandspensjon,
        arbeidINorge,
        pensjonNorge,
        andreUtbetalinger,
    } = søker;

    const { spørsmål: utvidaSpørsmål, tidligereSamboere, nåværendeSamboer } = utvidet;

    const {
        årsak,
        separertEnkeSkilt,
        separertEnkeSkiltUtland,
        separertEnkeSkiltDato,
        harSamboerNå,
        hattAnnenSamboerForSøktPeriode,
    } = utvidaSpørsmål;

    const fellesTekster = tekster.FELLES;
    const omDegTekster = tekster.OM_DEG;
    const dinLivssituasjonTekster = tekster.DIN_LIVSSITUASJON;

    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);
    const søknadsfeltForESvar = søknadsfeltForESvarHof(tilRestLocaleRecord);
    const nullableSøknadsfeltForESvar = nullableSøknadsfeltForESvarHof(tilRestLocaleRecord);

    const spørsmål: SpørsmålMapMedNull = {
        // ordinær
        borPåRegistrertAdresse: søknadsfeltForESvar(
            omDegTekster.borPaaRegistrertAdresse.sporsmal,
            borPåRegistrertAdresse.svar
        ),
        borPåSvalbard: nullableSøknadsfeltForESvar(
            omDegTekster.borPaaSvalbard.sporsmal,
            borPåSvalbard.svar
        ),
        værtINorgeITolvMåneder: søknadsfeltForESvar(
            omDegTekster.vaertINorgeITolvMaaneder.sporsmal,
            værtINorgeITolvMåneder.svar
        ),
        planleggerÅBoINorgeTolvMnd: nullableSøknadsfeltForESvar(
            omDegTekster.planleggerAaBoINorgeTolvMnd.sporsmal,
            planleggerÅBoINorgeTolvMnd.svar
        ),
        erAsylsøker: søknadsfeltForESvar(
            dinLivssituasjonTekster.erAsylsoeker.sporsmal,
            erAsylsøker.svar
        ),
        arbeidIUtlandet: søknadsfeltForESvar(
            dinLivssituasjonTekster.arbeidUtenforNorge.sporsmal,
            arbeidIUtlandet.svar
        ),
        mottarUtenlandspensjon: søknadsfeltForESvar(
            dinLivssituasjonTekster.pensjonUtland.sporsmal,
            mottarUtenlandspensjon.svar
        ),
        arbeidINorge: nullableSøknadsfeltForESvar(
            tekster.EØS_FOR_SØKER.arbeidNorge.sporsmal,
            arbeidINorge.svar
        ),
        pensjonNorge: nullableSøknadsfeltForESvar(
            tekster.EØS_FOR_SØKER.pensjonNorge.sporsmal,
            pensjonNorge.svar
        ),
        andreUtbetalinger: nullableSøknadsfeltForESvar(
            tekster.EØS_FOR_SØKER.utbetalinger.sporsmal,
            andreUtbetalinger.svar
        ),
        // utvidet
        årsak: årsak.svar
            ? søknadsfelt(
                  dinLivssituasjonTekster.hvorforSoekerUtvidet.sporsmal,
                  hentÅrsak(årsak.svar, dinLivssituasjonTekster)
              )
            : null,
        separertEnkeSkilt: nullableSøknadsfeltForESvar(
            dinLivssituasjonTekster.separertEnkeSkiltUtland.sporsmal,
            separertEnkeSkilt.svar
        ),
        separertEnkeSkiltUtland: nullableSøknadsfeltForESvar(
            dinLivssituasjonTekster.separertEnkeSkiltUtland.sporsmal,
            separertEnkeSkiltUtland.svar
        ),
        separertEnkeSkiltDato: separertEnkeSkiltDato.svar
            ? søknadsfelt(
                  dinLivssituasjonTekster.separertEnkeSkiltDato.sporsmal,
                  sammeVerdiAlleSpråk(separertEnkeSkiltDato.svar)
              )
            : null,
        harSamboerNå: nullableSøknadsfeltForESvar(
            dinLivssituasjonTekster.harSamboerNaa.sporsmal,
            harSamboerNå.svar
        ),
        hattAnnenSamboerForSøktPeriode: nullableSøknadsfeltForESvar(
            dinLivssituasjonTekster.hattAnnenSamboerForSoektPeriode.sporsmal,
            hattAnnenSamboerForSøktPeriode.svar
        ),
    };

    return {
        harEøsSteg: triggetEøs || !!barnInkludertISøknaden.filter(barn => barn.triggetEøs).length,
        navn: søknadsfelt(omDegTekster.navn, sammeVerdiAlleSpråk(navn)),
        ident: søknadsfelt(omDegTekster.ident, sammeVerdiAlleSpråk(ident)),
        sivilstand: søknadsfelt(omDegTekster.sivilstatus, sammeVerdiAlleSpråk(sivilstand.type)),
        statsborgerskap: søknadsfelt(
            omDegTekster.statsborgerskap,
            verdiCallbackAlleSpråk(locale =>
                statsborgerskap.map(objekt => landkodeTilSpråk(objekt.landkode, locale))
            )
        ),
        adresse: søknadsfelt(omDegTekster.adresse, sammeVerdiAlleSpråk(adresse)),
        adressebeskyttelse: søker.adressebeskyttelse,
        spørsmål: filtrertSpørsmålUtenNull(spørsmål),
        svalbardOppholdPerioder: svalbardOppholdPerioder.map((periode, index) =>
            svalbardOppholdPeriodeTilISøknadsfelt({
                svalbardOppholdPeriode: periode,
                periodeNummer: index + 1,
                tekster: fellesTekster.modaler.svalbardOpphold[PersonType.Søker],
                tilRestLocaleRecord,
            })
        ),
        utenlandsperioder: utenlandsperioder.map((periode, index) =>
            utenlandsperiodeTilISøknadsfelt({
                utenlandperiode: periode,
                periodeNummer: index + 1,
                tekster: fellesTekster.modaler.utenlandsopphold[PersonType.Søker],
                tilRestLocaleRecord,
            })
        ),
        idNummer: idNummer.map(idnummerObj =>
            idNummerTilISøknadsfelt(
                tilRestLocaleRecord,
                idnummerObj,
                tekster.EØS_FOR_SØKER.idNummer
            )
        ),
        tidligereSamboere: tidligereSamboere.map(samboer =>
            tidligereSamboerISøknadKontraktFormat({
                tekster: fellesTekster.modaler.tidligereSamboere.søker,
                tilRestLocaleRecord,
                samboer,
            })
        ),
        nåværendeSamboer: nåværendeSamboer
            ? samboerISøknadKontraktFormat({
                  tekster: fellesTekster.modaler.tidligereSamboere.søker,
                  tilRestLocaleRecord,
                  samboer: nåværendeSamboer,
              })
            : null,
        arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.søker,
                personType: PersonType.Søker,
            })
        ),
        arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
            tilIArbeidsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.arbeidsperiode.søker,
                personType: PersonType.Søker,
            })
        ),
        pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: true,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.søker,
                personType: PersonType.Søker,
            })
        ),
        pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
            tilIPensjonsperiodeIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                gjelderUtlandet: false,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.pensjonsperiode.søker,
                personType: PersonType.Søker,
            })
        ),
        andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
            tilIAndreUtbetalingsperioderIKontraktFormat({
                periode,
                periodeNummer: index + 1,
                tilRestLocaleRecord,
                tekster: tekster.FELLES.modaler.andreUtbetalinger.søker,
                personType: PersonType.Søker,
            })
        ),
    };
};

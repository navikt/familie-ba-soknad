import { TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadKontraktSøker } from '../../typer/kontrakt/kontrakt';
import { PersonType } from '../../typer/personType';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknadSpørsmålMap } from '../../typer/spørsmål';
import { ISøknad } from '../../typer/søknad';
import { landkodeTilSpråk } from '../språk';

import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import {
    sammeVerdiAlleSpråk,
    spørmålISøknadsFormat,
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
        ...søkerSpørsmål
    } = søker;

    const { spørsmål: utvidaSpørsmål, tidligereSamboere, nåværendeSamboer } = utvidet;

    const fellesTekster = tekster.FELLES;
    const omDegTekster = tekster.OM_DEG;

    const søknadsfelt = søknadsfeltHof(tilRestLocaleRecord);

    const typetSøkerSpørsmål: ISøknadSpørsmålMap = søkerSpørsmål as unknown as ISøknadSpørsmålMap;
    const typetUtvidaSpørsmål: ISøknadSpørsmålMap = utvidaSpørsmål as unknown as ISøknadSpørsmålMap;

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
                tekster.EØS_FOR_BARN.idNummerAndreForelder
            )
        ),
        spørsmål: {
            ...spørmålISøknadsFormat(typetSøkerSpørsmål, undefined, tekster),
            ...spørmålISøknadsFormat(typetUtvidaSpørsmål, undefined, tekster),
        },
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

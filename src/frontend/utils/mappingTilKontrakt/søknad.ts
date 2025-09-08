import { ESvar } from '@navikt/familie-form-elements';

import {
    EøsSøkerSpørsmålId,
    eøsSøkerSpørsmålSpråkId,
} from '../../components/SøknadsSteg/EøsSteg/Søker/spørsmål';
import { OmBarnaDineSpørsmålId } from '../../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { IBarnMedISøknad } from '../../typer/barn';
import { LocaleType } from '../../typer/common';
import { ESivilstand, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../typer/kontrakt/kontrakt';
import { ISøker } from '../../typer/person';
import { PersonType } from '../../typer/personType';
import { LocaleRecordBlock, LocaleRecordString, PlainTekst } from '../../typer/sanity/sanity';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknadSpørsmålMap } from '../../typer/spørsmål';
import { ISøknad } from '../../typer/søknad';
import { erDokumentasjonRelevant } from '../dokumentasjon';
import {
    hentSivilstatusSpråkId,
    hentTekster,
    hentUformaterteTekster,
    landkodeTilSpråk,
} from '../språk';
import { jaNeiSvarTilSpråkId } from '../spørsmål';

import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { barnISøknadsFormat } from './barn';
import { dokumentasjonISøknadFormat } from './dokumentasjon';
import {
    sammeVerdiAlleSpråk,
    språktekstIdFraSpørsmålId,
    spørmålISøknadsFormat,
    søknadsfelt,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { idNummerTilISøknadsfelt } from './idNummer';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';
import { samboerISøknadKontraktFormat } from './samboer';
import { svalbardOppholdPeriodeTilISøknadsfelt } from './svalbardOppholdPeriode';
import { søkerIKontraktFormat } from './søker';
import { tidligereSamboerISøknadKontraktFormat } from './tidligereSamboer';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

const antallEøsSteg = (søker: ISøker, barnInkludertISøknaden: IBarnMedISøknad[]) => {
    const barnSomTriggerEøs = barnInkludertISøknaden.filter(barn => barn.triggetEøs);
    if (søker.triggetEøs) {
        return barnInkludertISøknaden.length + 1;
    } else if (barnSomTriggerEøs.length) {
        return barnSomTriggerEøs.length + 1;
    } else {
        return 0;
    }
};

export const dataISøknadKontraktFormat = (
    valgtSpråk: LocaleType,
    søknad: ISøknad,
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord,
    kontraktVersjon: number,
    plainTekst: PlainTekst
): ISøknadKontrakt => {
    const { søker } = søknad;

    // Raskeste måte å få tak i alle spørsmål minus de andre feltene på søker
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
        navn,
        ident,
        sivilstand,
        statsborgerskap,
        adresse,
        barn,
        utvidet,
        adressebeskyttelse,
        svalbardOppholdPerioder,
        utenlandsperioder,
        // Nye felter under utvikling av EØS full
        andreUtbetalingsperioder,
        arbeidsperioderNorge,
        arbeidsperioderUtland,
        pensjonsperioderNorge,
        pensjonsperioderUtland,
        triggetEøs,
        idNummer,
        // resterende felter, hvor alle må være av type ISøknadSpørsmål
        ...søkerSpørsmål
    } = søker;
    const fellesTekster = tekster.FELLES;
    const { spørsmål: utvidaSpørsmål, tidligereSamboere, nåværendeSamboer } = utvidet;
    const { barnInkludertISøknaden } = søknad;
    const typetSøkerSpørsmål: ISøknadSpørsmålMap = søkerSpørsmål as unknown as ISøknadSpørsmålMap;
    const typetUtvidaSpørsmål: ISøknadSpørsmålMap = utvidaSpørsmål as unknown as ISøknadSpørsmålMap;

    return {
        søknadstype: søknad.søknadstype,
        kontraktVersjon: kontraktVersjon,
        antallEøsSteg: antallEøsSteg(søker, barnInkludertISøknaden),
        søker: søkerIKontraktFormat(søknad, tekster, tilRestLocaleRecord),
        barn: barnInkludertISøknaden.map(barn =>
            barnISøknadsFormat(barn, søker, valgtSpråk, tekster, tilRestLocaleRecord)
        ),
        spørsmål: {
            erNoenAvBarnaFosterbarn: søknadsfelt(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn),
                sammeVerdiAlleSpråk(søknad.erNoenAvBarnaFosterbarn.svar)
            ),
            søktAsylForBarn: søknadsfelt(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.søktAsylForBarn),
                sammeVerdiAlleSpråk(søknad.søktAsylForBarn.svar)
            ),
            oppholderBarnSegIInstitusjon: søknadsfelt(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon),
                sammeVerdiAlleSpråk(søknad.oppholderBarnSegIInstitusjon.svar)
            ),
            barnOppholdtSegTolvMndSammenhengendeINorge: søknadsfelt(
                språktekstIdFraSpørsmålId(
                    OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge
                ),
                sammeVerdiAlleSpråk(søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar)
            ),
            erBarnAdoptertFraUtland: søknadsfelt(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland),
                sammeVerdiAlleSpråk(søknad.erBarnAdoptertFraUtland.svar)
            ),
            mottarBarnetrygdForBarnFraAnnetEøsland: søknadsfelt(
                språktekstIdFraSpørsmålId(
                    OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland
                ),
                sammeVerdiAlleSpråk(søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar)
            ),
            erAvdødPartnerForelder: søknadsfelt(
                språktekstIdFraSpørsmålId(søknad.erAvdødPartnerForelder.id),
                sammeVerdiAlleSpråk(søknad.erAvdødPartnerForelder.svar)
            ),
            harNoenAvBarnaBoddPåSvalbard: søknadsfelt(
                språktekstIdFraSpørsmålId(OmBarnaDineSpørsmålId.harNoenAvBarnaBoddPåSvalbard),
                sammeVerdiAlleSpråk(søknad.harNoenAvBarnaBoddPåSvalbard.svar)
            ),
            lestOgForståttBekreftelse: søknadsfelt(
                'forside.bekreftelsesboks.brødtekst',
                søknad.lestOgForståttBekreftelse
                    ? hentTekster('forside.bekreftelsesboks.erklæring.spm')
                    : sammeVerdiAlleSpråk(ESvar.NEI)
            ),
        },
        dokumentasjon: søknad.dokumentasjon
            .filter(dok => erDokumentasjonRelevant(dok))
            .map(dok =>
                dokumentasjonISøknadFormat(dok, tekster, tilRestLocaleRecord, søknad, plainTekst)
            ),
        teksterUtenomSpørsmål: {
            ...lokaleTekster(),
            ...teksterFraSanity(tekster, tilRestLocaleRecord),
        },
        originalSpråk: valgtSpråk,
    };
};

const lokaleTekster = (): Record<string, Record<LocaleType, string>> => {
    return [
        'hvilkebarn.barn.bosted.adressesperre',
        'ombarnet.fosterbarn',
        'ombarnet.institusjon',
        'ombarnet.opplystatbarnutlandopphold.info',
        'ombarnet.barnetrygd-eøs',
        'ombarnet.opplystBoddPaaSvalbard',
        'ombarnet.naarBoddPaaSvalbard',
        'omdeg.annensamboer.spm',
        'omdeg.personopplysninger.adressesperre.alert',
        'omdeg.personopplysninger.ikke-registrert.alert',
        'pdf.andreforelder.seksjonstittel',
        'pdf.hvilkebarn.seksjonstittel',
        'pdf.hvilkebarn.registrert-på-adresse',
        'pdf.hvilkebarn.ikke-registrert-på-adresse',
        'pdf.ombarnet.seksjonstittel',
        'pdf.omdeg.seksjonstittel',
        'pdf.bosted.seksjonstittel',
        'pdf.ombarna.seksjonstittel',
        'pdf.søker.seksjonstittel',
        'pdf.vedlegg.seksjonstittel',
        'pdf.vedlegg.lastet-opp-antall',
        'pdf.vedlegg.nummerering',
        'dokumentasjon.har-sendt-inn.spm',
        'dinlivssituasjon.sidetittel',
        'pdf.dinlivssituasjon.tidligeresamboer.seksjonstittel',
        'eøs-om-deg.sidetittel',
        'eøs-om-barn.sidetittel',
        ...Object.values(ESivilstand).map(hentSivilstatusSpråkId),
        ...Object.values(ESvar).map(jaNeiSvarTilSpråkId),
    ].reduce((map, tekstId) => ({ ...map, [tekstId]: hentUformaterteTekster(tekstId) }), {});
};

const teksterFraSanity = (
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord
): Record<string, Record<LocaleType, string>> => {
    return [tekster.OM_DEG.skjermetAdresse].reduce(
        (map, sanityDok: LocaleRecordBlock | LocaleRecordString) => ({
            ...map,
            [sanityDok.api_navn]: tilRestLocaleRecord(sanityDok, {}),
        }),
        {}
    );
};

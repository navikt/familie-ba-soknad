import { ESvar } from '@navikt/familie-form-elements';

import { avdødPartnerForelderSpørsmålDokument } from '../../components/SøknadsSteg/OmBarnaDine/utils';
import { IBarnMedISøknad } from '../../typer/barn';
import { LocaleType } from '../../typer/common';
import { ESivilstand, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../typer/kontrakt/kontrakt';
import { ISøker } from '../../typer/person';
import { LocaleRecordBlock, LocaleRecordString, PlainTekst } from '../../typer/sanity/sanity';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknad } from '../../typer/søknad';
import { erDokumentasjonRelevant } from '../dokumentasjon';
import { hentSivilstatusSpråkId, hentUformaterteTekster } from '../språk';
import { jaNeiSvarTilSpråkId } from '../spørsmål';

import { barnISøknadsFormat } from './barn';
import { dokumentasjonISøknadFormat } from './dokumentasjon';
import { sammeVerdiAlleSpråk, søknadsfeltHof } from './hjelpefunksjoner';
import { søkerIKontraktFormat } from './søker';

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
    const omBarnaTekster = tekster.OM_BARNA;
    const forsideTekster = tekster.FORSIDE;
    const { barnInkludertISøknaden } = søknad;

    const søknadsfeltForSanity = søknadsfeltHof(tilRestLocaleRecord);

    return {
        søknadstype: søknad.søknadstype,
        kontraktVersjon: kontraktVersjon,
        antallEøsSteg: antallEøsSteg(søknad.søker, barnInkludertISøknaden),
        søker: søkerIKontraktFormat(søknad, tekster, tilRestLocaleRecord),
        barn: barnInkludertISøknaden.map(barn =>
            barnISøknadsFormat(barn, søknad.søker, tekster, tilRestLocaleRecord)
        ),
        spørsmål: {
            erNoenAvBarnaFosterbarn: søknadsfeltForSanity(
                omBarnaTekster.fosterbarn.sporsmal,
                sammeVerdiAlleSpråk(søknad.erNoenAvBarnaFosterbarn.svar)
            ),
            søktAsylForBarn: søknadsfeltForSanity(
                omBarnaTekster.asyl.sporsmal,
                sammeVerdiAlleSpråk(søknad.søktAsylForBarn.svar)
            ),
            oppholderBarnSegIInstitusjon: søknadsfeltForSanity(
                omBarnaTekster.institusjon.sporsmal,
                sammeVerdiAlleSpråk(søknad.oppholderBarnSegIInstitusjon.svar)
            ),
            barnOppholdtSegTolvMndSammenhengendeINorge: søknadsfeltForSanity(
                omBarnaTekster.sammenhengendeOppholdINorge.sporsmal,
                sammeVerdiAlleSpråk(søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar)
            ),
            erBarnAdoptertFraUtland: søknadsfeltForSanity(
                omBarnaTekster.adoptertFraUtlandet.sporsmal,
                sammeVerdiAlleSpråk(søknad.erBarnAdoptertFraUtland.svar)
            ),
            mottarBarnetrygdForBarnFraAnnetEøsland: søknadsfeltForSanity(
                omBarnaTekster.soektYtelseEuEoes.sporsmal,
                sammeVerdiAlleSpråk(søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar)
            ),
            erAvdødPartnerForelder: søknadsfeltForSanity(
                avdødPartnerForelderSpørsmålDokument(søknad, omBarnaTekster).sporsmal,
                sammeVerdiAlleSpråk(søknad.erAvdødPartnerForelder.svar)
            ),
            harNoenAvBarnaBoddPåSvalbard: søknadsfeltForSanity(
                omBarnaTekster.boddPaaSvalbard.sporsmal,
                sammeVerdiAlleSpråk(søknad.harNoenAvBarnaBoddPåSvalbard.svar)
            ),
            lestOgForståttBekreftelse: søknadsfeltForSanity(
                forsideTekster.bekreftelsesboksBroedtekst,
                søknad.lestOgForståttBekreftelse
                    ? tilRestLocaleRecord(forsideTekster.bekreftelsesboksErklaering)
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

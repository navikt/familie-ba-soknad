import { ESvar } from '@navikt/familie-form-elements';

import { avdødPartnerForelderSpørsmålDokument } from '../../components/SøknadsSteg/OmBarnaDine/utils';
import { IBarnMedISøknad } from '../../typer/barn';
import { LocaleType } from '../../typer/common';
import { ESivilstand, TilRestLocaleRecord } from '../../typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../typer/kontrakt/kontrakt';
import { ISøker } from '../../typer/person';
import {
    ESanitySivilstandApiKey,
    LocaleRecordBlock,
    LocaleRecordString,
    PlainTekst,
} from '../../typer/sanity/sanity';
import { ITekstinnhold } from '../../typer/sanity/tekstInnhold';
import { ISøknad } from '../../typer/søknad';
import { erDokumentasjonRelevant } from '../dokumentasjon';
import { sivilstandTilSanitySivilstandApiKey } from '../språk';
import { jaNeiSvarTilSpråkIdForSanity } from '../spørsmål';

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
    const fellesTekster = tekster.FELLES;
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
            ...Object.values(ESivilstand).reduce(
                (map, sivilstand) => ({
                    ...map,
                    [ESanitySivilstandApiKey[ESivilstand[sivilstand]]]: tilRestLocaleRecord(
                        fellesTekster.frittståendeOrd[
                            sivilstandTilSanitySivilstandApiKey(sivilstand)
                        ]
                    ),
                }),
                {}
            ),
            ...teksterFraSanity(tekster, tilRestLocaleRecord),
        },
        originalSpråk: valgtSpråk,
    };
};

// const lokaleTekster = (): Record<string, Record<LocaleType, string>> => {
//     return [
//         'hvilkebarn.barn.bosted.adressesperre',
//         'ombarnet.fosterbarn',
//         'ombarnet.institusjon',
//         'ombarnet.opplystatbarnutlandopphold.info',
//         'ombarnet.barnetrygd-eøs',
//         'ombarnet.opplystBoddPaaSvalbard',
//         'ombarnet.naarBoddPaaSvalbard',
//         'omdeg.annensamboer.spm',
//         'omdeg.personopplysninger.adressesperre.alert',
//         'omdeg.personopplysninger.ikke-registrert.alert',
//         'pdf.andreforelder.seksjonstittel',
//         'pdf.hvilkebarn.seksjonstittel',
//         'pdf.hvilkebarn.registrert-på-adresse',
//         'pdf.hvilkebarn.ikke-registrert-på-adresse',
//         'pdf.ombarnet.seksjonstittel',
//         'pdf.omdeg.seksjonstittel',
//         'pdf.bosted.seksjonstittel',
//         'pdf.ombarna.seksjonstittel',
//         'pdf.søker.seksjonstittel',
//         'pdf.vedlegg.seksjonstittel',
//         'pdf.vedlegg.lastet-opp-antall',
//         'pdf.vedlegg.nummerering',
//         'dokumentasjon.har-sendt-inn.spm',
//         'dinlivssituasjon.sidetittel',
//         'pdf.dinlivssituasjon.tidligeresamboer.seksjonstittel',
//         'eøs-om-deg.sidetittel',
//         'eøs-om-barn.sidetittel',
//         ...Object.values(ESivilstand).map(hentSivilstatusSpråkId),
//         ...Object.values(ESvar).map(jaNeiSvarTilSpråkId),
//     ].reduce((map, tekstId) => ({ ...map, [tekstId]: hentUformaterteTekster(tekstId) }), {});
// };

const teksterFraSanity = (
    tekster: ITekstinnhold,
    tilRestLocaleRecord: TilRestLocaleRecord
): Record<string, Record<LocaleType, string>> => {
    return [
        tekster.VELG_BARN.registrertMedAdressesperre,
        tekster.OM_BARNET.opplystFosterbarn,
        tekster.OM_BARNET.opplystInstitusjon,
        tekster.OM_BARNET.opplystBarnOppholdUtenforNorge,
        tekster.OM_BARNET.opplystFaarHarFaattEllerSoektYtelse,
        tekster.OM_BARNET.opplystBoddPaaSvalbard,
        tekster.OM_BARNET.naarBoddPaaSvalbard.sporsmal,
        tekster.DIN_LIVSSITUASJON.hattAnnenSamboerForSoektPeriode.sporsmal,
        tekster.OM_DEG.soekerAdressesperre,
        tekster.OM_DEG.ikkeRegistrertAdresse,
        tekster.OM_BARNET.barnetsAndreForelder,
        tekster.VELG_BARN.velgBarnTittel,
        tekster.VELG_BARN.registrertPaaAdressenDin,
        tekster.VELG_BARN.ikkeRegistrertPaaAdressenDin,
        tekster.OM_BARNET.omBarnetTittel,
        tekster.OM_DEG.omDegTittel,
        tekster.OM_BARNET.bosted,
        tekster.OM_BARNA.omBarnaTittel,
        tekster.FELLES.frittståendeOrd.soeker,
        tekster.FELLES.frittståendeOrd.vedlegg,
        tekster.DOKUMENTASJON.sendtInnTidligere,
        tekster.DIN_LIVSSITUASJON.dinLivssituasjonTittel,
        tekster.EØS_FOR_SØKER.eoesForSoekerTittel,
        tekster.EØS_FOR_BARN.eoesForBarnTittel,
        tekster.OM_DEG.skjermetAdresse,
        ...Object.values(ESvar).map(svar =>
            jaNeiSvarTilSpråkIdForSanity(svar, tekster.FELLES.frittståendeOrd)
        ),
    ].reduce(
        (map, sanityDok: LocaleRecordBlock | LocaleRecordString) => ({
            ...map,
            [sanityDok.api_navn]: tilRestLocaleRecord(sanityDok, {}),
        }),
        {}
    );
};

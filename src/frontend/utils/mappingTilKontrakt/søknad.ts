import { ESvar } from '@navikt/familie-form-elements';

import { ESivilstand, TilRestLocaleRecord } from '../../../common/typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../../common/typer/kontrakt/kontrakt';
import { avdødPartnerForelderSpørsmålDokument } from '../../components/SøknadsSteg/OmBarnaDine/utils';
import { IBarnMedISøknad } from '../../typer/barn';
import { LocaleType } from '../../typer/common';
import { ISøker } from '../../typer/person';
import { ESanitySivilstandApiKey, LocaleRecordBlock, LocaleRecordString, PlainTekst } from '../../typer/sanity/sanity';
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
        barn: barnInkludertISøknaden.map(barn => barnISøknadsFormat(barn, søknad, tekster, tilRestLocaleRecord)),
        lestOgForståttBekreftelse: søknad.lestOgForståttBekreftelse,
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
            lestOgForståttBekreftelse: søknadsfeltForSanity(
                forsideTekster.bekreftelsesboksBroedtekst,
                søknad.lestOgForståttBekreftelse
                    ? tilRestLocaleRecord(forsideTekster.bekreftelsesboksErklaering)
                    : sammeVerdiAlleSpråk(ESvar.NEI)
            ),
        },
        dokumentasjon: søknad.dokumentasjon
            .filter(dok => erDokumentasjonRelevant(dok))
            .map(dok => dokumentasjonISøknadFormat(dok, tekster, tilRestLocaleRecord, søknad, plainTekst)),
        teksterUtenomSpørsmål: {
            ...Object.values(ESivilstand).reduce(
                (map, sivilstand) => ({
                    ...map,
                    [ESanitySivilstandApiKey[ESivilstand[sivilstand]]]: tilRestLocaleRecord(
                        fellesTekster.frittståendeOrd[sivilstandTilSanitySivilstandApiKey(sivilstand)]
                    ),
                }),
                {}
            ),
            ...[
                tekster.OM_DEG.omDegTittel,
                tekster.OM_DEG.soekerAdressesperre,
                tekster.OM_DEG.ikkeRegistrertAdresse,
                tekster.OM_DEG.skjermetAdresse,
                tekster.DIN_LIVSSITUASJON.dinLivssituasjonTittel,
                tekster.VELG_BARN.registrertMedAdressesperre,
                tekster.VELG_BARN.velgBarnTittel,
                tekster.VELG_BARN.registrertPaaAdressenDin,
                tekster.VELG_BARN.ikkeRegistrertPaaAdressenDin,
                tekster.OM_BARNA.omBarnaTittel,
                tekster.OM_BARNET.opplystFosterbarn,
                tekster.OM_BARNET.opplystInstitusjon,
                tekster.OM_BARNET.opplystBarnOppholdUtenforNorge,
                tekster.OM_BARNET.opplystFaarHarFaattEllerSoektYtelse,
                tekster.OM_BARNET.barnetsAndreForelder,
                tekster.OM_BARNET.omBarnetTittel,
                tekster.OM_BARNET.bosted,
                tekster.EØS_FOR_BARN.eoesForBarnTittel,
                tekster.FELLES.frittståendeOrd.soeker,
                tekster.FELLES.frittståendeOrd.vedlegg,
                tekster.FELLES.modaler.tidligereSamboere.søker.oppsummeringstittel,
                tekster.DOKUMENTASJON.sendtInnTidligere,
                tekster.DOKUMENTASJON.lastetOppAntall,
                tekster.DOKUMENTASJON.vedleggXavY,
                tekster.DOKUMENTASJON.listeOverVedlegg,
                tekster.EØS_FOR_SØKER.eoesForSoekerTittel,
                ...Object.values(ESvar).map(svar => jaNeiSvarTilSpråkIdForSanity(svar, tekster.FELLES.frittståendeOrd)),
            ].reduce(
                (map, sanityDok: LocaleRecordBlock | LocaleRecordString) => ({
                    ...map,
                    [sanityDok.api_navn]: tilRestLocaleRecord(sanityDok, {
                        barnetsNavn: '{navn}',
                        antall: '{antall}',
                        totalAntall: '{totalAntall}',
                    }),
                }),
                {}
            ),
            'hattAnnenSamboerForSoektPeriode.sporsmal': tilRestLocaleRecord(
                tekster.DIN_LIVSSITUASJON.hattAnnenSamboerForSoektPeriode.sporsmal
            ),
        },
        originalSpråk: valgtSpråk,
    };
};

import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { OmBarnaDineSpørsmålId } from '../../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { ESivilstand } from '../../typer/kontrakt/generelle';
import { ISøknadKontrakt } from '../../typer/kontrakt/v6';
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
import { barnISøknadsFormat } from './barn';
import { dokumentasjonISøknadFormat } from './dokumentasjon';
import {
    sammeVerdiAlleSpråk,
    språktekstIdFraSpørsmålId,
    spørmålISøknadsFormat,
    søknadsfelt,
    verdiCallbackAlleSpråk,
} from './hjelpefunksjoner';
import { samboerISøknadKontraktFormat } from './samboer';
import { tidligereSamboerISøknadKontraktFormat } from './tidligereSamboer';
import { utenlandsperiodeTilISøknadsfelt } from './utenlandsperiode';

export const dataISøknadKontraktFormat = (
    valgtSpråk: LocaleType,
    søknad: ISøknad
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
        nåværendeSamboer,
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
    const { spørsmål: utvidaSpørsmål, tidligereSamboere } = utvidet;
    const { barnInkludertISøknaden } = søknad;
    const typetSøkerSpørsmål: ISøknadSpørsmålMap = søkerSpørsmål as unknown as ISøknadSpørsmålMap;
    const typetUtvidaSpørsmål: ISøknadSpørsmålMap = utvidaSpørsmål as unknown as ISøknadSpørsmålMap;

    return {
        søknadstype: søknad.søknadstype,
        søker: {
            navn: søknadsfelt('pdf.søker.navn.label', sammeVerdiAlleSpråk(søker.navn)),
            ident: søknadsfelt('pdf.søker.ident.label', sammeVerdiAlleSpråk(søker.ident)),
            sivilstand: søknadsfelt(
                'pdf.søker.sivilstand.label',
                sammeVerdiAlleSpråk(søker.sivilstand.type)
            ),
            statsborgerskap: søknadsfelt(
                'pdf.søker.statsborgerskap.label',
                verdiCallbackAlleSpråk(locale =>
                    søker.statsborgerskap.map(objekt => landkodeTilSpråk(objekt.landkode, locale))
                )
            ),
            adresse: søknadsfelt(
                'pdf.søker.adresse.label',
                sammeVerdiAlleSpråk(søker.adresse ?? {})
            ),
            utenlandsperioder: utenlandsperioder.map((periode, index) =>
                utenlandsperiodeTilISøknadsfelt(periode, index + 1)
            ),
            spørsmål: {
                ...spørmålISøknadsFormat(typetSøkerSpørsmål),
                ...spørmålISøknadsFormat(typetUtvidaSpørsmål),
            },
            tidligereSamboere: tidligereSamboere.map(tidligereSamboerISøknadKontraktFormat),
            nåværendeSamboer: nåværendeSamboer
                ? samboerISøknadKontraktFormat(nåværendeSamboer)
                : null,
        },
        barn: barnInkludertISøknaden.map(barn => barnISøknadsFormat(barn)),
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
            lestOgForståttBekreftelse: søknadsfelt(
                'forside.bekreftelsesboks.brødtekst',
                søknad.lestOgForståttBekreftelse
                    ? hentTekster('forside.bekreftelsesboks.erklæring.spm')
                    : sammeVerdiAlleSpråk(ESvar.NEI)
            ),
        },
        dokumentasjon: søknad.dokumentasjon
            .filter(dok => erDokumentasjonRelevant(dok))
            .map(dok => dokumentasjonISøknadFormat(dok)),
        teksterUtenomSpørsmål: [
            'hvilkebarn.barn.bosted.adressesperre',
            'ombarnet.fosterbarn',
            'ombarnet.institusjon',
            'ombarnet.opplystatbarnutlandopphold.info',
            'ombarnet.barnetrygd-eøs',
            'omdeg.annensamboer.spm',
            'pdf.andreforelder.seksjonstittel',
            'pdf.hvilkebarn.seksjonstittel',
            'pdf.hvilkebarn.registrert-på-adresse',
            'pdf.hvilkebarn.ikke-registrert-på-adresse',
            'pdf.ombarnet.seksjonstittel',
            'pdf.omdeg.seksjonstittel',
            'pdf.bosted.seksjonstittel',
            'pdf.ombarna.seksjonstittel',
            'pdf.søker-for-tidsrom.seksjonstittel',
            'pdf.søker.seksjonstittel',
            'pdf.vedlegg.seksjonstittel',
            'pdf.vedlegg.lastet-opp-antall',
            'pdf.vedlegg.nummerering',
            'dokumentasjon.har-sendt-inn.spm',
            'dinlivssituasjon.sidetittel',
            'pdf.dinlivssituasjon.tidligeresamboer.seksjonstittel',
            ...Object.values(ESivilstand).map(hentSivilstatusSpråkId),
            ...Object.values(ESvar).map(jaNeiSvarTilSpråkId),
        ].reduce((map, tekstId) => ({ ...map, [tekstId]: hentUformaterteTekster(tekstId) }), {}),
        originalSpråk: valgtSpråk,
    };
};

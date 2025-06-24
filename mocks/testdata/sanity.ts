import { ESanitySteg } from '../../src/frontend/typer/sanity/sanity';
import {
    BeskrivelseSanityApiNavn,
    TittelSanityApiNavn,
} from '../../src/frontend/typer/dokumentasjon';

const frittståendeOrdTekstinnhold = {
    i: lagLocaleRecordString(),
    utenfor: lagLocaleRecordString(),
    barn: lagLocaleRecordString(),
    navn: lagLocaleRecordString(),
    utlandet: lagLocaleRecordString(),
    norge: lagLocaleRecordString(),
    ja: lagLocaleRecordString(),
    nei: lagLocaleRecordString(),
    jegVetIkke: lagLocaleRecordString(),
    barnetrygd: lagLocaleRecordString(),
    skjult: lagLocaleRecordString(),
    av: lagLocaleRecordString(),
    steg: lagLocaleRecordString(),
    visAlleSteg: lagLocaleRecordString(),
    skjulAlleSteg: lagLocaleRecordString(),
    fra: lagLocaleRecordString(),
    utenlandsopphold: lagLocaleRecordString(),
    arbeidsperioder: lagLocaleRecordString(),
    pensjonsperioder: lagLocaleRecordString(),
    tidligereSamboere: lagLocaleRecordString(),
    barnetrygdperioder: lagLocaleRecordString(),
    utbetalingsperioder: lagLocaleRecordString(),
    vedlegg: lagLocaleRecordString(),
    vedleggMedFeil: lagLocaleRecordString(),
    slipp: lagLocaleRecordString(),
    eller: lagLocaleRecordString(),
    og: lagLocaleRecordString(),
};

const navigasjonTekstinnhold = {
    startKnapp: lagLocaleRecordString(),
    fortsettKnapp: lagLocaleRecordString(),
    startPaaNyttKnapp: lagLocaleRecordString(),
    duMaaRetteOppFoelgende: lagLocaleRecordString(),
    avbrytSoeknad: lagLocaleRecordString(),
    tilbakeKnapp: lagLocaleRecordString(),
    gaaVidereKnapp: lagLocaleRecordString(),
    sendSoeknadKnapp: lagLocaleRecordString(),
    slettSoeknadKnapp: lagLocaleRecordString(),
    fortsettSenereKnapp: lagLocaleRecordString(),
};

const formateringsfeilmeldingerTekstinnhold = {
    ugyldigIDnummer: lagLocaleRecordString(),
    ugyldigFoedselsnummer: lagLocaleRecordString(),
    ugyldigRelasjon: lagLocaleRecordString(),
    ugyldigPostnummer: lagLocaleRecordString(),
    ugyldigDato: lagLocaleRecordString(),
    datoKanIkkeVaereFremITid: lagLocaleRecordString(),
    datoKanIkkeVaereDagensDatoEllerFremITid: lagLocaleRecordString(),
    periodeAvsluttesForTidlig: lagLocaleRecordString(),
    datoKanIkkeVaereTilbakeITid: lagLocaleRecordString(),
    datoKanIkkeVaere12MndTilbake: lagLocaleRecordString(),
    ugyldigManed: lagLocaleRecordString(),
    datoErForForsteGyldigeTidspunkt: lagLocaleRecordString(),
    datoErEtterSisteGyldigeTidspunkt: lagLocaleRecordString(),
    datoKanIkkeVareIFortid: lagLocaleRecordString(),
    datoKanIkkeVareIFremtid: lagLocaleRecordString(),
};

const forsideTekstinnhold = {
    bekreftelsesboksTittel: lagLocaleRecordString(),
    bekreftelsesboksBroedtekst: lagLocaleRecordBlock(),
    bekreftelsesboksErklaering: lagLocaleRecordString(),
    bekreftelsesboksFeilmelding: lagLocaleRecordString(),
    soeknadstittelBarnetrygd: lagLocaleRecordBlock(),
    veilederHei: lagLocaleRecordBlock(),
    veilederIntro: lagLocaleRecordBlock(),
    foerDuSoekerTittel: lagLocaleRecordBlock(),
    foerDuSoeker: lagLocaleRecordBlock(),
    informasjonOmPlikter: lagLocaleRecordBlock(),
    informasjonOmPlikterTittel: lagLocaleRecordBlock(),
    informasjonOmPersonopplysninger: lagLocaleRecordBlock(),
    informasjonOmPersonopplysningerTittel: lagLocaleRecordBlock(),
    informasjonOmLagringAvSvar: lagLocaleRecordBlock(),
    informasjonOmLagringAvSvarTittel: lagLocaleRecordBlock(),
    utvidetBarnetrygdAlert: lagLocaleRecordBlock(),
    soekerDuUtvidet: lagSanitySpørsmålDokument(),
    mellomlagretAlert: lagLocaleRecordBlock(),
};

const omDegTekstinnhold = {
    omDegTittel: lagLocaleRecordBlock(),
    omDegGuide: lagLocaleRecordBlock(),
    skjermetAdresse: lagLocaleRecordString(),
    borPaaRegistrertAdresse: lagSanitySpørsmålDokument(),
    vaertINorgeITolvMaaneder: lagSanitySpørsmålDokument(),
    planleggerAaBoINorgeTolvMnd: lagSanitySpørsmålDokument(),
    adresse: lagLocaleRecordString(),
    ident: lagLocaleRecordString(),
    sivilstatus: lagLocaleRecordString(),
    statsborgerskap: lagLocaleRecordString(),
    ikkeRegistrertAdresse: lagLocaleRecordString(),
    soekerAdressesperre: lagLocaleRecordString(),
};

const dinLivssituasjonTekstinnhold = {
    dinLivssituasjonTittel: lagLocaleRecordBlock(),
    dinLivssituasjonGuide: lagLocaleRecordBlock(),
    hvorforSoekerUtvidet: lagSanitySpørsmålDokument(),
    separertEnkeSkilt: lagSanitySpørsmålDokument(),
    separertEnkeSkiltUtland: lagSanitySpørsmålDokument(),
    separertEnkeSkiltDato: lagSanitySpørsmålDokument(),
    harSamboerNaa: lagSanitySpørsmålDokument(),
    harSamboerNaaGift: lagSanitySpørsmålDokument(),
    erAsylsoeker: lagSanitySpørsmålDokument(),
    arbeidUtenforNorge: lagSanitySpørsmålDokument(),
    pensjonUtland: lagSanitySpørsmålDokument(),
    samboersNavn: lagSanitySpørsmålDokument(),
    hattAnnenSamboerForSoektPeriode: lagSanitySpørsmålDokument(),

    /* Årsak valgalternativ */
    valgalternativAarsakPlaceholder: lagLocaleRecordString(),
    valgalternativSeparert: lagLocaleRecordString(),
    valgalternativSkilt: lagLocaleRecordString(),
    valgalternativBruddSamboer: lagLocaleRecordString(),
    valgalternativBoddAlene: lagLocaleRecordString(),
    valgalternativEnkeEnkemann: lagLocaleRecordString(),
    valgalternativFengselVaretekt: lagLocaleRecordString(),
    valgalternativBruddGift: lagLocaleRecordString(),
    valgalternativForsvunnet: lagLocaleRecordString(),
    valgalternativForvaring: lagLocaleRecordString(),
    valgalternativPsykiskHelsevern: lagLocaleRecordString(),
};

const velgBarnTekstinnhold = {
    velgBarnTittel: lagLocaleRecordBlock(),
    velgBarnGuide: lagLocaleRecordBlock(),
    soekeForUregistrerteBarn: lagLocaleRecordBlock(),
    alderLabel: lagLocaleRecordBlock(),
    aar: lagLocaleRecordBlock(),
    registrertBostedLabel: lagLocaleRecordBlock(),
    soekOmYtelseForBarnetSjekkboks: lagLocaleRecordBlock(),
    foedselsnummerLabel: lagLocaleRecordBlock(),
    navnErstatterForAdressesperre: lagLocaleRecordBlock(),
    maaVelgeEtBarnForAaGaaVidere: lagLocaleRecordBlock(),
    registrertMedAdressesperre: lagLocaleRecordBlock(),
    registrertPaaAdressenDin: lagLocaleRecordBlock(),
    ikkeRegistrertPaaAdressenDin: lagLocaleRecordBlock(),
};

const omBarnetTekstinnhold = {
    omBarnetTittel: lagLocaleRecordBlock(),
    omBarnetTittelUtenFlettefelt: lagLocaleRecordBlock(),
    omBarnetGuide: lagLocaleRecordBlock(),
    barnetsAndreForelder: lagLocaleRecordString(),
    opplystFosterbarn: lagLocaleRecordBlock(),
    opplystInstitusjon: lagLocaleRecordBlock(),
    institusjonIUtlandetCheckbox: lagLocaleRecordBlock(),
    institusjonNavn: lagSanitySpørsmålDokument(),
    institusjonAdresse: lagSanitySpørsmålDokument(),
    institusjonPostnummer: lagSanitySpørsmålDokument(),
    institusjonStartdato: lagSanitySpørsmålDokument(),
    institusjonSluttdato: lagSanitySpørsmålDokument(),
    institusjonUkjentSluttCheckbox: lagLocaleRecordBlock(),
    opplystBarnOppholdUtenforNorge: lagLocaleRecordBlock(),
    planlagtBoSammenhengendeINorge: lagSanitySpørsmålDokument(),
    opplystFaarHarFaattEllerSoektYtelse: lagLocaleRecordBlock(),
    paagaaendeSoeknadYtelse: lagSanitySpørsmålDokument(),
    hvilketLandYtelse: lagSanitySpørsmålDokument(),
    svaralternativSammeSomAnnenForelder: lagLocaleRecordBlock(),
    svaralternativAnnenForelder: lagLocaleRecordBlock(),
    hvemErBarnSinAndreForelder: lagSanitySpørsmålDokument(),
    navnAndreForelder: lagSanitySpørsmålDokument(),
    foedselsnummerDnummerAndreForelder: lagSanitySpørsmålDokument(),
    foedselsdatoAndreForelder: lagSanitySpørsmålDokument(),
    arbeidUtenforNorgeAndreForelder: lagSanitySpørsmålDokument(),
    pensjonUtlandAndreForelderGjenlevende: lagSanitySpørsmålDokument(),
    pensjonUtlandAndreForelder: lagSanitySpørsmålDokument(),
    boddSammenMedAndreForelder: lagSanitySpørsmålDokument(),
    naarFlyttetFraAndreForelder: lagSanitySpørsmålDokument(),
    bosted: lagLocaleRecordString(),
    bostedInfo: lagLocaleRecordBlock(),
    borBarnFastSammenMedDeg: lagSanitySpørsmålDokument(),
    deltBosted: lagSanitySpørsmålDokument(),
    faarEllerHarFaattYtelseFraAnnetLand: lagSanitySpørsmålDokument(),
    arbeidUtenforNorgeAndreForelderGjenlevende: lagSanitySpørsmålDokument(),
};

const omBarnaTekstinnhold = {
    omBarnaTittel: lagLocaleRecordBlock(),
    omBarnaGuide: lagLocaleRecordBlock(),
    fosterbarn: lagSanitySpørsmålDokument(),
    hvemFosterbarn: lagSanitySpørsmålDokument(),
    institusjon: lagSanitySpørsmålDokument(),
    hvemInstitusjon: lagSanitySpørsmålDokument(),
    adoptertFraUtlandet: lagSanitySpørsmålDokument(),
    hvemAdoptertFraUtlandet: lagSanitySpørsmålDokument(),
    asyl: lagSanitySpørsmålDokument(),
    hvemAsyl: lagSanitySpørsmålDokument(),
    sammenhengendeOppholdINorge: lagSanitySpørsmålDokument(),
    hvemOppholdUtenforNorge: lagSanitySpørsmålDokument(),
    soektYtelseEuEoes: lagSanitySpørsmålDokument(),
    hvemSoektYtelse: lagSanitySpørsmålDokument(),
    oppgittEnkeEnkemann: lagSanitySpørsmålDokument(),
    folkeregistrertEnkeEnkemann: lagSanitySpørsmålDokument(),
    folkeregistrertGjenlevende: lagSanitySpørsmålDokument(),
    hvemAvBarnaAvdoedPartner: lagSanitySpørsmålDokument(),
};

const eøsForSøkerTekstinnhold = {
    eoesForSoekerTittel: lagLocaleRecordBlock(),
    eosForSokerGuide: lagLocaleRecordBlock(),
    idNummer: lagSanitySpørsmålDokument(),
    hvorBor: lagSanitySpørsmålDokument(),
    arbeidNorge: lagSanitySpørsmålDokument(),
    pensjonNorge: lagSanitySpørsmålDokument(),
    utbetalinger: lagSanitySpørsmålDokument(),
};

const eøsForBarnTekstinnhold = {
    eoesForBarnTittel: lagLocaleRecordBlock(),
    eoesForBarnTittelUtenFlettefelt: lagLocaleRecordBlock(),
    eosForBarnGuide: lagLocaleRecordBlock(),
    idNummerBarn: lagSanitySpørsmålDokument(),
    slektsforhold: lagSanitySpørsmålDokument(),
    hvilkenRelasjon: lagSanitySpørsmålDokument(),
    borMedAndreForelder: lagSanitySpørsmålDokument(),
    borMedOmsorgsperson: lagSanitySpørsmålDokument(),
    hvorBorBarnet: lagSanitySpørsmålDokument(),
    subtittelAndreForelder: lagLocaleRecordBlock(),
    idNummerAndreForelder: lagSanitySpørsmålDokument(),
    hvorBorAndreForelder: lagSanitySpørsmålDokument(),
    paagaaendeSoeknadYtelseAndreForelder: lagSanitySpørsmålDokument(),
    hvilketLandSoektYtelseAndreForelder: lagSanitySpørsmålDokument(),
    oppgittIkkeBorFastSammenMedDeg: lagLocaleRecordBlock(),
    hvaHeterOmsorgspersonen: lagSanitySpørsmålDokument(),
    slektsforholdOmsorgsperson: lagSanitySpørsmålDokument(),
    hvilkenRelasjonOmsorgsperson: lagSanitySpørsmålDokument(),
    idNummerOmsorgsperson: lagSanitySpørsmålDokument(),
    hvorBorOmsorgsperson: lagSanitySpørsmålDokument(),
    paagaaendeSoeknadYtelseOmsorgsperson: lagSanitySpørsmålDokument(),
    hvilketLandSoektYtelseOmsorgsperson: lagSanitySpørsmålDokument(),
    arbeidNorgeAndreForelder: lagSanitySpørsmålDokument(),
    arbeidNorgeAndreForelderGjenlevende: lagSanitySpørsmålDokument(),
    pensjonNorgeAndreForelder: lagSanitySpørsmålDokument(),
    pensjonNorgeAndreForelderGjenlevende: lagSanitySpørsmålDokument(),
    utbetalingerAndreForelder: lagSanitySpørsmålDokument(),
    utbetalingerAndreForelderGjenlevende: lagSanitySpørsmålDokument(),
    ytelseFraAnnetLandAndreForelder: lagSanitySpørsmålDokument(),
    ytelseFraAnnetLandAndreForelderGjenlevende: lagSanitySpørsmålDokument(),
    arbeidUtenforNorgeOmsorgsperson: lagSanitySpørsmålDokument(),
    arbeidNorgeOmsorgsperson: lagSanitySpørsmålDokument(),
    pensjonUtlandOmsorgsperson: lagSanitySpørsmålDokument(),
    pensjonNorgeOmsorgsperson: lagSanitySpørsmålDokument(),
    utbetalingerOmsorgsperson: lagSanitySpørsmålDokument(),
    ytelseFraAnnetLandOmsorgsperson: lagSanitySpørsmålDokument(),

    /* Slektsforhold valgalternativ */
    valgalternativSlektsforholdPlaceholder: lagLocaleRecordString(),
    valgalternativAnnenRelasjon: lagLocaleRecordString(),
    valgalternativAnnenFamilierelasjon: lagLocaleRecordString(),
    valgalternativForelder: lagLocaleRecordString(),
    valgalternativOnkelTante: lagLocaleRecordString(),
    valgalternativBesteforelder: lagLocaleRecordString(),
};

const oppsummeringTekstinnhold = {
    oppsummeringTittel: lagLocaleRecordBlock(),
    oppsummeringGuide: lagLocaleRecordBlock(),
    endreSvarLenkeTekst: lagLocaleRecordString(),
};

const dokumentasjonTekstinnhold = {
    dokumentasjonTittel: lagLocaleRecordBlock(),
    dokumentasjonGuide: lagLocaleRecordBlock(),
    dokumentasjonGuideVedleggskrav: lagLocaleRecordBlock(),
    dokumentasjonGuideIngenVedleggskrav: lagLocaleRecordBlock(),
    // Info innledning
    forLangTidDokumentasjon: lagLocaleRecordBlock(),
    vedleggskravTittel: lagLocaleRecordBlock(),
    vedleggskrav: lagLocaleRecordBlock(),
    ingenVedleggskravTittel: lagLocaleRecordBlock(),
    ingenVedleggskrav: lagLocaleRecordBlock(),
    manglerDokumentasjonSpoersmaalTittel: lagLocaleRecordBlock(),
    manglerDokumentasjonSpoersmaal: lagLocaleRecordBlock(),
    // Bilde scanning guide
    slikTarDuEtGodtBildeExpand: lagLocaleRecordString(),
    slikTarDuEtGodtBildeTittel: lagLocaleRecordBlock(),
    slikTarDuEtGodtBilde: lagLocaleRecordBlock(),
    etterDuHarTattBildetTittel: lagLocaleRecordBlock(),
    etterDuHarTattBildet: lagLocaleRecordBlock(),
    vaerTryggNaarDuTarBildeTittel: lagLocaleRecordBlock(),
    vaerTryggNaarDuTarBilde: lagLocaleRecordBlock(),
    // Bra og dårlige eksempler
    braOgDaarligeTittel: lagLocaleRecordBlock(),
    bra: lagLocaleRecordBlock(),
    daarlig: lagLocaleRecordBlock(),
    fyllerHeleBildet: lagLocaleRecordBlock(),
    ikkeTattOvenfra: lagLocaleRecordBlock(),
    ikkeRiktigRetning: lagLocaleRecordBlock(),
    skyggePaaDokumentet: lagLocaleRecordBlock(),
    // Knapper og checkbox
    sendtInnTidligere: lagLocaleRecordBlock(),
    forMange: lagLocaleRecordString(),
    feilFiltype: lagLocaleRecordString(),
    forStor: lagLocaleRecordString(),
    bildetForLite: lagLocaleRecordString(),
    noeGikkFeil: lagLocaleRecordString(),
    lastOppKnapp: lagLocaleRecordString(),
    slippFilenHer: lagLocaleRecordString(),
    slett: lagLocaleRecordString(),
    stottedeFiltyper: lagLocaleRecordString(),
    maksFilstorrelse: lagLocaleRecordString(),
    maksAntallFiler: lagLocaleRecordString(),
    lastOppFiler: lagLocaleRecordString(),
    filtypeFeilmelding: lagLocaleRecordString(),
    filstorrelseFeilmelding: lagLocaleRecordString(),
    antallFilerFeilmelding: lagLocaleRecordString(),
    ukjentFeilmelding: lagLocaleRecordString(),
    velgFil: lagLocaleRecordString(),
    velgFiler: lagLocaleRecordString(),
    draOgSlippFilenHer: lagLocaleRecordString(),
    draOgSlippFilerHer: lagLocaleRecordString(),
    filopplastingDeaktivert: lagLocaleRecordString(),
    filopplastingDeaktivertFilerErUnderOpplastning: lagLocaleRecordString(),
    filopplastingDeaktivertMaksAntallFiler: lagLocaleRecordString(),
    lastOppFilenPaNytt: lagLocaleRecordString(),
    slettFilen: lagLocaleRecordString(),
    lasterNed: lagLocaleRecordString(),
    lasterOpp: lagLocaleRecordString(),
    // Vedlegg - titler
    [TittelSanityApiNavn.bekreftelsePaaAdopsjonTittel]: lagLocaleRecordBlock(),
    [TittelSanityApiNavn.annenDokumentasjon]: lagLocaleRecordBlock(),
    [TittelSanityApiNavn.avtaleOmDeltBostedTittel]: lagLocaleRecordBlock(),
    [TittelSanityApiNavn.bekreftelseFraBarnevernetTittel]: lagLocaleRecordBlock(),
    [TittelSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDegTittel]: lagLocaleRecordBlock(),
    [TittelSanityApiNavn.meklingsattestTittel]: lagLocaleRecordBlock(),
    [TittelSanityApiNavn.dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfallTittel]:
        lagLocaleRecordBlock(),
    [TittelSanityApiNavn.vedtakOmOppholdstillatelseTittel]: lagLocaleRecordBlock(),
    // Vedlegg - beskrivelser
    [BeskrivelseSanityApiNavn.dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfall]:
        lagLocaleRecordBlock(),
    [BeskrivelseSanityApiNavn.vedtakOmOppholdstillatelse]: lagLocaleRecordBlock(),
    [BeskrivelseSanityApiNavn.bekreftelsePaaAdopsjonBarnetrygd]: lagLocaleRecordBlock(),
    [BeskrivelseSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDeg]: lagLocaleRecordBlock(),
    [BeskrivelseSanityApiNavn.avtaleOmDeltBosted]: lagLocaleRecordBlock(),
    [BeskrivelseSanityApiNavn.meklingsattest]: lagLocaleRecordBlock(),
    [BeskrivelseSanityApiNavn.bekreftelseFraBarnevernetBarnetrygd]: lagLocaleRecordBlock(),
    [BeskrivelseSanityApiNavn.lastOppSenereISoknad]: lagLocaleRecordBlock(),
    [BeskrivelseSanityApiNavn.annenDokumentasjonBeskrivelse]: lagLocaleRecordBlock(),
};

const kvitteringTekstinnhold = {
    kvitteringTittel: lagLocaleRecordBlock(),
    soeknadMottatt: lagLocaleRecordBlock(),
    trengerIkkeEttersendeVedlegg: lagLocaleRecordBlock(),
    maaEttersendeVedleggAlert: lagLocaleRecordBlock(),
    infoTilSoker: lagLocaleRecordBlock(),
    manglerKontonummerTittel: lagLocaleRecordBlock(),
    kontonummerTittel: lagLocaleRecordBlock(),
    redigerKontonummerLenke: lagLocaleRecordBlock(),
    henterKontonummer: lagLocaleRecordBlock(),
    finnerIngenKontonummerAdvarsel: lagLocaleRecordBlock(),
    finnerIngenKontonummerBeskrivelse: lagLocaleRecordBlock(),
};

const vedlikeholdsarbeidTekstinnhold = {
    vedlikeholdTittel: lagLocaleRecordBlock(),
    vedlikeholdBroedtekst: lagLocaleRecordBlock(),
    vedlikeholdVeileder: lagLocaleRecordBlock(),
};

const IKanIkkeBrukeSoeknadTekstinnhold = {
    brukPDFKontantstoette: lagLocaleRecordBlock(),
};

const hjelpeteksterForInputTekstInnhold = {
    datoformatHjelpetekst: lagLocaleRecordBlock(),
    datoformatPlaceholder: lagLocaleRecordBlock(),
    manedformatPlaceholder: lagLocaleRecordBlock(),
    velgLandPlaceholder: lagLocaleRecordBlock(),
};

const arbeidsperiodeTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    arbeidsgiver: lagSanitySpørsmålDokument(),
    arbeidsperiodenAvsluttet: lagSanitySpørsmålDokument(),
    hvilketLandFortid: lagSanitySpørsmålDokument(),
    hvilketLandNaatid: lagSanitySpørsmålDokument(),
    sluttdatoFortid: lagSanitySpørsmålDokument(),
    sluttdatoFremtid: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordString(),
    fjernKnapp: lagLocaleRecordBlock(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    oppsummeringstittel: lagLocaleRecordBlock(),
};

const barnetrygdsperiodeTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordString(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    mottarBarnetrygdNa: lagSanitySpørsmålDokument(),
    barnetrygdLandFortid: lagSanitySpørsmålDokument(),
    barnetrygdLandNatid: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    sluttdato: lagSanitySpørsmålDokument(),
    belopPerManed: lagSanitySpørsmålDokument(),
    belopFormatFeilmelding: lagLocaleRecordBlock(),
};

const andreUtbetalingerTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordString(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    fjernKnapp: lagLocaleRecordBlock(),
    faarUtbetalingerNaa: lagSanitySpørsmålDokument(),
    utbetalingLandFortid: lagSanitySpørsmålDokument(),
    utbetalingLandNaatid: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    sluttdatoFortid: lagSanitySpørsmålDokument(),
    sluttdatoFremtid: lagSanitySpørsmålDokument(),
};

const leggTilBarnTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    leggTilKnapp: lagLocaleRecordBlock(),
    fjernKnapp: lagLocaleRecordBlock(),
    erBarnetFoedt: lagSanitySpørsmålDokument(),
    ikkeFoedtAlert: lagLocaleRecordBlock(),
    barnetsNavnSubtittel: lagLocaleRecordBlock(),
    fornavn: lagSanitySpørsmålDokument(),
    etternavn: lagSanitySpørsmålDokument(),
    foedselsnummerEllerDNummer: lagSanitySpørsmålDokument(),
    foedselsnummerAlert: lagLocaleRecordBlock(),
};

function lagSanitySpørsmålDokument() {
    return {
        sporsmal: lagLocaleRecordBlock(),
        feilmelding: lagLocaleRecordBlock(),
        alert: lagLocaleRecordBlock(),
        beskrivelse: lagLocaleRecordBlock(),
        vedleggsnotis: lagLocaleRecordBlock(),
        checkboxLabel: lagLocaleRecordBlock(),
        _createdAt: 'string',
        _rev: 'string',
        _type: 'string',
        _id: 'string',
        api_navn: 'string',
        steg: ESanitySteg.FORSIDE,
        visningsnavn: 'string',
        ytelse: 'string',
    };
}

const pensjonsperiodeTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordString(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    faarPensjonNaa: lagSanitySpørsmålDokument(),
    pensjonLandFortid: lagSanitySpørsmålDokument(),
    pensjonLandNaatid: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    startdatoFortid: lagSanitySpørsmålDokument(),
    startdatoNaatid: lagSanitySpørsmålDokument(),
    sluttdato: lagSanitySpørsmålDokument(),
    sluttdatoFortid: lagSanitySpørsmålDokument(),
    sluttdatoFremtid: lagSanitySpørsmålDokument(),
};

const tidligereSamoboereTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordString(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    fjernKnapp: lagLocaleRecordBlock(),
    samboerNavn: lagSanitySpørsmålDokument(),
    foedselsnummerEllerDNummer: lagSanitySpørsmålDokument(),
    foedselsdato: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    sluttdato: lagSanitySpørsmålDokument(),
};

const utenlandsoppholdTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    flyttetTilNorgeDato: lagSanitySpørsmålDokument(),
    sluttdatoFortid: lagSanitySpørsmålDokument(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordBlock(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    valgalternativPermanentIUtland: lagLocaleRecordString(),
    valgalternativPermanentINorge: lagLocaleRecordString(),
    valgalternativOppholdUtenforNorgeTidligere: lagLocaleRecordString(),
    valgalternativOppholdUtenforNorgeNaa: lagLocaleRecordString(),
    valgalternativPlaceholder: lagLocaleRecordString(),
    landFlyttetTil: lagSanitySpørsmålDokument(),
    landFlyttetFra: lagSanitySpørsmålDokument(),
    periodeBeskrivelse: lagSanitySpørsmålDokument(),
    tidligereOpphold: lagSanitySpørsmålDokument(),
    fjernKnapp: lagLocaleRecordBlock(),
    naavaerendeOpphold: lagSanitySpørsmålDokument(),
    flyttetFraNorgeDato: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    sluttdatoFremtid: lagSanitySpørsmålDokument(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    adresseFortid: lagSanitySpørsmålDokument(),
    adresseNaatid: lagSanitySpørsmålDokument(),
};

const startPåNyttModal = {
    startNySoeknadKnapp: lagLocaleRecordBlock(),
    startPaaNyttInfo: lagLocaleRecordBlock(),
    startPaaNyttTittel: lagLocaleRecordBlock(),
    startPaaNyttAvbryt: lagLocaleRecordBlock(),
};

const modalerTekstinnhold = {
    arbeidsperiode: {
        søker: arbeidsperiodeTekstinnhold,
        andreForelder: arbeidsperiodeTekstinnhold,
        omsorgsperson: arbeidsperiodeTekstinnhold,
    },
    barnetrygdsperiode: {
        søker: barnetrygdsperiodeTekstinnhold,
        andreForelder: barnetrygdsperiodeTekstinnhold,
        omsorgsperson: barnetrygdsperiodeTekstinnhold,
    },
    pensjonsperiode: {
        søker: pensjonsperiodeTekstinnhold,
        andreForelder: pensjonsperiodeTekstinnhold,
        omsorgsperson: pensjonsperiodeTekstinnhold,
    },
    andreUtbetalinger: {
        søker: andreUtbetalingerTekstinnhold,
        andreForelder: andreUtbetalingerTekstinnhold,
        omsorgsperson: andreUtbetalingerTekstinnhold,
    },
    tidligereSamboere: {
        søker: tidligereSamoboereTekstinnhold,
    },
    utenlandsopphold: {
        søker: utenlandsoppholdTekstinnhold,
        barn: utenlandsoppholdTekstinnhold,
        andreForelder: utenlandsoppholdTekstinnhold,
    },
    startPåNytt: startPåNyttModal,
    leggTilBarn: leggTilBarnTekstinnhold,
};

const fellesTekstInnhold = {
    frittståendeOrd: frittståendeOrdTekstinnhold,
    modaler: modalerTekstinnhold,
    navigasjon: navigasjonTekstinnhold,
    formateringsfeilmeldinger: formateringsfeilmeldingerTekstinnhold,
    vedlikeholdsarbeid: vedlikeholdsarbeidTekstinnhold,
    kanIkkeBrukeSoeknad: IKanIkkeBrukeSoeknadTekstinnhold,
    hjelpeteksterForInput: hjelpeteksterForInputTekstInnhold,
};

export function hentTekstInnhold() {
    return {
        [ESanitySteg.FORSIDE]: forsideTekstinnhold,
        [ESanitySteg.OM_DEG]: omDegTekstinnhold,
        [ESanitySteg.DIN_LIVSSITUASJON]: dinLivssituasjonTekstinnhold,
        [ESanitySteg.VELG_BARN]: velgBarnTekstinnhold,
        [ESanitySteg.OM_BARNET]: omBarnetTekstinnhold,
        [ESanitySteg.OM_BARNA]: omBarnaTekstinnhold,
        [ESanitySteg.EØS_FOR_SØKER]: eøsForSøkerTekstinnhold,
        [ESanitySteg.EØS_FOR_BARN]: eøsForBarnTekstinnhold,
        [ESanitySteg.OPPSUMMERING]: oppsummeringTekstinnhold,
        [ESanitySteg.DOKUMENTASJON]: dokumentasjonTekstinnhold,
        [ESanitySteg.KVITTERING]: kvitteringTekstinnhold,
        [ESanitySteg.FELLES]: fellesTekstInnhold,
    };
}

function lagLocaleRecordString(text = 'default string') {
    return {
        _createdAt: '2022-09-01T09:31:48Z',
        _id: '3cb3d89a-cbdb-4804-8091-9532b687d8b0',
        _rev: 'X3H4QZC9mPz23OIbafWpY9',
        _type: 'FORSIDE_BEKREFTELSESBOKS_ANDRE_TEKSTER',
        _updatedAt: '2024-07-31T10:22:59Z',
        api_navn: 'bekreftelsesboksTittel',
        en: text,
        nb: text,
        nn: text,
        steg: 'FORSIDE',
        visningsnavn: 'Tittel',
        ytelse: ['BARNETRYGD'],
    };
}

function lagLocaleRecordBlock(text = 'default block') {
    return {
        _createdAt: '2024-03-14T12:14:45Z',
        _id: 'FORSIDE_TITTEL_BARNETRYGD',
        _rev: 'SRrrMQUr2Cz7iHxH62d4PQ',
        _type: 'FORSIDE_TITTEL_BARNETRYGD',
        _updatedAt: '2024-07-31T10:22:59Z',
        api_navn: 'soeknadstittelBarnetrygd',
        en: [
            {
                _key: '687852dd7e05',
                _type: 'block',
                children: [
                    {
                        _key: '582adfe933a20',
                        _type: 'span',
                        marks: [],
                        text: text,
                    },
                ],
                markDefs: [],
                style: 'normal',
            },
        ],
        nb: [
            {
                _key: '5608dad0883b',
                _type: 'block',
                children: [
                    {
                        _key: '91d698ff5f5b',
                        _type: 'span',
                        marks: [],
                        text: text,
                    },
                ],
                markDefs: [],
                style: 'normal',
            },
        ],
        nn: [
            {
                _key: '809e101954ae',
                _type: 'block',
                children: [
                    {
                        _key: '0a9b7c5418a8',
                        _type: 'span',
                        marks: [],
                        text: text,
                    },
                ],
                markDefs: [],
                style: 'normal',
            },
        ],
        steg: 'FORSIDE',
        visningsnavn: 'Søknadstittel barnetrygd',
        ytelse: ['BARNETRYGD'],
    };
}

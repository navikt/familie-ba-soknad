import { TilKontraktTestData } from './typer';

export const testdata3: TilKontraktTestData = {
    input: {
        søknadstype: 'ORDINÆR',
        erEøs: true,
        kontraktVersjon: '9',
        antallEøsSteg: 0,
        barnInkludertISøknaden: [
            {
                id: 'db2afce7-2607-461e-a056-682eab5546e4',
                navn: 'Barn 234567 89876',
                ident: '23456789876',
                alder: '13',
                borMedSøker: false,
                adresse: {
                    svar: 'Vei 12',
                    id: 'barnets-adresse',
                },
                adressebeskyttelse: true,
                barnErFyltUt: true,
                utenlandsperioder: [],
                eøsBarnetrygdsperioder: [],
                idNummer: [],
                harEøsSteg: false,
                andreForelder: {
                    kanIkkeGiOpplysninger: {
                        id: 'andre-forelder-kan-ikke-gi-opplysninger',
                        svar: 'NEI',
                    },
                    pågåendeSøknadFraAnnetEøsLand: {
                        id: 'andre-forelder-pågående-søknad',
                        svar: 'JA',
                    },
                    pågåendeSøknadHvilketLand: {
                        id: 'andre-forelder-pågående-søknad-land',
                        svar: 'BEL',
                    },
                    barnetrygdFraEøs: {
                        id: 'andre-forelder-barnetrygd',
                        svar: 'NEI',
                    },
                    eøsBarnetrygdsperioder: [],
                    arbeidsperioderNorge: [],
                    arbeidsperioderUtland: [],
                    andreUtbetalingsperioder: [],
                    pensjonsperioderNorge: [],
                    pensjonsperioderUtland: [],
                    idNummer: [],
                    navn: {
                        id: 'andre-forelder-navn',
                        svar: 'jajajajajajaja',
                    },
                    adresse: {
                        svar: 'Heisannveien 14',
                        id: 'andre-forelder-adresse',
                    },
                    fnr: {
                        id: 'andre-forelder-fødsels-/dnummer',
                        svar: 'UKJENT',
                    },
                    fødselsdato: {
                        id: 'andre-forelder-fødselsdato',
                        svar: 'UKJENT',
                    },
                    arbeidUtlandet: {
                        svar: 'VET_IKKE',
                        id: 'andre-forelder-arbeid',
                    },
                    pensjonUtland: {
                        svar: 'VET_IKKE',
                        id: 'andre-forelder-pensjon-utland',
                    },
                    pensjonNorge: {
                        svar: null,
                        id: 'andre-forelder-pensjon-norge',
                    },
                    andreUtbetalinger: {
                        svar: null,
                        id: 'andre-forelder-andre-utbetalinger',
                    },
                    skriftligAvtaleOmDeltBosted: {
                        id: 'skriftlig-avtale-om-delt-bosted',
                        svar: 'JA',
                    },
                    arbeidNorge: {
                        svar: null,
                        id: 'andre-forelder-arbeid-norge',
                    },
                    utvidet: {
                        søkerHarBoddMedAndreForelder: {
                            id: 'søker-har-bodd-med-andre-forelder',
                            svar: null,
                        },
                        søkerFlyttetFraAndreForelderDato: {
                            id: 'søker-flyttet-fra-andre-forelder-dato',
                            svar: '',
                        },
                    },
                },
                triggetEøs: false,
                sammeForelderSomAnnetBarnMedId: {
                    id: 'samme-forelder-som-annet-barn',
                    svar: null,
                },
                erFosterbarn: {
                    id: 'hvem-er-fosterbarn',
                    svar: 'NEI',
                },
                erAdoptertFraUtland: {
                    id: 'hvem-er-adoptert-fra-utland',
                    svar: 'NEI',
                },
                erAsylsøker: {
                    id: 'hvem-er-søkt-asyl-for',
                    svar: 'NEI',
                },
                barnetrygdFraAnnetEøsland: {
                    id: 'hvem-mottar-barnetrygd-eøsland',
                    svar: 'NEI',
                },
                andreForelderErDød: {
                    id: 'hvem-er-avdød-partner-forelder-til',
                    svar: 'NEI',
                },
                oppholderSegIInstitusjon: {
                    id: 'hvem-oppholder-seg-i-institusjon',
                    svar: 'NEI',
                },
                institusjonIUtland: {
                    id: 'institusjonIUtland',
                    svar: 'NEI',
                },
                institusjonsnavn: {
                    id: 'institusjonsnavn',
                    svar: '',
                },
                institusjonsadresse: {
                    id: 'institusjonsadresse',
                    svar: '',
                },
                institusjonspostnummer: {
                    id: 'institusjonspostnummer',
                    svar: '',
                },
                institusjonOppholdStartdato: {
                    id: 'institusjon-opphold-startdato',
                    svar: '',
                },
                institusjonOppholdSluttdato: {
                    id: 'institusjon-opphold-sluttdato',
                    svar: '',
                },
                boddMindreEnn12MndINorge: {
                    id: 'hvem-tolv-mnd-sammenhengende-i-norge',
                    svar: 'NEI',
                },
                planleggerÅBoINorge12Mnd: {
                    id: 'barn-planlegger-å-bo-sammenhengende-i-norge-12mnd',
                    svar: null,
                },
                borFastMedSøker: {
                    id: 'bor-barnet-fast-med-deg',
                    svar: 'JA',
                },
            },
            {
                id: 'cc26acec-b3df-48ec-b25d-0791a85ad436',
                navn: 'Barn Barnessen III',
                ident: '12345678987',
                alder: '12',
                borMedSøker: true,
                adresse: {
                    svar: 'Vei 12',
                    id: 'barnets-adresse',
                },
                adressebeskyttelse: false,
                barnErFyltUt: true,
                utenlandsperioder: [
                    {
                        utenlandsoppholdÅrsak: {
                            id: 'årsak-utenlandsopphold',
                            svar: 'OPPHOLDER_SEG_UTENFOR_NORGE',
                        },
                        oppholdsland: {
                            id: 'land-utenlandsopphold',
                            svar: 'GRC',
                        },
                        oppholdslandFraDato: {
                            id: 'fra-dato-utenlandsopphold',
                            svar: '2022-01-12',
                        },
                        oppholdslandTilDato: {
                            id: 'til-dato-utenlandsopphold',
                            svar: 'UKJENT',
                        },
                    },
                    {
                        utenlandsoppholdÅrsak: {
                            id: 'årsak-utenlandsopphold',
                            svar: 'OPPHOLDER_SEG_UTENFOR_NORGE',
                        },
                        oppholdsland: {
                            id: 'land-utenlandsopphold',
                            svar: 'TUV',
                        },
                        oppholdslandFraDato: {
                            id: 'fra-dato-utenlandsopphold',
                            svar: '2022-01-10',
                        },
                        oppholdslandTilDato: {
                            id: 'til-dato-utenlandsopphold',
                            svar: 'UKJENT',
                        },
                    },
                ],
                eøsBarnetrygdsperioder: [],
                idNummer: [],
                harEøsSteg: false,
                andreForelder: null,
                triggetEøs: true,
                sammeForelderSomAnnetBarnMedId: {
                    id: 'samme-forelder-som-annet-barn',
                    svar: null,
                },
                erFosterbarn: {
                    id: 'hvem-er-fosterbarn',
                    svar: 'JA',
                },
                erAdoptertFraUtland: {
                    id: 'hvem-er-adoptert-fra-utland',
                    svar: 'JA',
                },
                erAsylsøker: {
                    id: 'hvem-er-søkt-asyl-for',
                    svar: 'JA',
                },
                barnetrygdFraAnnetEøsland: {
                    id: 'hvem-mottar-barnetrygd-eøsland',
                    svar: 'JA',
                },
                andreForelderErDød: {
                    id: 'hvem-er-avdød-partner-forelder-til',
                    svar: 'NEI',
                },
                oppholderSegIInstitusjon: {
                    id: 'hvem-oppholder-seg-i-institusjon',
                    svar: 'JA',
                },
                institusjonIUtland: {
                    id: 'institusjonIUtland',
                    svar: 'NEI',
                },
                institusjonsnavn: {
                    id: 'institusjonsnavn',
                    svar: 'asdasdasdgsegse',
                },
                institusjonsadresse: {
                    id: 'institusjonsadresse',
                    svar: 'gadgweegewrsgsefaegse',
                },
                institusjonspostnummer: {
                    id: 'institusjonspostnummer',
                    svar: '4342',
                },
                institusjonOppholdStartdato: {
                    id: 'institusjon-opphold-startdato',
                    svar: '2022-01-06',
                },
                institusjonOppholdSluttdato: {
                    id: 'institusjon-opphold-sluttdato',
                    svar: '2022-01-21',
                },
                boddMindreEnn12MndINorge: {
                    id: 'hvem-tolv-mnd-sammenhengende-i-norge',
                    svar: 'JA',
                },
                planleggerÅBoINorge12Mnd: {
                    id: 'barn-planlegger-å-bo-sammenhengende-i-norge-12mnd',
                    svar: 'NEI',
                },
                borFastMedSøker: {
                    id: 'bor-barnet-fast-med-deg',
                    svar: 'JA',
                },
            },
        ],
        lestOgForståttBekreftelse: true,
        barnRegistrertManuelt: [],
        dokumentasjon: [
            {
                dokumentasjonsbehov: 'AVTALE_DELT_BOSTED',
                tittelSpråkId: 'dokumentasjon.deltbosted.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.deltbosted.informasjon',
                gjelderForBarnId: ['db2afce7-2607-461e-a056-682eab5546e4'],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        dokumentId: 'c2225220-2390-45b4-bae4-25a3300a4ffe',
                        navn: 'sc1.jpeg',
                        størrelse: 481593,
                        tidspunkt: '2022-01-27T06:30:57.275Z',
                    },
                ],
            },
            {
                dokumentasjonsbehov: 'VEDTAK_OPPHOLDSTILLATELSE',
                tittelSpråkId: 'dokumentasjon.oppholdstillatelse.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.oppholdstillatelse.informasjon',
                gjelderForBarnId: ['cc26acec-b3df-48ec-b25d-0791a85ad436'],
                gjelderForSøker: true,
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        dokumentId: '7d982124-4be9-4748-8e13-05ea49ea94cb',
                        navn: 'sc1.jpeg',
                        størrelse: 481593,
                        tidspunkt: '2022-01-27T06:30:57.282Z',
                    },
                ],
            },
            {
                dokumentasjonsbehov: 'ADOPSJON_DATO',
                tittelSpråkId: 'dokumentasjon.adopsjon.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.adopsjon.informasjon',
                gjelderForBarnId: ['cc26acec-b3df-48ec-b25d-0791a85ad436'],
                gjelderForSøker: false,
                harSendtInn: true,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'BEKREFTELSE_FRA_BARNEVERN',
                tittelSpråkId: 'dokumentasjon.bekreftelsebarnevernet.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.bekreftelsebarnevernet.informasjon',
                gjelderForBarnId: ['cc26acec-b3df-48ec-b25d-0791a85ad436'],
                gjelderForSøker: false,
                harSendtInn: true,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'BOR_FAST_MED_SØKER',
                tittelSpråkId: 'dokumentasjon.bekreftelseborsammen.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.bekreftelseborsammen.informasjon',
                gjelderForBarnId: ['db2afce7-2607-461e-a056-682eab5546e4'],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        dokumentId: '9daae107-a267-4121-a041-eb1e6e23e4ec',
                        navn: 'sc1.jpeg',
                        størrelse: 481593,
                        tidspunkt: '2022-01-27T06:30:57.293Z',
                    },
                ],
            },
            {
                dokumentasjonsbehov: 'SEPARERT_SKILT_ENKE',
                tittelSpråkId: 'dokumentasjon.separasjonskilsmissedødsfall.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.separasjonskilsmissedødsfall.informasjon',
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'MEKLINGSATTEST',
                tittelSpråkId: 'dokumentasjon.meklingsattest.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.meklingsattest.informasjon',
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'ANNEN_DOKUMENTASJON',
                tittelSpråkId: 'dokumentasjon.annendokumentasjon.vedleggtittel',
                beskrivelseSpråkId: null,
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        dokumentId: '573c2729-4ca2-414a-ab65-079336353214',
                        navn: 'sc1.jpeg',
                        størrelse: 481593,
                        tidspunkt: '2022-01-27T06:30:57.298Z',
                    },
                ],
            },
        ],
        søker: {
            navn: 'Voksen Voksnessen',
            harEøsSteg: false,
            barn: [
                {
                    id: 'db2afce7-2607-461e-a056-682eab5546e4',
                    navn: 'Barn 234567 89876',
                    ident: '23456789876',
                    alder: '13',
                    borMedSøker: false,
                    adressebeskyttelse: true,
                },
                {
                    id: 'cc26acec-b3df-48ec-b25d-0791a85ad436',
                    navn: 'Barn Barnessen III',
                    ident: '12345678987',
                    alder: '12',
                    borMedSøker: true,
                    adressebeskyttelse: false,
                },
            ],
            triggetEøs: true,
            idNummer: [{ idnummer: '123', land: 'BEL' }],
            adresseISøkeperiode: { id: 'eøs-om-deg.dittoppholdssted.spm', svar: '' },
            statsborgerskap: [
                {
                    landkode: 'NOR',
                },
                {
                    landkode: 'AFG',
                },
            ],
            ident: '23058518298',
            sivilstand: {
                type: 'GIFT',
            },
            adressebeskyttelse: false,
            adresse: {
                adressenavn: 'Solveien',
                postnummer: '2304',
                husnummer: '2',
                husbokstav: 'A',
                bruksenhetnummer: 'H0101',
                bostedskommune: null,
                poststed: 'HAMAR',
            },
            utenlandsperioder: [
                {
                    utenlandsoppholdÅrsak: {
                        id: 'årsak-utenlandsopphold',
                        svar: 'FLYTTET_PERMANENT_TIL_NORGE',
                    },
                    oppholdsland: {
                        id: 'land-utenlandsopphold',
                        svar: 'AFG',
                    },
                    oppholdslandTilDato: {
                        id: 'til-dato-utenlandsopphold',
                        svar: '2022-01-01',
                    },
                },
                {
                    utenlandsoppholdÅrsak: {
                        id: 'årsak-utenlandsopphold',
                        svar: 'FLYTTET_PERMANENT_FRA_NORGE',
                    },
                    oppholdsland: {
                        id: 'land-utenlandsopphold',
                        svar: 'BEL',
                    },
                    oppholdslandFraDato: {
                        id: 'fra-dato-utenlandsopphold',
                        svar: '2022-01-01',
                    },
                },
            ],
            borPåRegistrertAdresse: {
                id: 'bor-på-registrert-adresse',
                svar: 'JA',
            },
            værtINorgeITolvMåneder: {
                id: 'søker-vært-i-norge-sammenhengende-tolv-måneder',
                svar: 'NEI',
            },
            planleggerÅBoINorgeTolvMnd: {
                id: 'søker-planlegger-å-bo-i-norge-sammenhengende-tolv-måneder',
                svar: null,
            },
            erAsylsøker: {
                id: 'er-asylsøker',
                svar: 'JA',
            },
            arbeidIUtlandet: {
                id: 'arbeid-i-utlandet',
                svar: 'JA',
            },
            arbeidsland: {
                id: 'arbeidsland',
                svar: 'BRN',
            },
            mottarUtenlandspensjon: {
                id: 'mottar-utenlandspensjon',
                svar: 'JA',
            },
            pensjonsland: {
                id: 'pensjonsland',
                svar: 'BHS',
            },
            arbeidsperioderUtland: [],
            arbeidsperioderNorge: [],
            pensjonsperioderNorge: [],
            pensjonsperioderUtland: [],
            andreUtbetalingsperioder: [],
            utvidet: {
                spørsmål: {
                    årsak: {
                        id: 'årsak',
                        svar: '',
                    },
                    separertEnkeSkilt: {
                        id: 'separert-enke-skilt',
                        svar: null,
                    },
                    separertEnkeSkiltUtland: {
                        id: 'separert-enke-skilt-utland',
                        svar: null,
                    },
                    separertEnkeSkiltDato: {
                        id: 'separert-enke-skilt-dato',
                        svar: '',
                    },
                    harSamboerNå: {
                        id: 'har-samboer-nå-og-gift',
                        svar: 'JA',
                    },
                },
                tidligereSamboere: [],
                nåværendeSamboer: {
                    navn: {
                        id: 'utvidet-nåværende-samboer-navn',
                        svar: 'asdasfafsasdasdas',
                    },
                    ident: {
                        id: 'utvidet-nåværende-samboer-fnr',
                        svar: 'UKJENT',
                    },
                    fødselsdato: {
                        id: 'utvidet-nåværende-samboer-fødselsdato',
                        svar: 'UKJENT',
                    },
                    samboerFraDato: {
                        id: 'utvidet-nåværende-samboer-samboerFraDato',
                        svar: '2022-01-01',
                    },
                },
            },
        },
        erNoenAvBarnaFosterbarn: {
            id: 'er-noen-av-barna-fosterbarn',
            svar: 'JA',
        },
        oppholderBarnSegIInstitusjon: {
            id: 'oppholder-barn-seg-i-institusjon',
            svar: 'JA',
        },
        erBarnAdoptertFraUtland: {
            id: 'er-barn-adoptert-fra-utland',
            svar: 'JA',
        },
        søktAsylForBarn: {
            id: 'søkt-asyl-for-barn',
            svar: 'JA',
        },
        barnOppholdtSegTolvMndSammenhengendeINorge: {
            id: 'tolv-mnd-sammenhengende-i-norge',
            svar: 'NEI',
        },
        mottarBarnetrygdForBarnFraAnnetEøsland: {
            id: 'barnetrygd-fra-annet-eøsland',
            svar: 'JA',
        },
        erAvdødPartnerForelder: {
            id: 'er-folkeregistrert-avdød-ektefelle-forelder',
            svar: null,
        },
    },
    output: {
        søknadstype: 'ORDINÆR',
        kontraktVersjon: 9,
        antallEøsSteg: 3,
        søker: {
            harEøsSteg: true,
            navn: {
                label: { en: 'Name', nb: 'Navn', nn: 'Namn' },
                verdi: {
                    nb: 'Voksen Voksnessen',
                    nn: 'Voksen Voksnessen',
                    en: 'Voksen Voksnessen',
                },
            },
            ident: {
                label: { en: 'Ident', nb: 'Ident', nn: 'Ident' },
                verdi: { nb: '23058518298', nn: '23058518298', en: '23058518298' },
            },
            sivilstand: {
                label: { en: 'Marital status', nb: 'Sivilstatus', nn: 'Sivilstatus' },
                verdi: { nb: 'GIFT', nn: 'GIFT', en: 'GIFT' },
            },
            statsborgerskap: {
                label: { en: 'Citizenship', nb: 'Statsborgerskap', nn: 'Statsborgarskap' },
                verdi: {
                    nb: ['Norge', 'Afghanistan'],
                    nn: ['Noreg', 'Afghanistan'],
                    en: ['Norway', 'Afghanistan'],
                },
            },
            adresse: {
                label: { en: 'Address', nb: 'Adresse', nn: 'Adresse' },
                verdi: {
                    nb: {
                        adressenavn: 'Solveien',
                        postnummer: '2304',
                        husnummer: '2',
                        husbokstav: 'A',
                        bruksenhetnummer: 'H0101',
                        bostedskommune: null,
                        poststed: 'HAMAR',
                    },
                    nn: {
                        adressenavn: 'Solveien',
                        postnummer: '2304',
                        husnummer: '2',
                        husbokstav: 'A',
                        bruksenhetnummer: 'H0101',
                        bostedskommune: null,
                        poststed: 'HAMAR',
                    },
                    en: {
                        adressenavn: 'Solveien',
                        postnummer: '2304',
                        husnummer: '2',
                        husbokstav: 'A',
                        bruksenhetnummer: 'H0101',
                        bostedskommune: null,
                        poststed: 'HAMAR',
                    },
                },
            },
            adressebeskyttelse: false,
            utenlandsperioder: [
                {
                    label: {
                        en: 'Stay abroad 1',
                        nb: 'Utenlandsopphold 1',
                        nn: 'Utanlandsopphald 1',
                    },
                    verdi: {
                        nb: {
                            utenlandsoppholdÅrsak: {
                                label: {
                                    en: 'What best describes the period you stayed outside of Norway?',
                                    nb: 'Hva beskriver perioden du oppholdt deg utenfor Norge best?',
                                    nn: 'Kva beskriv perioden du oppheldt deg utanfor Noreg best',
                                },
                                verdi: {
                                    en: 'I have permanently moved to Norway during the last twelve months',
                                    nb: 'Jeg har flyttet permanent til Norge de siste tolv månedene',
                                    nn: 'Eg har flytta permanent til Noreg dei siste tolv månadene',
                                },
                            },
                            oppholdsland: {
                                label: {
                                    en: 'Which country did you move from?',
                                    nb: 'Hvilket land flyttet du fra?',
                                    nn: 'Kva land flytta du frå?',
                                },
                                verdi: { nb: 'Afghanistan', nn: 'Afghanistan', en: 'Afghanistan' },
                            },
                            oppholdslandFraDato: {
                                label: {
                                    en: 'When did the stay start?',
                                    nb: 'Når startet oppholdet?',
                                    nn: 'Når starta opphaldet?',
                                },
                                verdi: {},
                            },
                            oppholdslandTilDato: {
                                label: {
                                    en: 'When did you move to Norway?',
                                    nb: 'Når flyttet du til Norge?',
                                    nn: 'Når flytta du til Noreg?',
                                },
                                verdi: { nb: '2022-01-01', nn: '2022-01-01', en: '2022-01-01' },
                            },
                        },
                        nn: {
                            utenlandsoppholdÅrsak: {
                                label: {
                                    en: 'What best describes the period you stayed outside of Norway?',
                                    nb: 'Hva beskriver perioden du oppholdt deg utenfor Norge best?',
                                    nn: 'Kva beskriv perioden du oppheldt deg utanfor Noreg best',
                                },
                                verdi: {
                                    en: 'I have permanently moved to Norway during the last twelve months',
                                    nb: 'Jeg har flyttet permanent til Norge de siste tolv månedene',
                                    nn: 'Eg har flytta permanent til Noreg dei siste tolv månadene',
                                },
                            },
                            oppholdsland: {
                                label: {
                                    en: 'Which country did you move from?',
                                    nb: 'Hvilket land flyttet du fra?',
                                    nn: 'Kva land flytta du frå?',
                                },
                                verdi: { nb: 'Afghanistan', nn: 'Afghanistan', en: 'Afghanistan' },
                            },
                            oppholdslandFraDato: {
                                label: {
                                    en: 'When did the stay start?',
                                    nb: 'Når startet oppholdet?',
                                    nn: 'Når starta opphaldet?',
                                },
                                verdi: {},
                            },
                            oppholdslandTilDato: {
                                label: {
                                    en: 'When did you move to Norway?',
                                    nb: 'Når flyttet du til Norge?',
                                    nn: 'Når flytta du til Noreg?',
                                },
                                verdi: { nb: '2022-01-01', nn: '2022-01-01', en: '2022-01-01' },
                            },
                        },
                        en: {
                            utenlandsoppholdÅrsak: {
                                label: {
                                    en: 'What best describes the period you stayed outside of Norway?',
                                    nb: 'Hva beskriver perioden du oppholdt deg utenfor Norge best?',
                                    nn: 'Kva beskriv perioden du oppheldt deg utanfor Noreg best',
                                },
                                verdi: {
                                    en: 'I have permanently moved to Norway during the last twelve months',
                                    nb: 'Jeg har flyttet permanent til Norge de siste tolv månedene',
                                    nn: 'Eg har flytta permanent til Noreg dei siste tolv månadene',
                                },
                            },
                            oppholdsland: {
                                label: {
                                    en: 'Which country did you move from?',
                                    nb: 'Hvilket land flyttet du fra?',
                                    nn: 'Kva land flytta du frå?',
                                },
                                verdi: { nb: 'Afghanistan', nn: 'Afghanistan', en: 'Afghanistan' },
                            },
                            oppholdslandFraDato: {
                                label: {
                                    en: 'When did the stay start?',
                                    nb: 'Når startet oppholdet?',
                                    nn: 'Når starta opphaldet?',
                                },
                                verdi: {},
                            },
                            oppholdslandTilDato: {
                                label: {
                                    en: 'When did you move to Norway?',
                                    nb: 'Når flyttet du til Norge?',
                                    nn: 'Når flytta du til Noreg?',
                                },
                                verdi: { nb: '2022-01-01', nn: '2022-01-01', en: '2022-01-01' },
                            },
                        },
                    },
                },
                {
                    label: {
                        en: 'Stay abroad 2',
                        nb: 'Utenlandsopphold 2',
                        nn: 'Utanlandsopphald 2',
                    },
                    verdi: {
                        nb: {
                            utenlandsoppholdÅrsak: {
                                label: {
                                    en: 'What best describes the period you stayed outside of Norway?',
                                    nb: 'Hva beskriver perioden du oppholdt deg utenfor Norge best?',
                                    nn: 'Kva beskriv perioden du oppheldt deg utanfor Noreg best',
                                },
                                verdi: {
                                    en: 'I have moved permanently from Norway',
                                    nb: 'Jeg har flyttet permanent fra Norge',
                                    nn: 'Eg har flytta permanent frå Noreg',
                                },
                            },
                            oppholdsland: {
                                label: {
                                    en: 'Which country have you moved to?',
                                    nb: 'Hvilket land har du flyttet til?',
                                    nn: 'Kva land har du flytta til?',
                                },
                                verdi: { nb: 'Belgia', nn: 'Belgia', en: 'Belgium' },
                            },
                            oppholdslandFraDato: {
                                label: {
                                    en: 'When did you move from Norway?',
                                    nb: 'Når flyttet du fra Norge?',
                                    nn: 'Når flytta du frå Noreg?',
                                },
                                verdi: { nb: '2022-01-01', nn: '2022-01-01', en: '2022-01-01' },
                            },
                            oppholdslandTilDato: {
                                label: {
                                    en: 'When is the stay ending?',
                                    nb: 'Når avsluttes oppholdet?',
                                    nn: 'Når skal opphaldet avsluttast?',
                                },
                                verdi: {},
                            },
                        },
                        nn: {
                            utenlandsoppholdÅrsak: {
                                label: {
                                    en: 'What best describes the period you stayed outside of Norway?',
                                    nb: 'Hva beskriver perioden du oppholdt deg utenfor Norge best?',
                                    nn: 'Kva beskriv perioden du oppheldt deg utanfor Noreg best',
                                },
                                verdi: {
                                    en: 'I have moved permanently from Norway',
                                    nb: 'Jeg har flyttet permanent fra Norge',
                                    nn: 'Eg har flytta permanent frå Noreg',
                                },
                            },
                            oppholdsland: {
                                label: {
                                    en: 'Which country have you moved to?',
                                    nb: 'Hvilket land har du flyttet til?',
                                    nn: 'Kva land har du flytta til?',
                                },
                                verdi: { nb: 'Belgia', nn: 'Belgia', en: 'Belgium' },
                            },
                            oppholdslandFraDato: {
                                label: {
                                    en: 'When did you move from Norway?',
                                    nb: 'Når flyttet du fra Norge?',
                                    nn: 'Når flytta du frå Noreg?',
                                },
                                verdi: { nb: '2022-01-01', nn: '2022-01-01', en: '2022-01-01' },
                            },
                            oppholdslandTilDato: {
                                label: {
                                    en: 'When is the stay ending?',
                                    nb: 'Når avsluttes oppholdet?',
                                    nn: 'Når skal opphaldet avsluttast?',
                                },
                                verdi: {},
                            },
                        },
                        en: {
                            utenlandsoppholdÅrsak: {
                                label: {
                                    en: 'What best describes the period you stayed outside of Norway?',
                                    nb: 'Hva beskriver perioden du oppholdt deg utenfor Norge best?',
                                    nn: 'Kva beskriv perioden du oppheldt deg utanfor Noreg best',
                                },
                                verdi: {
                                    en: 'I have moved permanently from Norway',
                                    nb: 'Jeg har flyttet permanent fra Norge',
                                    nn: 'Eg har flytta permanent frå Noreg',
                                },
                            },
                            oppholdsland: {
                                label: {
                                    en: 'Which country have you moved to?',
                                    nb: 'Hvilket land har du flyttet til?',
                                    nn: 'Kva land har du flytta til?',
                                },
                                verdi: { nb: 'Belgia', nn: 'Belgia', en: 'Belgium' },
                            },
                            oppholdslandFraDato: {
                                label: {
                                    en: 'When did you move from Norway?',
                                    nb: 'Når flyttet du fra Norge?',
                                    nn: 'Når flytta du frå Noreg?',
                                },
                                verdi: { nb: '2022-01-01', nn: '2022-01-01', en: '2022-01-01' },
                            },
                            oppholdslandTilDato: {
                                label: {
                                    en: 'When is the stay ending?',
                                    nb: 'Når avsluttes oppholdet?',
                                    nn: 'Når skal opphaldet avsluttast?',
                                },
                                verdi: {},
                            },
                        },
                    },
                },
            ],
            idNummer: [
                {
                    label: {
                        en: 'What is your personal ID-number in Belgia?',
                        nb: 'Hva er id-nummeret ditt i Belgia?',
                        nn: 'Kva er id-nummeret ditt i Belgia?',
                    },
                    verdi: {
                        nb: {
                            idNummer: {
                                label: {
                                    en: 'What is your personal ID-number in Belgia?',
                                    nb: 'Hva er id-nummeret ditt i Belgia?',
                                    nn: 'Kva er id-nummeret ditt i Belgia?',
                                },
                                verdi: { nb: '123', nn: '123', en: '123' },
                            },
                            land: {
                                label: {
                                    en: 'What is your personal ID-number in Belgia?',
                                    nb: 'Hva er id-nummeret ditt i Belgia?',
                                    nn: 'Kva er id-nummeret ditt i Belgia?',
                                },
                                verdi: { nb: 'BEL', nn: 'BEL', en: 'BEL' },
                            },
                        },
                        nn: {
                            idNummer: {
                                label: {
                                    en: 'What is your personal ID-number in Belgia?',
                                    nb: 'Hva er id-nummeret ditt i Belgia?',
                                    nn: 'Kva er id-nummeret ditt i Belgia?',
                                },
                                verdi: { nb: '123', nn: '123', en: '123' },
                            },
                            land: {
                                label: {
                                    en: 'What is your personal ID-number in Belgia?',
                                    nb: 'Hva er id-nummeret ditt i Belgia?',
                                    nn: 'Kva er id-nummeret ditt i Belgia?',
                                },
                                verdi: { nb: 'BEL', nn: 'BEL', en: 'BEL' },
                            },
                        },
                        en: {
                            idNummer: {
                                label: {
                                    en: 'What is your personal ID-number in Belgia?',
                                    nb: 'Hva er id-nummeret ditt i Belgia?',
                                    nn: 'Kva er id-nummeret ditt i Belgia?',
                                },
                                verdi: { nb: '123', nn: '123', en: '123' },
                            },
                            land: {
                                label: {
                                    en: 'What is your personal ID-number in Belgia?',
                                    nb: 'Hva er id-nummeret ditt i Belgia?',
                                    nn: 'Kva er id-nummeret ditt i Belgia?',
                                },
                                verdi: { nb: 'BEL', nn: 'BEL', en: 'BEL' },
                            },
                        },
                    },
                },
            ],
            spørsmål: {
                borPåRegistrertAdresse: {
                    label: {
                        en: 'Do you live at this address?',
                        nb: 'Bor du på denne adressen?',
                        nn: 'Bur du på denne adressa?',
                    },
                    verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                },
                værtINorgeITolvMåneder: {
                    label: {
                        en: 'Have you stayed continuously in Norway for the last twelve months?',
                        nb: 'Har du oppholdt deg sammenhengende i Norge de siste tolv månedene?',
                        nn: 'Har du opphalde deg samanhengande i Noreg dei siste tolv månadene?',
                    },
                    verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                },
                erAsylsøker: {
                    label: {
                        en: 'Are you an asylum seeker?',
                        nb: 'Er du asylsøker?',
                        nn: 'Er du asylsøkar?',
                    },
                    verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                },
                arbeidIUtlandet: {
                    label: {
                        en: "Do you or have you worked outside of Norway, on a foreign ship or on another country's continental shelf?",
                        nb: 'Arbeider eller har du arbeidet utenfor Norge, på utenlandsk skip eller på utenlandsk kontinentalsokkel?',
                        nn: 'Arbeider eller har du arbeidt utanfor Noreg, på utanlandsk skip eller på utanlandsk kontinentalsokkel?',
                    },
                    verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                },
                mottarUtenlandspensjon: {
                    label: {
                        en: 'Do you or have you received a pension from abroad?',
                        nb: 'Får eller har du fått pensjon fra utlandet?',
                        nn: 'Får eller har du fått pensjon frå utlandet?',
                    },
                    verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                },
                arbeidsland: {
                    label: { en: 'ukjent-spørsmål', nb: 'ukjent-spørsmål', nn: 'ukjent-spørsmål' },
                    verdi: { nb: 'Brunei', nn: 'Brunei', en: 'Brunei Darussalam' },
                },
                pensjonsland: {
                    label: { en: 'ukjent-spørsmål', nb: 'ukjent-spørsmål', nn: 'ukjent-spørsmål' },
                    verdi: { nb: 'Bahamas', nn: 'Bahamas', en: 'Bahamas' },
                },
                harSamboerNå: {
                    label: {
                        en: 'Are you currently living with a cohabiting partner that is not your spouse?',
                        nb: 'Har du en annen samboer enn din ektefelle nå?',
                        nn: 'Har du ein anna sambuar enn din ektefelle no?',
                    },
                    verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                },
            },
            tidligereSamboere: [],
            nåværendeSamboer: {
                label: { en: 'Cohabitant', nb: 'Samboer', nn: 'Sambuar' },
                verdi: {
                    nb: {
                        navn: {
                            label: {
                                en: 'Name of your cohabiting partner',
                                nb: 'Samboerens navn',
                                nn: 'Sambuaren sitt namn',
                            },
                            verdi: {
                                nb: 'asdasfafsasdasdas',
                                nn: 'asdasfafsasdasdas',
                                en: 'asdasfafsasdasdas',
                            },
                        },
                        ident: {
                            label: {
                                en: 'Norwegian National identity number or D number',
                                nb: 'Fødselsnummer eller d-nummer',
                                nn: 'Fødselsnummer eller d-nummer',
                            },
                            verdi: {
                                en: "I don't know the National identity number or-D number",
                                nb: 'Jeg kjenner ikke fødselsnummer eller d-nummer',
                                nn: 'Eg kjenner ikkje fødselsnummer eller d-nummer',
                            },
                        },
                        fødselsdato: {
                            label: { en: 'Date of birth', nb: 'Fødselsdato', nn: 'Fødselsdato' },
                            verdi: {
                                en: "I don't know the date of birth",
                                nb: 'Jeg kjenner ikke fødselsdato',
                                nn: 'Eg kjenner ikkje fødselsdato',
                            },
                        },
                        samboerFraDato: {
                            label: {
                                en: 'When did you start living together?',
                                nb: 'Når startet samboerforholdet?',
                                nn: 'Når starta sambuarforholdet?',
                            },
                            verdi: { nb: '2022-01-01', nn: '2022-01-01', en: '2022-01-01' },
                        },
                    },
                    nn: {
                        navn: {
                            label: {
                                en: 'Name of your cohabiting partner',
                                nb: 'Samboerens navn',
                                nn: 'Sambuaren sitt namn',
                            },
                            verdi: {
                                nb: 'asdasfafsasdasdas',
                                nn: 'asdasfafsasdasdas',
                                en: 'asdasfafsasdasdas',
                            },
                        },
                        ident: {
                            label: {
                                en: 'Norwegian National identity number or D number',
                                nb: 'Fødselsnummer eller d-nummer',
                                nn: 'Fødselsnummer eller d-nummer',
                            },
                            verdi: {
                                en: "I don't know the National identity number or-D number",
                                nb: 'Jeg kjenner ikke fødselsnummer eller d-nummer',
                                nn: 'Eg kjenner ikkje fødselsnummer eller d-nummer',
                            },
                        },
                        fødselsdato: {
                            label: { en: 'Date of birth', nb: 'Fødselsdato', nn: 'Fødselsdato' },
                            verdi: {
                                en: "I don't know the date of birth",
                                nb: 'Jeg kjenner ikke fødselsdato',
                                nn: 'Eg kjenner ikkje fødselsdato',
                            },
                        },
                        samboerFraDato: {
                            label: {
                                en: 'When did you start living together?',
                                nb: 'Når startet samboerforholdet?',
                                nn: 'Når starta sambuarforholdet?',
                            },
                            verdi: { nb: '2022-01-01', nn: '2022-01-01', en: '2022-01-01' },
                        },
                    },
                    en: {
                        navn: {
                            label: {
                                en: 'Name of your cohabiting partner',
                                nb: 'Samboerens navn',
                                nn: 'Sambuaren sitt namn',
                            },
                            verdi: {
                                nb: 'asdasfafsasdasdas',
                                nn: 'asdasfafsasdasdas',
                                en: 'asdasfafsasdasdas',
                            },
                        },
                        ident: {
                            label: {
                                en: 'Norwegian National identity number or D number',
                                nb: 'Fødselsnummer eller d-nummer',
                                nn: 'Fødselsnummer eller d-nummer',
                            },
                            verdi: {
                                en: "I don't know the National identity number or-D number",
                                nb: 'Jeg kjenner ikke fødselsnummer eller d-nummer',
                                nn: 'Eg kjenner ikkje fødselsnummer eller d-nummer',
                            },
                        },
                        fødselsdato: {
                            label: { en: 'Date of birth', nb: 'Fødselsdato', nn: 'Fødselsdato' },
                            verdi: {
                                en: "I don't know the date of birth",
                                nb: 'Jeg kjenner ikke fødselsdato',
                                nn: 'Eg kjenner ikkje fødselsdato',
                            },
                        },
                        samboerFraDato: {
                            label: {
                                en: 'When did you start living together?',
                                nb: 'Når startet samboerforholdet?',
                                nn: 'Når starta sambuarforholdet?',
                            },
                            verdi: { nb: '2022-01-01', nn: '2022-01-01', en: '2022-01-01' },
                        },
                    },
                },
            },
            arbeidsperioderUtland: [],
            arbeidsperioderNorge: [],
            pensjonsperioderUtland: [],
            pensjonsperioderNorge: [],
            andreUtbetalingsperioder: [],
        },
        barn: [
            {
                harEøsSteg: true,
                navn: {
                    label: { en: 'Name', nb: 'Navn', nn: 'Namn' },
                    verdi: {
                        nb: 'Barn 234567 89876',
                        nn: 'Barn 234567 89876',
                        en: 'Barn 234567 89876',
                    },
                },
                ident: {
                    label: { en: 'Ident', nb: 'Ident', nn: 'Ident' },
                    verdi: { nb: '23456789876', nn: '23456789876', en: '23456789876' },
                },
                registrertBostedType: {
                    label: {
                        en: 'Registered place of residence',
                        nb: 'Registrert bosted',
                        nn: 'Registrert bustad',
                    },
                    verdi: { nb: 'ADRESSESPERRE', nn: 'ADRESSESPERRE', en: 'ADRESSESPERRE' },
                },
                alder: {
                    label: { en: 'Age', nb: 'Alder', nn: 'Alder' },
                    verdi: { en: '13 years', nb: '13 år', nn: '13 år' },
                },
                utenlandsperioder: [],
                eøsBarnetrygdsperioder: [],
                idNummer: [],
                andreForelder: {
                    kanIkkeGiOpplysninger: {
                        label: {
                            en: 'I am unable to provide information about the other parent',
                            nb: 'Jeg kan ikke gi opplysninger om den andre forelderen',
                            nn: 'Eg kan ikkje gje opplysningar om den andre forelderen',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    navn: {
                        label: { en: 'Name', nb: 'Navn', nn: 'Namn' },
                        verdi: { nb: 'jajajajajajaja', nn: 'jajajajajajaja', en: 'jajajajajajaja' },
                    },
                    fnr: {
                        label: {
                            en: 'Norwegian National identity number or D number',
                            nb: 'Fødselsnummer eller d-nummer',
                            nn: 'Fødselsnummer eller d-nummer',
                        },
                        verdi: {
                            en: "I don't know their National identity number or-D number",
                            nb: 'Jeg kjenner ikke fødselsnummer eller d-nummer',
                            nn: 'Eg kjenner ikkje fødselsnummer eller d-nummer',
                        },
                    },
                    fødselsdato: {
                        label: { en: 'Date of birth', nb: 'Fødselsdato', nn: 'Fødselsdato' },
                        verdi: {
                            en: "I don't know the date of birth",
                            nb: 'Jeg kjenner ikke fødselsdato',
                            nn: 'Eg kjenner ikkje fødselsdato',
                        },
                    },
                    pensjonUtland: {
                        label: {
                            en: "Does Barn 234567 89876's other parent receive, or have they received a pension from abroad?",
                            nb: 'Får eller har den andre forelderen til Barn 234567 89876 fått pensjon fra utlandet?',
                            nn: 'Får eller har den andre forelderen til Barn 234567 89876 fått pensjon frå utlandet?',
                        },
                        verdi: { nb: 'VET_IKKE', nn: 'VET_IKKE', en: 'VET_IKKE' },
                    },
                    arbeidUtlandet: {
                        label: {
                            en: "Does Barn 234567 89876's other parent work, or have they worked outside of Norway, on a foreign ship or on a foreign continental shelf?",
                            nb: 'Arbeider eller har den andre forelderen til Barn 234567 89876 arbeidet utenfor Norge, på utenlandsk skip eller på utenlandsk kontinentalsokkel?',
                            nn: 'Arbeider eller har den andre forelderen til Barn 234567 89876 arbeidt utanfor Noreg, på utanlandsk skip eller på utanlandsk kontinentalsokkel?',
                        },
                        verdi: { nb: 'VET_IKKE', nn: 'VET_IKKE', en: 'VET_IKKE' },
                    },
                    pensjonNorge: null,
                    arbeidNorge: null,
                    andreUtbetalinger: null,
                    pågåendeSøknadFraAnnetEøsLand: {
                        label: {
                            en: "Does Barn 234567 89876's other parent have an active application for child benefit from another EEA country?",
                            nb: 'Har Barn 234567 89876 sin andre forelder en pågående søknad om barnetrygd fra et annet EU/EØS land?',
                            nn: 'Har Barn 234567 89876 sin andre forelder ein pågåande søknad om barnetrygd frå eit anna EU/EØS-land?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    pågåendeSøknadHvilketLand: {
                        label: {
                            en: "What country has Barn 234567 89876's other parent applied for child benefit from?",
                            nb: 'Hvilket land har Barn 234567 89876 sin andre forelder søkt om barnetrygd fra?',
                            nn: 'Kva land har Barn 234567 89876 sin andre forelder søkt om barnetrygd frå?',
                        },
                        verdi: { nb: 'Belgia', nn: 'Belgia', en: 'Belgium' },
                    },
                    barnetrygdFraEøs: {
                        label: {
                            en: "Is Barn 234567 89876's other parent receiving or have they received child benefit from another EEA country?",
                            nb: 'Får eller har Barn 234567 89876 sin andre forelder fått barnetrygd fra et annet EU/EØS land?',
                            nn: 'Får eller har Barn 234567 89876 sin andre forelder fått barnetrygd frå eit anna EU/EØS-land?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    skriftligAvtaleOmDeltBosted: {
                        label: {
                            en: 'Do you and the other parent have a written agreement on dual residence for Barn 234567 89876?',
                            nb: 'Har du og den andre forelderen skriftlig avtale om delt bosted for Barn 234567 89876?',
                            nn: 'Har du og den andre forelderen skriftleg avtale om delt bustad for Barn 234567 89876?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    adresse: {
                        label: {
                            en: "Where is Barn 234567 89876's other parent living during the period for which you are applying for child benefit?",
                            nb: 'Hvor bor Barn 234567 89876 sin andre forelder i perioden det søkes om barnetrygd?',
                            nn: 'Kor bur Barn 234567 89876 sin andre forelder i perioden det vert søkt om barnetrygd?',
                        },
                        verdi: {
                            nb: 'Heisannveien 14',
                            nn: 'Heisannveien 14',
                            en: 'Heisannveien 14',
                        },
                    },
                    utvidet: {
                        søkerHarBoddMedAndreForelder: null,
                        søkerFlyttetFraAndreForelderDato: null,
                    },
                    arbeidsperioderUtland: [],
                    pensjonsperioderUtland: [],
                    arbeidsperioderNorge: [],
                    pensjonsperioderNorge: [],
                    andreUtbetalingsperioder: [],
                    eøsBarnetrygdsperioder: [],
                    idNummer: [],
                },
                omsorgsperson: null,
                spørsmål: {
                    erFosterbarn: {
                        label: {
                            en: 'Which of the children are foster children?',
                            nb: 'Hvem av barna er fosterbarn?',
                            nn: 'Kven av barna er fosterbarn?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    erAdoptertFraUtland: {
                        label: {
                            en: 'Which of the children are adopted from abroad?',
                            nb: 'Hvem av barna er adoptert fra utlandet?',
                            nn: 'Kven av barna er adoptert frå utlandet?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    erAsylsøker: {
                        label: {
                            en: 'For which of the children has an application for asylum been submitted?',
                            nb: 'Hvem av barna er det søkt om asyl for?',
                            nn: 'Kven av barna er det søkt om asyl for?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    barnetrygdFraAnnetEøsland: {
                        label: {
                            en: 'For which of the children are you receiving, have received or have applied for child benefit?',
                            nb: 'Hvem av barna får du, har du fått eller har du søkt om barnetrygd for?',
                            nn: 'Kven av barna får du, har du fått eller har du søkt om barnetrygd for?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    andreForelderErDød: {
                        label: {
                            en: 'Which of the children is your previous spouse/cohabiting partner the parent of?',
                            nb: 'Hvem av barna er din tidligere ektefelle/samboer forelder til?',
                            nn: 'Kven av barna er din tidlegare ektefelle/sambuar forelder til?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    oppholderSegIInstitusjon: {
                        label: {
                            en: 'Which of the children are in an institution?',
                            nb: 'Hvem av barna er i institusjon?',
                            nn: 'Kven av barna er seg i institusjon?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    institusjonIUtland: {
                        label: {
                            en: 'The institution is outside of Norway',
                            nb: 'Institusjonen er i utlandet',
                            nn: 'Institusjonen er i utlandet',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    boddMindreEnn12MndINorge: {
                        label: {
                            en: 'Which of the children have stayed outside of Norway during the last twelve months?',
                            nb: 'Hvem av barna har oppholdt seg utenfor Norge i løpet av de siste tolv månedene?',
                            nn: 'Kven av barna har oppheldt seg utanfor Noreg i løpet av dei siste tolv månadene?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    borFastMedSøker: {
                        label: {
                            en: 'Does Barn 234567 89876 live with you on a permanent basis?',
                            nb: 'Bor Barn 234567 89876 fast sammen med deg?',
                            nn: 'Bur Barn 234567 89876 fast saman med deg?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    institusjonOppholdSluttdato: {
                        label: {
                            en: 'When is the stay at the institution ending?',
                            nb: 'Når avsluttes institusjonsoppholdet?',
                            nn: 'Når avsluttast institusjonsopphaldet?',
                        },
                        verdi: { nb: '', nn: '', en: '' },
                    },
                    adresse: {
                        label: {
                            en: "Where is Barn 234567 89876's living during the period for which you are applying for child benefit?",
                            nb: 'Hvor bor Barn 234567 89876 i perioden det søkes om barnetrygd?',
                            nn: 'Kor bur Barn 234567 89876 i perioden det vert søkt om barnetrygd?',
                        },
                        verdi: { nb: 'Vei 12', nn: 'Vei 12', en: 'Vei 12' },
                    },
                },
            },
            {
                harEøsSteg: true,
                navn: {
                    label: { en: 'Name', nb: 'Navn', nn: 'Namn' },
                    verdi: {
                        nb: 'Barn Barnessen III',
                        nn: 'Barn Barnessen III',
                        en: 'Barn Barnessen III',
                    },
                },
                ident: {
                    label: { en: 'Ident', nb: 'Ident', nn: 'Ident' },
                    verdi: { nb: '12345678987', nn: '12345678987', en: '12345678987' },
                },
                registrertBostedType: {
                    label: {
                        en: 'Registered place of residence',
                        nb: 'Registrert bosted',
                        nn: 'Registrert bustad',
                    },
                    verdi: {
                        nb: 'REGISTRERT_SOKERS_ADRESSE',
                        nn: 'REGISTRERT_SOKERS_ADRESSE',
                        en: 'REGISTRERT_SOKERS_ADRESSE',
                    },
                },
                alder: {
                    label: { en: 'Age', nb: 'Alder', nn: 'Alder' },
                    verdi: { en: '12 years', nb: '12 år', nn: '12 år' },
                },
                utenlandsperioder: [
                    {
                        label: {
                            en: 'Stay abroad 1',
                            nb: 'Utenlandsopphold 1',
                            nn: 'Utanlandsopphald 1',
                        },
                        verdi: {
                            nb: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period Barn Barnessen III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden Barn Barnessen III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden Barn Barnessen III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child is currently staying outside of Norway',
                                        nb: 'Barnet oppholder seg utenfor Norge nå',
                                        nn: 'Barnet oppheld seg utanfor Noreg no',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country is Barn Barnessen III currently in?',
                                        nb: 'Hvilket land oppholder Barn Barnessen III seg i?',
                                        nn: 'Kva land oppheld Barn Barnessen III seg i?',
                                    },
                                    verdi: { nb: 'Hellas', nn: 'Hellas', en: 'Greece' },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: { nb: '2022-01-12', nn: '2022-01-12', en: '2022-01-12' },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When is the stay ending?',
                                        nb: 'Når avsluttes oppholdet?',
                                        nn: 'Når skal opphaldet avsluttast?',
                                    },
                                    verdi: {
                                        en: 'I do not know when the stay is ending',
                                        nb: 'Jeg vet ikke når oppholdet avsluttes',
                                        nn: 'Eg veit ikkje når opphaldet skal avsluttast',
                                    },
                                },
                            },
                            nn: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period Barn Barnessen III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden Barn Barnessen III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden Barn Barnessen III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child is currently staying outside of Norway',
                                        nb: 'Barnet oppholder seg utenfor Norge nå',
                                        nn: 'Barnet oppheld seg utanfor Noreg no',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country is Barn Barnessen III currently in?',
                                        nb: 'Hvilket land oppholder Barn Barnessen III seg i?',
                                        nn: 'Kva land oppheld Barn Barnessen III seg i?',
                                    },
                                    verdi: { nb: 'Hellas', nn: 'Hellas', en: 'Greece' },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: { nb: '2022-01-12', nn: '2022-01-12', en: '2022-01-12' },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When is the stay ending?',
                                        nb: 'Når avsluttes oppholdet?',
                                        nn: 'Når skal opphaldet avsluttast?',
                                    },
                                    verdi: {
                                        en: 'I do not know when the stay is ending',
                                        nb: 'Jeg vet ikke når oppholdet avsluttes',
                                        nn: 'Eg veit ikkje når opphaldet skal avsluttast',
                                    },
                                },
                            },
                            en: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period Barn Barnessen III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden Barn Barnessen III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden Barn Barnessen III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child is currently staying outside of Norway',
                                        nb: 'Barnet oppholder seg utenfor Norge nå',
                                        nn: 'Barnet oppheld seg utanfor Noreg no',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country is Barn Barnessen III currently in?',
                                        nb: 'Hvilket land oppholder Barn Barnessen III seg i?',
                                        nn: 'Kva land oppheld Barn Barnessen III seg i?',
                                    },
                                    verdi: { nb: 'Hellas', nn: 'Hellas', en: 'Greece' },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: { nb: '2022-01-12', nn: '2022-01-12', en: '2022-01-12' },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When is the stay ending?',
                                        nb: 'Når avsluttes oppholdet?',
                                        nn: 'Når skal opphaldet avsluttast?',
                                    },
                                    verdi: {
                                        en: 'I do not know when the stay is ending',
                                        nb: 'Jeg vet ikke når oppholdet avsluttes',
                                        nn: 'Eg veit ikkje når opphaldet skal avsluttast',
                                    },
                                },
                            },
                        },
                    },
                    {
                        label: {
                            en: 'Stay abroad 2',
                            nb: 'Utenlandsopphold 2',
                            nn: 'Utanlandsopphald 2',
                        },
                        verdi: {
                            nb: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period Barn Barnessen III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden Barn Barnessen III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden Barn Barnessen III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child is currently staying outside of Norway',
                                        nb: 'Barnet oppholder seg utenfor Norge nå',
                                        nn: 'Barnet oppheld seg utanfor Noreg no',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country is Barn Barnessen III currently in?',
                                        nb: 'Hvilket land oppholder Barn Barnessen III seg i?',
                                        nn: 'Kva land oppheld Barn Barnessen III seg i?',
                                    },
                                    verdi: { nb: 'Tuvalu', nn: 'Tuvalu', en: 'Tuvalu' },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: { nb: '2022-01-10', nn: '2022-01-10', en: '2022-01-10' },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When is the stay ending?',
                                        nb: 'Når avsluttes oppholdet?',
                                        nn: 'Når skal opphaldet avsluttast?',
                                    },
                                    verdi: {
                                        en: 'I do not know when the stay is ending',
                                        nb: 'Jeg vet ikke når oppholdet avsluttes',
                                        nn: 'Eg veit ikkje når opphaldet skal avsluttast',
                                    },
                                },
                            },
                            nn: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period Barn Barnessen III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden Barn Barnessen III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden Barn Barnessen III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child is currently staying outside of Norway',
                                        nb: 'Barnet oppholder seg utenfor Norge nå',
                                        nn: 'Barnet oppheld seg utanfor Noreg no',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country is Barn Barnessen III currently in?',
                                        nb: 'Hvilket land oppholder Barn Barnessen III seg i?',
                                        nn: 'Kva land oppheld Barn Barnessen III seg i?',
                                    },
                                    verdi: { nb: 'Tuvalu', nn: 'Tuvalu', en: 'Tuvalu' },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: { nb: '2022-01-10', nn: '2022-01-10', en: '2022-01-10' },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When is the stay ending?',
                                        nb: 'Når avsluttes oppholdet?',
                                        nn: 'Når skal opphaldet avsluttast?',
                                    },
                                    verdi: {
                                        en: 'I do not know when the stay is ending',
                                        nb: 'Jeg vet ikke når oppholdet avsluttes',
                                        nn: 'Eg veit ikkje når opphaldet skal avsluttast',
                                    },
                                },
                            },
                            en: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period Barn Barnessen III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden Barn Barnessen III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden Barn Barnessen III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child is currently staying outside of Norway',
                                        nb: 'Barnet oppholder seg utenfor Norge nå',
                                        nn: 'Barnet oppheld seg utanfor Noreg no',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country is Barn Barnessen III currently in?',
                                        nb: 'Hvilket land oppholder Barn Barnessen III seg i?',
                                        nn: 'Kva land oppheld Barn Barnessen III seg i?',
                                    },
                                    verdi: { nb: 'Tuvalu', nn: 'Tuvalu', en: 'Tuvalu' },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: { nb: '2022-01-10', nn: '2022-01-10', en: '2022-01-10' },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When is the stay ending?',
                                        nb: 'Når avsluttes oppholdet?',
                                        nn: 'Når skal opphaldet avsluttast?',
                                    },
                                    verdi: {
                                        en: 'I do not know when the stay is ending',
                                        nb: 'Jeg vet ikke når oppholdet avsluttes',
                                        nn: 'Eg veit ikkje når opphaldet skal avsluttast',
                                    },
                                },
                            },
                        },
                    },
                ],
                eøsBarnetrygdsperioder: [],
                idNummer: [],
                andreForelder: null,
                omsorgsperson: null,
                spørsmål: {
                    erFosterbarn: {
                        label: {
                            en: 'Which of the children are foster children?',
                            nb: 'Hvem av barna er fosterbarn?',
                            nn: 'Kven av barna er fosterbarn?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    erAdoptertFraUtland: {
                        label: {
                            en: 'Which of the children are adopted from abroad?',
                            nb: 'Hvem av barna er adoptert fra utlandet?',
                            nn: 'Kven av barna er adoptert frå utlandet?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    erAsylsøker: {
                        label: {
                            en: 'For which of the children has an application for asylum been submitted?',
                            nb: 'Hvem av barna er det søkt om asyl for?',
                            nn: 'Kven av barna er det søkt om asyl for?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    barnetrygdFraAnnetEøsland: {
                        label: {
                            en: 'For which of the children are you receiving, have received or have applied for child benefit?',
                            nb: 'Hvem av barna får du, har du fått eller har du søkt om barnetrygd for?',
                            nn: 'Kven av barna får du, har du fått eller har du søkt om barnetrygd for?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    andreForelderErDød: {
                        label: {
                            en: 'Which of the children is your previous spouse/cohabiting partner the parent of?',
                            nb: 'Hvem av barna er din tidligere ektefelle/samboer forelder til?',
                            nn: 'Kven av barna er din tidlegare ektefelle/sambuar forelder til?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    oppholderSegIInstitusjon: {
                        label: {
                            en: 'Which of the children are in an institution?',
                            nb: 'Hvem av barna er i institusjon?',
                            nn: 'Kven av barna er seg i institusjon?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    institusjonIUtland: {
                        label: {
                            en: 'The institution is outside of Norway',
                            nb: 'Institusjonen er i utlandet',
                            nn: 'Institusjonen er i utlandet',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    institusjonsnavn: {
                        label: {
                            en: 'Name of the institution',
                            nb: 'Navnet på institusjonen',
                            nn: 'Namn på institusjonen',
                        },
                        verdi: {
                            nb: 'asdasdasdgsegse',
                            nn: 'asdasdasdgsegse',
                            en: 'asdasdasdgsegse',
                        },
                    },
                    institusjonsadresse: {
                        label: {
                            en: 'Address of the institution',
                            nb: 'Adressen til institusjonen',
                            nn: 'Adressa til institusjonen',
                        },
                        verdi: {
                            nb: 'gadgweegewrsgsefaegse',
                            nn: 'gadgweegewrsgsefaegse',
                            en: 'gadgweegewrsgsefaegse',
                        },
                    },
                    institusjonspostnummer: {
                        label: { en: 'Post code', nb: 'Postnummer', nn: 'Postnummer' },
                        verdi: { nb: '4342', nn: '4342', en: '4342' },
                    },
                    institusjonOppholdStartdato: {
                        label: {
                            en: 'When did the stay at the institution start?',
                            nb: 'Når startet institusjonsoppholdet?',
                            nn: 'Når starta institusjonsopphaldet?',
                        },
                        verdi: { nb: '2022-01-06', nn: '2022-01-06', en: '2022-01-06' },
                    },
                    boddMindreEnn12MndINorge: {
                        label: {
                            en: 'Which of the children have stayed outside of Norway during the last twelve months?',
                            nb: 'Hvem av barna har oppholdt seg utenfor Norge i løpet av de siste tolv månedene?',
                            nn: 'Kven av barna har oppheldt seg utanfor Noreg i løpet av dei siste tolv månadene?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    planleggerÅBoINorge12Mnd: {
                        label: {
                            en: 'Is it planned that Barn Barnessen III will live in Norway continuously for more than 12 months?',
                            nb: 'Er det planlagt at Barn Barnessen III skal bo sammenhengende i Norge i mer enn tolv måneder?',
                            nn: 'Er det planlagd at Barn Barnessen III skal bu i Noreg samanhengande i meir enn tolv månadar?',
                        },
                        verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
                    },
                    borFastMedSøker: {
                        label: {
                            en: 'Does Barn Barnessen III live with you on a permanent basis?',
                            nb: 'Bor Barn Barnessen III fast sammen med deg?',
                            nn: 'Bur Barn Barnessen III fast saman med deg?',
                        },
                        verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
                    },
                    institusjonOppholdSluttdato: {
                        label: {
                            en: 'When is the stay at the institution ending?',
                            nb: 'Når avsluttes institusjonsoppholdet?',
                            nn: 'Når avsluttast institusjonsopphaldet?',
                        },
                        verdi: { nb: '2022-01-21', nn: '2022-01-21', en: '2022-01-21' },
                    },
                    adresse: {
                        label: {
                            en: "Where is Barn Barnessen III's living during the period for which you are applying for child benefit?",
                            nb: 'Hvor bor Barn Barnessen III i perioden det søkes om barnetrygd?',
                            nn: 'Kor bur Barn Barnessen III i perioden det vert søkt om barnetrygd?',
                        },
                        verdi: { nb: 'Vei 12', nn: 'Vei 12', en: 'Vei 12' },
                    },
                },
            },
        ],
        spørsmål: {
            erNoenAvBarnaFosterbarn: {
                label: {
                    en: 'Are any of the children foster children?',
                    nb: 'Er noen av barna fosterbarn?',
                    nn: 'Er nokre av barna fosterbarn?',
                },
                verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
            },
            søktAsylForBarn: {
                label: {
                    en: 'Has an application for asylum been submitted for any of the children?',
                    nb: 'Er det søkt om asyl i Norge for noen av barna?',
                    nn: 'Er det søkt om asyl i Noreg for nokre av barna?',
                },
                verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
            },
            oppholderBarnSegIInstitusjon: {
                label: {
                    en: 'Are any of the children in a child welfare institution or other institution?',
                    nb: 'Er noen av barna i barnverninstitusjon eller i annen institusjon?',
                    nn: 'Er nokre av barna i barneverninstitusjon eller i anna institusjon?',
                },
                verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                label: {
                    en: 'Have the children stayed continuously in Norway during the last twelve months?',
                    nb: 'Har barna oppholdt seg sammenhengende i Norge de siste tolv månedene?',
                    nn: 'Har barna oppheldt seg samanhengande i Noreg dei siste tolv månadene?',
                },
                verdi: { nb: 'NEI', nn: 'NEI', en: 'NEI' },
            },
            erBarnAdoptertFraUtland: {
                label: {
                    en: 'Are any of the children adopted from abroad?',
                    nb: 'Er noen av barna adoptert fra utlandet?',
                    nn: 'Er nokre av barna adoptert frå utlandet?',
                },
                verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
            },
            mottarBarnetrygdForBarnFraAnnetEøsland: {
                label: {
                    en: 'Are you receiving, have you received or have you applied for child benefit for some of the children from another EEA country?',
                    nb: 'Får, har du fått eller har du søkt om barnetrygd for noen av barna fra et annet EØS land?',
                    nn: 'Får du, har du fått eller har du søkt om barnetrygd for nokre av barna frå eit anna EØS land?',
                },
                verdi: { nb: 'JA', nn: 'JA', en: 'JA' },
            },
            erAvdødPartnerForelder: {
                label: {
                    en: 'You are registered as a widow/widower in the Norwegian National Registry (folkeregisteret). Is your previous spouse the parent of any of the children you are applying for child benefit for?',
                    nb: 'Du er folkeregistrert som enke/enkemann. Er din tidligere ektefelle forelder til noen av barna du søker barnetrygd for?',
                    nn: 'Du er folkeregistrert som enke/enkemann. Er din tidlegare ektefelle forelder til nokre av barna du søker barnetrygd for?',
                },
                verdi: { nb: null, nn: null, en: null },
            },
            lestOgForståttBekreftelse: {
                label: {
                    en: 'I am aware that I may lose my right to Child Benefit if I provide incorrect information. I am also aware that I will have to pay back any money I receive that I am not entitled to, that I have received if I have failed to provide information or have provided incorrect information.',
                    nb: 'Det er viktig at du gir oss riktige opplysninger slik at vi kan behandle saken din.',
                    nn: 'Det er viktig at du gir oss riktige opplysningar slik at me kan behandla saka di.',
                },
                verdi: {
                    en: 'I confirm that I will provide correct and complete information.',
                    nb: 'Jeg vil svare så godt jeg kan på spørsmålene i søknaden.',
                    nn: 'Eg svara så godt eg kan på spørsmåla i søknaden.',
                },
            },
        },
        dokumentasjon: [
            {
                dokumentasjonsbehov: 'AVTALE_DELT_BOSTED',
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        navn: 'sc1.jpeg',
                        dokumentId: 'c2225220-2390-45b4-bae4-25a3300a4ffe',
                        tittel: 'AVTALE_DELT_BOSTED',
                    },
                ],
                dokumentasjonSpråkTittel: {
                    en: 'Agreement on dual residence for children',
                    nb: 'Avtale om delt bosted',
                    nn: 'Avtale om delt bustad',
                },
            },
            {
                dokumentasjonsbehov: 'VEDTAK_OPPHOLDSTILLATELSE',
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        navn: 'sc1.jpeg',
                        dokumentId: '7d982124-4be9-4748-8e13-05ea49ea94cb',
                        tittel: 'VEDTAK_OPPHOLDSTILLATELSE',
                    },
                ],
                dokumentasjonSpråkTittel: {
                    en: 'Decision on permission to reside',
                    nb: 'Vedtak om oppholdstillatelse',
                    nn: 'Vedtak om opphaldsløyve',
                },
            },
            {
                dokumentasjonsbehov: 'ADOPSJON_DATO',
                harSendtInn: true,
                opplastedeVedlegg: [],
                dokumentasjonSpråkTittel: {
                    en: 'Confirmation of the date on which you assumed the care of the child in connection with adoption',
                    nb: 'Bekreftelse på dato du overtok omsorgen ved adopsjon',
                    nn: 'Stadfesting på dato du overtok omsorga ved adopsjon',
                },
            },
            {
                dokumentasjonsbehov: 'BEKREFTELSE_FRA_BARNEVERN',
                harSendtInn: true,
                opplastedeVedlegg: [],
                dokumentasjonSpråkTittel: {
                    en: 'Confirmation from the Child Welfare Service (barnevernet)',
                    nb: 'Bekreftelse fra barnevernet',
                    nn: 'Stadfesting frå barnevernet',
                },
            },
            {
                dokumentasjonsbehov: 'BOR_FAST_MED_SØKER',
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        navn: 'sc1.jpeg',
                        dokumentId: '9daae107-a267-4121-a041-eb1e6e23e4ec',
                        tittel: 'BOR_FAST_MED_SØKER',
                    },
                ],
                dokumentasjonSpråkTittel: {
                    en: 'Confirmation that child lives with you',
                    nb: 'Bekreftelse på at barn bor sammen med deg',
                    nn: 'Stadfesting på at barn bur saman med deg',
                },
            },
            {
                dokumentasjonsbehov: 'ANNEN_DOKUMENTASJON',
                harSendtInn: false,
                opplastedeVedlegg: [
                    {
                        navn: 'sc1.jpeg',
                        dokumentId: '573c2729-4ca2-414a-ab65-079336353214',
                        tittel: 'ANNEN_DOKUMENTASJON',
                    },
                ],
                dokumentasjonSpråkTittel: {
                    en: 'Other documentation',
                    nb: 'Annen dokumentasjon',
                    nn: 'Anna dokumentasjon',
                },
            },
        ],
        teksterUtenomSpørsmål: {
            'hvilkebarn.barn.bosted.adressesperre': {
                en: 'The child is registered with a blocked address.',
                nb: 'Barnet er registrert med adressesperre.',
                nn: 'Barnet er registrert med adressesperre.',
            },
            'ombarnet.fosterbarn': {
                en: 'You have stated that {navn} is a foster child',
                nb: 'Du har opplyst at {navn} er fosterbarn',
                nn: 'Du har opplyst at {navn} er fosterbarn',
            },
            'ombarnet.institusjon': {
                en: 'You have stated that {navn} is in an institution',
                nb: 'Du har opplyst at {navn} er i institusjon',
                nn: 'Du har opplyst at {navn} er i institusjon',
            },
            'ombarnet.opplystatbarnutlandopphold.info': {
                en: 'You have stated that {navn} has stayed outside of Norway during the last twelve months',
                nb: 'Du har opplyst at {navn} har oppholdt seg utenfor Norge i løpet av de siste tolv månedene',
                nn: 'Du har opplyst at {navn} har oppheldt seg utanfor Noreg i løpet av dei siste tolv månadene',
            },
            'ombarnet.barnetrygd-eøs': {
                en: 'You have stated that you are receiving, have received or have applied for child benefit for {navn} from another EEA country.',
                nb: 'Du har opplyst at du får, har fått eller har søkt om barnetrygd for {navn} fra et annet EØS land.',
                nn: 'Du har opplyst at du får, har fått eller har søkt om barnetrygd for {navn} frå eit anna EØS land.',
            },
            'omdeg.annensamboer.spm': {
                en: 'Have you had a cohabiting partner earlier during the period for which you are applying for child benefit?',
                nb: 'Har du hatt samboer tidligere i perioden du søker barnetrygd for?',
                nn: 'Har du hatt sambuar tidlegare i perioden du søker barnetrygd for?',
            },
            'omdeg.personopplysninger.adressesperre.alert': {
                en: 'You are registered with a blocked address',
                nb: 'Du er registrert med adressesperre',
                nn: 'Du er registrert med adressesperre',
            },
            'omdeg.personopplysninger.ikke-registrert.alert': {
                en: 'You are not registered with a residential address in Norway',
                nb: 'Du er ikke registrert med bostedsadresse i Norge',
                nn: 'Du er ikkje registrert med bustadsadresse i Noreg',
            },
            'pdf.andreforelder.seksjonstittel': {
                en: "Child's other parent",
                nb: 'Barnets andre forelder',
                nn: 'Barnet sin andre forelder',
            },
            'pdf.hvilkebarn.seksjonstittel': {
                en: 'Which children are you applying for?',
                nb: 'Hvilke barn søker du for?',
                nn: 'Kva barn søker du for?',
            },
            'pdf.hvilkebarn.registrert-på-adresse': {
                en: "Registered on applicant's address",
                nb: 'Registrert på søkers adresse',
                nn: 'Registrert på søkars adresse',
            },
            'pdf.hvilkebarn.ikke-registrert-på-adresse': {
                en: "Not registered on applicant's address",
                nb: 'Ikke registrert på søkers adresse',
                nn: 'Ikkje registrert på søkars adresse',
            },
            'pdf.ombarnet.seksjonstittel': { en: 'About {navn}', nb: 'Om {navn}', nn: 'Om {navn}' },
            'pdf.omdeg.seksjonstittel': { en: 'About you', nb: 'Om deg', nn: 'Om deg' },
            'pdf.bosted.seksjonstittel': { en: 'Place of residence', nb: 'Bosted', nn: 'Bustad' },
            'pdf.ombarna.seksjonstittel': {
                en: 'About your children',
                nb: 'Om barna dine',
                nn: 'Om barna dine',
            },
            'pdf.søker.seksjonstittel': { en: 'Applicant', nb: 'Søker', nn: 'Søkar' },
            'pdf.vedlegg.seksjonstittel': {
                en: 'List of attachments',
                nb: 'Liste over vedlegg',
                nn: 'Liste over vedlegg',
            },
            'pdf.vedlegg.lastet-opp-antall': {
                en: 'Uploaded {antall} attachments',
                nb: 'Lastet opp {antall} vedlegg',
                nn: 'Lasta opp {antall} vedlegg',
            },
            'pdf.vedlegg.nummerering': {
                en: 'Attachment {x} of {total}',
                nb: 'Vedlegg {x} av {total}',
                nn: 'Vedlegg {x} av {total}',
            },
            'dokumentasjon.har-sendt-inn.spm': {
                en: 'I have already submitted this documentation to Nav in the past',
                nb: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
                nn: 'Eg har sendt inn denne dokumentasjonen til Nav tidlegare',
            },
            'dinlivssituasjon.sidetittel': {
                en: 'Your life situation',
                nb: 'Livssituasjonen din',
                nn: 'Livssituasjonen din',
            },
            'pdf.dinlivssituasjon.tidligeresamboer.seksjonstittel': {
                en: 'Former cohabitant {x}',
                nb: 'Tidligere samboer {x}',
                nn: 'Tidlegare sambuar {x}',
            },
            'eøs-om-deg.sidetittel': {
                en: 'Child benefit by the EEA-regulations - About you',
                nb: 'Barnetrygd etter EØS-reglene - Om deg',
                nn: 'Barnetrygd etter EØS-reglane - Om deg',
            },
            'eøs-om-barn.sidetittel': {
                en: 'Child benefit by the EEA-regulations - About {barn}',
                nb: 'Barnetrygd etter EØS-reglene - Om {barn}',
                nn: 'Barnetrygd etter EØS-reglane - Om {barn}',
            },
            'felles.sivilstatus.kode.GIFT': { en: 'Married', nb: 'Gift', nn: 'Gift' },
            'felles.sivilstatus.kode.ENKE_ELLER_ENKEMANN': {
                en: 'Widow(er)',
                nb: 'Enke/Enkemann',
                nn: 'Enke/enkemann',
            },
            'felles.sivilstatus.kode.SKILT': { en: 'Divorced', nb: 'Skilt', nn: 'Skilt' },
            'felles.sivilstatus.kode.SEPARERT': { en: 'Separated', nb: 'Separert', nn: 'Separert' },
            'felles.sivilstatus.kode.REGISTRERT_PARTNER': {
                en: 'Registered partner',
                nb: 'Registrert partner',
                nn: 'Registrert partner',
            },
            'felles.sivilstatus.kode.SEPARERT_PARTNER': {
                en: 'Separated partner',
                nb: 'Separert partner',
                nn: 'Separert partner',
            },
            'felles.sivilstatus.kode.SKILT_PARTNER': {
                en: 'Divorced partner',
                nb: 'Skilt partner',
                nn: 'Skilt partner',
            },
            'felles.sivilstatus.kode.GJENLEVENDE_PARTNER': {
                en: 'Surviving partner',
                nb: 'Gjenlevende partner',
                nn: 'Attlevande partner',
            },
            'felles.sivilstatus.kode.UGIFT': { en: 'Unmarried', nb: 'Ugift', nn: 'Ugift' },
            'felles.sivilstatus.kode.UOPPGITT': {
                en: 'Not specified',
                nb: 'Ikke oppgitt',
                nn: 'Ikkje oppgitt',
            },
            'felles.svaralternativ.ja': { en: 'Yes', nb: 'Ja', nn: 'Ja' },
            'felles.svaralternativ.nei': { en: 'No', nb: 'Nei', nn: 'Nei' },
            'felles.svaralternativ.vetikke': {
                en: "Don't know",
                nb: 'Jeg vet ikke',
                nn: 'Eg veit ikkje',
            },
        },
        originalSpråk: 'nb',
    },
};

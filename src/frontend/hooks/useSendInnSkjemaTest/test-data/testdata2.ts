import { TilKontraktTestData } from './typer';

export const testdata2: TilKontraktTestData = {
    input: {
        søknadstype: 'ORDINÆR',
        erEøs: true,
        barnInkludertISøknaden: [
            {
                id: 'db2afce7-2607-461e-a056-682eab5546e4',
                navn: null,
                ident: '23456789876',
                alder: '13',
                borMedSøker: false,
                adressebeskyttelse: true,
                barnErFyltUt: true,
                utenlandsperioder: [
                    {
                        utenlandsoppholdÅrsak: {
                            id: 'årsak-utenlandsopphold',
                            svar: 'HAR_OPPHOLDT_SEG_UTENFOR_NORGE',
                        },
                        oppholdsland: {
                            id: 'land-utenlandsopphold',
                            svar: 'BEL',
                        },
                        oppholdslandFraDato: {
                            id: 'fra-dato-utenlandsopphold',
                            svar: '2022-01-01',
                        },
                        oppholdslandTilDato: {
                            id: 'til-dato-utenlandsopphold',
                            svar: '2022-01-08',
                        },
                    },
                    {
                        utenlandsoppholdÅrsak: {
                            id: 'årsak-utenlandsopphold',
                            svar: 'FLYTTET_PERMANENT_FRA_NORGE',
                        },
                        oppholdsland: {
                            id: 'land-utenlandsopphold',
                            svar: 'AFG',
                        },
                        oppholdslandFraDato: {
                            id: 'fra-dato-utenlandsopphold',
                            svar: '2022-01-12',
                        },
                    },
                ],
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
                    svar: 'JA',
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
                    svar: '2022-01-01',
                },
                institusjonOppholdSluttdato: {
                    id: 'institusjon-opphold-sluttdato',
                    svar: '2022-01-07',
                },
                boddMindreEnn12MndINorge: {
                    id: 'hvem-tolv-mnd-sammenhengende-i-norge',
                    svar: 'JA',
                },
                planleggerÅBoINorge12Mnd: {
                    id: 'barn-planlegger-å-bo-sammenhengende-i-norge-12mnd',
                    svar: null,
                },
                barnetrygdFraEøslandHvilketLand: {
                    id: 'barnetrygd-hvilket-eøsland',
                    svar: 'DNK',
                },
                borFastMedSøker: {
                    id: 'bor-barnet-fast-med-deg',
                    svar: 'NEI',
                },
                søkerForTidsrom: {
                    id: 'søker-for-tidsrom',
                    svar: 'JA',
                },
                søkerForTidsromStartdato: {
                    id: 'søker-for-tidsrom-startdato',
                    svar: '2022-01-01',
                },
                søkerForTidsromSluttdato: {
                    id: 'søker-for-tidsrom-sluttdato',
                    svar: '2022-01-06',
                },
            },
            {
                id: 'cc26acec-b3df-48ec-b25d-0791a85ad436',
                navn: 'Barn Barnessen III',
                ident: '12345678987',
                alder: '12',
                borMedSøker: true,
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
                ],
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
                    svar: 'UKJENT',
                },
                boddMindreEnn12MndINorge: {
                    id: 'hvem-tolv-mnd-sammenhengende-i-norge',
                    svar: 'JA',
                },
                planleggerÅBoINorge12Mnd: {
                    id: 'barn-planlegger-å-bo-sammenhengende-i-norge-12mnd',
                    svar: 'NEI',
                },
                barnetrygdFraEøslandHvilketLand: {
                    id: 'barnetrygd-hvilket-eøsland',
                    svar: 'BEL',
                },
                borFastMedSøker: {
                    id: 'bor-barnet-fast-med-deg',
                    svar: 'NEI',
                },
                søkerForTidsrom: {
                    id: 'søker-for-tidsrom',
                    svar: 'JA',
                },
                søkerForTidsromStartdato: {
                    id: 'søker-for-tidsrom-startdato',
                    svar: '2022-01-01',
                },
                søkerForTidsromSluttdato: {
                    id: 'søker-for-tidsrom-sluttdato',
                    svar: 'UKJENT',
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
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'VEDTAK_OPPHOLDSTILLATELSE',
                tittelSpråkId: 'dokumentasjon.oppholdstillatelse.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.oppholdstillatelse.informasjon',
                gjelderForBarnId: [
                    'db2afce7-2607-461e-a056-682eab5546e4',
                    'cc26acec-b3df-48ec-b25d-0791a85ad436',
                ],
                gjelderForSøker: true,
                harSendtInn: false,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'ADOPSJON_DATO',
                tittelSpråkId: 'dokumentasjon.adopsjon.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.adopsjon.informasjon',
                gjelderForBarnId: [
                    'db2afce7-2607-461e-a056-682eab5546e4',
                    'cc26acec-b3df-48ec-b25d-0791a85ad436',
                ],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'BEKREFTELSE_FRA_BARNEVERN',
                tittelSpråkId: 'dokumentasjon.bekreftelsebarnevernet.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.bekreftelsebarnevernet.informasjon',
                gjelderForBarnId: [
                    'db2afce7-2607-461e-a056-682eab5546e4',
                    'cc26acec-b3df-48ec-b25d-0791a85ad436',
                ],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'BOR_FAST_MED_SØKER',
                tittelSpråkId: 'dokumentasjon.bekreftelseborsammen.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.bekreftelseborsammen.informasjon',
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [],
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
                dokumentasjonsbehov: 'EØS_SKJEMA',
                tittelSpråkId: 'dokumentasjon.tilleggsskjema.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.tilleggsskjema.informasjon',
                gjelderForBarnId: [],
                gjelderForSøker: true,
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
                opplastedeVedlegg: [],
            },
        ],
        søker: {
            navn: 'Voksen Voksnessen',
            barn: [
                {
                    id: 'db2afce7-2607-461e-a056-682eab5546e4',
                    navn: null,
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
            idNummer: [{ idnummer: '123', land: 'BEL' }],
            adresseISøkeperiode: { id: 'eøs-om-deg.dittoppholdssted.spm', svar: '' },
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
            jobberPåBåt: {
                id: 'jobber-på-båt',
                svar: 'JA',
            },
            arbeidsland: {
                id: 'arbeidsland',
                svar: 'BEL',
            },
            mottarUtenlandspensjon: {
                id: 'mottar-utenlandspensjon',
                svar: 'JA',
            },
            pensjonsland: {
                id: 'pensjonsland',
                svar: 'BEL',
            },
            arbeidsperioderUtland: [],
            arbeidsperioderNorge: [],
            pensjonsperioderNorge: [],
            pensjonsperioderUtland: [],
            andreUtbetalingsperioder: [],
            harSamboerNå: {
                id: 'har-samboer-nå-og-gift',
                svar: 'JA',
            },
            nåværendeSamboer: {
                navn: {
                    id: 'utvidet-nåværende-samboer-navn',
                    svar: 'asdasfafsasdasdas',
                },
                ident: {
                    id: 'utvidet-nåværende-samboer-fnr',
                    svar: '05039103410',
                },
                fødselsdato: {
                    id: 'utvidet-nåværende-samboer-fødselsdato',
                    svar: '',
                },
                samboerFraDato: {
                    id: 'utvidet-nåværende-samboer-samboerFraDato',
                    svar: '2022-01-01',
                },
            },
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
                },
                tidligereSamboere: [],
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
        søker: {
            navn: {
                label: {
                    en: 'Name',
                    nb: 'Navn',
                    nn: 'Namn',
                },
                verdi: {
                    nb: 'Voksen Voksnessen',
                    nn: 'Voksen Voksnessen',
                    en: 'Voksen Voksnessen',
                },
            },
            ident: {
                label: {
                    en: 'Ident',
                    nb: 'Ident',
                    nn: 'Ident',
                },
                verdi: {
                    nb: '23058518298',
                    nn: '23058518298',
                    en: '23058518298',
                },
            },
            sivilstand: {
                label: {
                    en: 'Marital status',
                    nb: 'Sivilstatus',
                    nn: 'Sivilstatus',
                },
                verdi: {
                    nb: 'GIFT',
                    nn: 'GIFT',
                    en: 'GIFT',
                },
            },
            statsborgerskap: {
                label: {
                    en: 'Citizenship',
                    nb: 'Statsborgerskap',
                    nn: 'Statsborgarskap',
                },
                verdi: {
                    nb: ['Norge', 'Afghanistan'],
                    nn: ['Noreg', 'Afghanistan'],
                    en: ['Norway', 'Afghanistan'],
                },
            },
            adresse: {
                label: {
                    en: 'Address',
                    nb: 'Adresse',
                    nn: 'Adresse',
                },
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
                                verdi: {
                                    nb: 'Afghanistan',
                                    nn: 'Afghanistan',
                                    en: 'Afghanistan',
                                },
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
                                verdi: {
                                    nb: '2022-01-01',
                                    nn: '2022-01-01',
                                    en: '2022-01-01',
                                },
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
                                verdi: {
                                    nb: 'Afghanistan',
                                    nn: 'Afghanistan',
                                    en: 'Afghanistan',
                                },
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
                                verdi: {
                                    nb: '2022-01-01',
                                    nn: '2022-01-01',
                                    en: '2022-01-01',
                                },
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
                                verdi: {
                                    nb: 'Afghanistan',
                                    nn: 'Afghanistan',
                                    en: 'Afghanistan',
                                },
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
                                verdi: {
                                    nb: '2022-01-01',
                                    nn: '2022-01-01',
                                    en: '2022-01-01',
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
                                verdi: {
                                    nb: 'Belgia',
                                    nn: 'Belgia',
                                    en: 'Belgium',
                                },
                            },
                            oppholdslandFraDato: {
                                label: {
                                    en: 'When did you move from Norway?',
                                    nb: 'Når flyttet du fra Norge?',
                                    nn: 'Når flytta du frå Noreg?',
                                },
                                verdi: {
                                    nb: '2022-01-01',
                                    nn: '2022-01-01',
                                    en: '2022-01-01',
                                },
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
                                verdi: {
                                    nb: 'Belgia',
                                    nn: 'Belgia',
                                    en: 'Belgium',
                                },
                            },
                            oppholdslandFraDato: {
                                label: {
                                    en: 'When did you move from Norway?',
                                    nb: 'Når flyttet du fra Norge?',
                                    nn: 'Når flytta du frå Noreg?',
                                },
                                verdi: {
                                    nb: '2022-01-01',
                                    nn: '2022-01-01',
                                    en: '2022-01-01',
                                },
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
                                verdi: {
                                    nb: 'Belgia',
                                    nn: 'Belgia',
                                    en: 'Belgium',
                                },
                            },
                            oppholdslandFraDato: {
                                label: {
                                    en: 'When did you move from Norway?',
                                    nb: 'Når flyttet du fra Norge?',
                                    nn: 'Når flytta du frå Noreg?',
                                },
                                verdi: {
                                    nb: '2022-01-01',
                                    nn: '2022-01-01',
                                    en: '2022-01-01',
                                },
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
            spørsmål: {
                borPåRegistrertAdresse: {
                    label: {
                        en: 'Do you live at this address?',
                        nb: 'Bor du på denne adressen?',
                        nn: 'Bur du på denne adressa?',
                    },
                    verdi: {
                        nb: 'JA',
                        nn: 'JA',
                        en: 'JA',
                    },
                },
                værtINorgeITolvMåneder: {
                    label: {
                        en: 'Have you stayed continuously in Norway for the last twelve months?',
                        nb: 'Har du oppholdt deg sammenhengende i Norge de siste tolv månedene?',
                        nn: 'Har du opphalde deg samanhengande i Noreg dei siste tolv månadene?',
                    },
                    verdi: {
                        nb: 'NEI',
                        nn: 'NEI',
                        en: 'NEI',
                    },
                },
                erAsylsøker: {
                    label: {
                        en: 'Are you an asylum seeker?',
                        nb: 'Er du asylsøker?',
                        nn: 'Er du asylsøkar?',
                    },
                    verdi: {
                        nb: 'JA',
                        nn: 'JA',
                        en: 'JA',
                    },
                },
                jobberPåBåt: {
                    label: {
                        en: "Do you or have you worked outside of Norway, on a foreign ship or on another country's continental shelf?",
                        nb: 'Arbeider eller har du arbeidet utenfor Norge, på utenlandsk skip eller på utenlandsk kontinentalsokkel?',
                        nn: 'Arbeidar eller har du arbeida utanfor Noreg, på utanlandsk skip eller på utanlandsk kontinentalsokkel?',
                    },
                    verdi: {
                        nb: 'JA',
                        nn: 'JA',
                        en: 'JA',
                    },
                },
                arbeidsland: {
                    label: {
                        en: 'Which country do you work in?',
                        nb: 'Hvilket land arbeider du i?',
                        nn: 'Kva land arbeidar du i?',
                    },
                    verdi: {
                        nb: 'Belgia',
                        nn: 'Belgia',
                        en: 'Belgium',
                    },
                },
                mottarUtenlandspensjon: {
                    label: {
                        en: 'Do you or have you received a pension from abroad?',
                        nb: 'Får eller har du fått pensjon fra utlandet?',
                        nn: 'Får eller har du fått pensjon frå utlandet?',
                    },
                    verdi: {
                        nb: 'JA',
                        nn: 'JA',
                        en: 'JA',
                    },
                },
                pensjonsland: {
                    label: {
                        en: 'Which country do you receive a pension from?',
                        nb: 'Hvilket land får du pensjon fra?',
                        nn: 'Kva land får du pensjon frå?',
                    },
                    verdi: {
                        nb: 'Belgia',
                        nn: 'Belgia',
                        en: 'Belgium',
                    },
                },
                harSamboerNå: {
                    label: {
                        en: 'Are you currently living with a cohabiting partner that is not your spouse?',
                        nb: 'Har du en annen samboer enn din ektefelle nå?',
                        nn: 'Har du ein anna sambuar enn din ektefelle no?',
                    },
                    verdi: {
                        nb: 'JA',
                        nn: 'JA',
                        en: 'JA',
                    },
                },
            },
            tidligereSamboere: [],
            nåværendeSamboer: {
                label: {
                    en: 'Cohabitant',
                    nb: 'Samboer',
                    nn: 'Sambuar',
                },
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
                                nb: '05039103410',
                                nn: '05039103410',
                                en: '05039103410',
                            },
                        },
                        fødselsdato: {
                            label: {
                                en: 'Date of birth',
                                nb: 'Fødselsdato',
                                nn: 'Fødselsdato',
                            },
                            verdi: {
                                nb: '',
                                nn: '',
                                en: '',
                            },
                        },
                        samboerFraDato: {
                            label: {
                                en: 'When did you start living together?',
                                nb: 'Når startet samboerforholdet?',
                                nn: 'Når starta sambuarforholdet?',
                            },
                            verdi: {
                                nb: '2022-01-01',
                                nn: '2022-01-01',
                                en: '2022-01-01',
                            },
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
                                nb: '05039103410',
                                nn: '05039103410',
                                en: '05039103410',
                            },
                        },
                        fødselsdato: {
                            label: {
                                en: 'Date of birth',
                                nb: 'Fødselsdato',
                                nn: 'Fødselsdato',
                            },
                            verdi: {
                                nb: '',
                                nn: '',
                                en: '',
                            },
                        },
                        samboerFraDato: {
                            label: {
                                en: 'When did you start living together?',
                                nb: 'Når startet samboerforholdet?',
                                nn: 'Når starta sambuarforholdet?',
                            },
                            verdi: {
                                nb: '2022-01-01',
                                nn: '2022-01-01',
                                en: '2022-01-01',
                            },
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
                                nb: '05039103410',
                                nn: '05039103410',
                                en: '05039103410',
                            },
                        },
                        fødselsdato: {
                            label: {
                                en: 'Date of birth',
                                nb: 'Fødselsdato',
                                nn: 'Fødselsdato',
                            },
                            verdi: {
                                nb: '',
                                nn: '',
                                en: '',
                            },
                        },
                        samboerFraDato: {
                            label: {
                                en: 'When did you start living together?',
                                nb: 'Når startet samboerforholdet?',
                                nn: 'Når starta sambuarforholdet?',
                            },
                            verdi: {
                                nb: '2022-01-01',
                                nn: '2022-01-01',
                                en: '2022-01-01',
                            },
                        },
                    },
                },
            },
        },
        barn: [
            {
                navn: {
                    label: {
                        en: 'Name',
                        nb: 'Navn',
                        nn: 'Namn',
                    },
                    verdi: {
                        nb: 'Barn 234567 89876',
                        nn: 'Barn 234567 89876',
                        en: 'Barn 234567 89876',
                    },
                },
                ident: {
                    label: {
                        en: 'Ident',
                        nb: 'Ident',
                        nn: 'Ident',
                    },
                    verdi: {
                        nb: '23456789876',
                        nn: '23456789876',
                        en: '23456789876',
                    },
                },
                registrertBostedType: {
                    label: {
                        en: 'Registered place of residence',
                        nb: 'Registrert bosted',
                        nn: 'Registrert bustad',
                    },
                    verdi: {
                        nb: 'ADRESSESPERRE',
                        nn: 'ADRESSESPERRE',
                        en: 'ADRESSESPERRE',
                    },
                },
                alder: {
                    label: {
                        en: 'Age',
                        nb: 'Alder',
                        nn: 'Alder',
                    },
                    verdi: {
                        en: '13 years',
                        nb: '13 år',
                        nn: '13 år',
                    },
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
                                        en: 'What best describes the period BARN 234567 89876 stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden BARN 234567 89876 oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden BARN 234567 89876 har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child has stayed outside of Norway earlier',
                                        nb: 'Barnet har oppholdt seg utenfor Norge tidligere',
                                        nn: 'Barnet har opphalde meg utanfor Noreg tidlegare',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country was BARN 234567 89876 staying in?',
                                        nb: 'Hvilket land oppholdt BARN 234567 89876 seg i?',
                                        nn: 'Kva land oppheldt BARN 234567 89876 seg i?',
                                    },
                                    verdi: {
                                        nb: 'Belgia',
                                        nn: 'Belgia',
                                        en: 'Belgium',
                                    },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: {
                                        nb: '2022-01-01',
                                        nn: '2022-01-01',
                                        en: '2022-01-01',
                                    },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When did the stay end?',
                                        nb: 'Når ble oppholdet avsluttet?',
                                        nn: 'Når blei opphaldet avslutta?',
                                    },
                                    verdi: {
                                        nb: '2022-01-08',
                                        nn: '2022-01-08',
                                        en: '2022-01-08',
                                    },
                                },
                            },
                            nn: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period BARN 234567 89876 stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden BARN 234567 89876 oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden BARN 234567 89876 har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child has stayed outside of Norway earlier',
                                        nb: 'Barnet har oppholdt seg utenfor Norge tidligere',
                                        nn: 'Barnet har opphalde meg utanfor Noreg tidlegare',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country was BARN 234567 89876 staying in?',
                                        nb: 'Hvilket land oppholdt BARN 234567 89876 seg i?',
                                        nn: 'Kva land oppheldt BARN 234567 89876 seg i?',
                                    },
                                    verdi: {
                                        nb: 'Belgia',
                                        nn: 'Belgia',
                                        en: 'Belgium',
                                    },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: {
                                        nb: '2022-01-01',
                                        nn: '2022-01-01',
                                        en: '2022-01-01',
                                    },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When did the stay end?',
                                        nb: 'Når ble oppholdet avsluttet?',
                                        nn: 'Når blei opphaldet avslutta?',
                                    },
                                    verdi: {
                                        nb: '2022-01-08',
                                        nn: '2022-01-08',
                                        en: '2022-01-08',
                                    },
                                },
                            },
                            en: {
                                utenlandsoppholdÅrsak: {
                                    label: {
                                        en: 'What best describes the period BARN 234567 89876 stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden BARN 234567 89876 oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden BARN 234567 89876 har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child has stayed outside of Norway earlier',
                                        nb: 'Barnet har oppholdt seg utenfor Norge tidligere',
                                        nn: 'Barnet har opphalde meg utanfor Noreg tidlegare',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country was BARN 234567 89876 staying in?',
                                        nb: 'Hvilket land oppholdt BARN 234567 89876 seg i?',
                                        nn: 'Kva land oppheldt BARN 234567 89876 seg i?',
                                    },
                                    verdi: {
                                        nb: 'Belgia',
                                        nn: 'Belgia',
                                        en: 'Belgium',
                                    },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: {
                                        nb: '2022-01-01',
                                        nn: '2022-01-01',
                                        en: '2022-01-01',
                                    },
                                },
                                oppholdslandTilDato: {
                                    label: {
                                        en: 'When did the stay end?',
                                        nb: 'Når ble oppholdet avsluttet?',
                                        nn: 'Når blei opphaldet avslutta?',
                                    },
                                    verdi: {
                                        nb: '2022-01-08',
                                        nn: '2022-01-08',
                                        en: '2022-01-08',
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
                                        en: 'What best describes the period BARN 234567 89876 stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden BARN 234567 89876 oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden BARN 234567 89876 har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child has moved permanently from Norway',
                                        nb: 'Barnet har flyttet permanent fra Norge',
                                        nn: 'Barnet har flytta permanent frå Noreg',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country has BARN 234567 89876 moved to?',
                                        nb: 'Hvilket land har BARN 234567 89876 flyttet til?',
                                        nn: 'Kva land har BARN 234567 89876 flytta til?',
                                    },
                                    verdi: {
                                        nb: 'Afghanistan',
                                        nn: 'Afghanistan',
                                        en: 'Afghanistan',
                                    },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did BARN 234567 89876 move from Norway?',
                                        nb: 'Når flyttet BARN 234567 89876 fra Norge?',
                                        nn: 'Når flytta BARN 234567 89876 frå Noreg?',
                                    },
                                    verdi: {
                                        nb: '2022-01-12',
                                        nn: '2022-01-12',
                                        en: '2022-01-12',
                                    },
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
                                        en: 'What best describes the period BARN 234567 89876 stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden BARN 234567 89876 oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden BARN 234567 89876 har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child has moved permanently from Norway',
                                        nb: 'Barnet har flyttet permanent fra Norge',
                                        nn: 'Barnet har flytta permanent frå Noreg',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country has BARN 234567 89876 moved to?',
                                        nb: 'Hvilket land har BARN 234567 89876 flyttet til?',
                                        nn: 'Kva land har BARN 234567 89876 flytta til?',
                                    },
                                    verdi: {
                                        nb: 'Afghanistan',
                                        nn: 'Afghanistan',
                                        en: 'Afghanistan',
                                    },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did BARN 234567 89876 move from Norway?',
                                        nb: 'Når flyttet BARN 234567 89876 fra Norge?',
                                        nn: 'Når flytta BARN 234567 89876 frå Noreg?',
                                    },
                                    verdi: {
                                        nb: '2022-01-12',
                                        nn: '2022-01-12',
                                        en: '2022-01-12',
                                    },
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
                                        en: 'What best describes the period BARN 234567 89876 stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden BARN 234567 89876 oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden BARN 234567 89876 har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child has moved permanently from Norway',
                                        nb: 'Barnet har flyttet permanent fra Norge',
                                        nn: 'Barnet har flytta permanent frå Noreg',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country has BARN 234567 89876 moved to?',
                                        nb: 'Hvilket land har BARN 234567 89876 flyttet til?',
                                        nn: 'Kva land har BARN 234567 89876 flytta til?',
                                    },
                                    verdi: {
                                        nb: 'Afghanistan',
                                        nn: 'Afghanistan',
                                        en: 'Afghanistan',
                                    },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did BARN 234567 89876 move from Norway?',
                                        nb: 'Når flyttet BARN 234567 89876 fra Norge?',
                                        nn: 'Når flytta BARN 234567 89876 frå Noreg?',
                                    },
                                    verdi: {
                                        nb: '2022-01-12',
                                        nn: '2022-01-12',
                                        en: '2022-01-12',
                                    },
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
                andreForelder: null,
                spørsmål: {
                    erFosterbarn: {
                        label: {
                            en: 'Which of the children are foster children?',
                            nb: 'Hvem av barna er fosterbarn?',
                            nn: 'Kven av barna er fosterbarn?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    erAdoptertFraUtland: {
                        label: {
                            en: 'Which of the children are adopted from abroad?',
                            nb: 'Hvem av barna er adoptert fra utlandet?',
                            nn: 'Kven av barna er adoptert frå utlandet?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    erAsylsøker: {
                        label: {
                            en: 'For which of the children has an application for asylum been submitted?',
                            nb: 'Hvem av barna er det søkt om asyl for?',
                            nn: 'Kven av barna er det søkt om asyl for?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    barnetrygdFraAnnetEøsland: {
                        label: {
                            en: 'For which of the children are you receiving, have received or have applied for child benefit?',
                            nb: 'Hvem av barna får du, har du fått eller har du søkt om barnetrygd for?',
                            nn: 'Kven av barna får du, har du fått eller har du søkt om barnetrygd for?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    andreForelderErDød: {
                        label: {
                            en: 'Which of the children is your previous spouse/cohabiting partner the parent of?',
                            nb: 'Hvem av barna er din tidligere ektefelle/samboer forelder til?',
                            nn: 'Kven av barna er din tidlegare ektefelle/sambuar forelder til?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
                    },
                    oppholderSegIInstitusjon: {
                        label: {
                            en: 'Which of the children are in an institution?',
                            nb: 'Hvem av barna er i institusjon?',
                            nn: 'Kven av barna er seg i institusjon?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    institusjonIUtland: {
                        label: {
                            en: 'The institution is outside of Norway',
                            nb: 'Institusjonen er i utlandet',
                            nn: 'Institusjonen er i utlandet',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    institusjonOppholdStartdato: {
                        label: {
                            en: 'When did the stay at the institution start?',
                            nb: 'Når startet institusjonsoppholdet?',
                            nn: 'Når starta institusjonsopphaldet?',
                        },
                        verdi: {
                            nb: '2022-01-01',
                            nn: '2022-01-01',
                            en: '2022-01-01',
                        },
                    },
                    boddMindreEnn12MndINorge: {
                        label: {
                            en: 'Which of the children have stayed outside of Norway during the last twelve months?',
                            nb: 'Hvem av barna har oppholdt seg utenfor Norge i løpet av de siste tolv månedene?',
                            nn: 'Kven av barna har oppheldt seg utanfor Noreg i løpet av dei siste tolv månadene?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    barnetrygdFraEøslandHvilketLand: {
                        label: {
                            en: 'From which country are you receiving or have you applied for child benefit?',
                            nb: 'Hvilket land får eller har du søkt om barnetrygd fra?',
                            nn: 'Kva land får eller har du søkt barnetrygd frå?',
                        },
                        verdi: {
                            nb: 'Danmark',
                            nn: 'Danmark',
                            en: 'Denmark',
                        },
                    },
                    borFastMedSøker: {
                        label: {
                            en: 'Does BARN 234567 89876 live with you on a permanent basis?',
                            nb: 'Bor BARN 234567 89876 fast sammen med deg?',
                            nn: 'Bur BARN 234567 89876 fast saman med deg?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
                    },
                    søkerForTidsrom: {
                        label: {
                            en: 'Are you applying for child benefit for a particular period of time for BARN 234567 89876?',
                            nb: 'Søker du barnetrygd for et spesielt tidsrom for BARN 234567 89876?',
                            nn: 'Søker du barnetrygd for eit spesielt tidsrom for BARN 234567 89876?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    søkerForTidsromStartdato: {
                        label: {
                            en: 'From',
                            nb: 'Fra og med',
                            nn: 'Frå og med',
                        },
                        verdi: {
                            nb: '2022-01-01',
                            nn: '2022-01-01',
                            en: '2022-01-01',
                        },
                    },
                    søkerForTidsromSluttdato: {
                        label: {
                            en: 'Up to and including',
                            nb: 'Til og med',
                            nn: 'Til og med',
                        },
                        verdi: {
                            nb: '2022-01-06',
                            nn: '2022-01-06',
                            en: '2022-01-06',
                        },
                    },
                    institusjonOppholdSluttdato: {
                        label: {
                            en: 'When is the stay at the institution ending?',
                            nb: 'Når avsluttes institusjonsoppholdet?',
                            nn: 'Når avsluttast institusjonsopphaldet?',
                        },
                        verdi: {
                            nb: '2022-01-07',
                            nn: '2022-01-07',
                            en: '2022-01-07',
                        },
                    },
                },
            },
            {
                navn: {
                    label: {
                        en: 'Name',
                        nb: 'Navn',
                        nn: 'Namn',
                    },
                    verdi: {
                        nb: 'Barn Barnessen III',
                        nn: 'Barn Barnessen III',
                        en: 'Barn Barnessen III',
                    },
                },
                ident: {
                    label: {
                        en: 'Ident',
                        nb: 'Ident',
                        nn: 'Ident',
                    },
                    verdi: {
                        nb: '12345678987',
                        nn: '12345678987',
                        en: '12345678987',
                    },
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
                    label: {
                        en: 'Age',
                        nb: 'Alder',
                        nn: 'Alder',
                    },
                    verdi: {
                        en: '12 years',
                        nb: '12 år',
                        nn: '12 år',
                    },
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
                                        en: 'What best describes the period BARN BARNESSEN III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden BARN BARNESSEN III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden BARN BARNESSEN III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child is currently staying outside of Norway',
                                        nb: 'Barnet oppholder seg utenfor Norge nå',
                                        nn: 'Barnet oppheld seg utanfor Noreg no',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country is BARN BARNESSEN III currently in?',
                                        nb: 'Hvilket land oppholder BARN BARNESSEN III seg i?',
                                        nn: 'Kva land oppheld BARN BARNESSEN III seg i?',
                                    },
                                    verdi: {
                                        nb: 'Hellas',
                                        nn: 'Hellas',
                                        en: 'Greece',
                                    },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: {
                                        nb: '2022-01-12',
                                        nn: '2022-01-12',
                                        en: '2022-01-12',
                                    },
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
                                        en: 'What best describes the period BARN BARNESSEN III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden BARN BARNESSEN III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden BARN BARNESSEN III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child is currently staying outside of Norway',
                                        nb: 'Barnet oppholder seg utenfor Norge nå',
                                        nn: 'Barnet oppheld seg utanfor Noreg no',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country is BARN BARNESSEN III currently in?',
                                        nb: 'Hvilket land oppholder BARN BARNESSEN III seg i?',
                                        nn: 'Kva land oppheld BARN BARNESSEN III seg i?',
                                    },
                                    verdi: {
                                        nb: 'Hellas',
                                        nn: 'Hellas',
                                        en: 'Greece',
                                    },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: {
                                        nb: '2022-01-12',
                                        nn: '2022-01-12',
                                        en: '2022-01-12',
                                    },
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
                                        en: 'What best describes the period BARN BARNESSEN III stayed outside of Norway?',
                                        nb: 'Hva beskriver perioden BARN BARNESSEN III oppholdt seg utenfor Norge best?',
                                        nn: 'Kva beskriv perioden BARN BARNESSEN III har opphalde seg utanfor Noreg best',
                                    },
                                    verdi: {
                                        en: 'The child is currently staying outside of Norway',
                                        nb: 'Barnet oppholder seg utenfor Norge nå',
                                        nn: 'Barnet oppheld seg utanfor Noreg no',
                                    },
                                },
                                oppholdsland: {
                                    label: {
                                        en: 'Which country is BARN BARNESSEN III currently in?',
                                        nb: 'Hvilket land oppholder BARN BARNESSEN III seg i?',
                                        nn: 'Kva land oppheld BARN BARNESSEN III seg i?',
                                    },
                                    verdi: {
                                        nb: 'Hellas',
                                        nn: 'Hellas',
                                        en: 'Greece',
                                    },
                                },
                                oppholdslandFraDato: {
                                    label: {
                                        en: 'When did the stay start?',
                                        nb: 'Når startet oppholdet?',
                                        nn: 'Når starta opphaldet?',
                                    },
                                    verdi: {
                                        nb: '2022-01-12',
                                        nn: '2022-01-12',
                                        en: '2022-01-12',
                                    },
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
                andreForelder: null,
                spørsmål: {
                    erFosterbarn: {
                        label: {
                            en: 'Which of the children are foster children?',
                            nb: 'Hvem av barna er fosterbarn?',
                            nn: 'Kven av barna er fosterbarn?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    erAdoptertFraUtland: {
                        label: {
                            en: 'Which of the children are adopted from abroad?',
                            nb: 'Hvem av barna er adoptert fra utlandet?',
                            nn: 'Kven av barna er adoptert frå utlandet?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    erAsylsøker: {
                        label: {
                            en: 'For which of the children has an application for asylum been submitted?',
                            nb: 'Hvem av barna er det søkt om asyl for?',
                            nn: 'Kven av barna er det søkt om asyl for?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    barnetrygdFraAnnetEøsland: {
                        label: {
                            en: 'For which of the children are you receiving, have received or have applied for child benefit?',
                            nb: 'Hvem av barna får du, har du fått eller har du søkt om barnetrygd for?',
                            nn: 'Kven av barna får du, har du fått eller har du søkt om barnetrygd for?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    andreForelderErDød: {
                        label: {
                            en: 'Which of the children is your previous spouse/cohabiting partner the parent of?',
                            nb: 'Hvem av barna er din tidligere ektefelle/samboer forelder til?',
                            nn: 'Kven av barna er din tidlegare ektefelle/sambuar forelder til?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
                    },
                    oppholderSegIInstitusjon: {
                        label: {
                            en: 'Which of the children are in an institution?',
                            nb: 'Hvem av barna er i institusjon?',
                            nn: 'Kven av barna er seg i institusjon?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    institusjonIUtland: {
                        label: {
                            en: 'The institution is outside of Norway',
                            nb: 'Institusjonen er i utlandet',
                            nn: 'Institusjonen er i utlandet',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
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
                        label: {
                            en: 'Post code',
                            nb: 'Postnummer',
                            nn: 'Postnummer',
                        },
                        verdi: {
                            nb: '4342',
                            nn: '4342',
                            en: '4342',
                        },
                    },
                    institusjonOppholdStartdato: {
                        label: {
                            en: 'When did the stay at the institution start?',
                            nb: 'Når startet institusjonsoppholdet?',
                            nn: 'Når starta institusjonsopphaldet?',
                        },
                        verdi: {
                            nb: '2022-01-06',
                            nn: '2022-01-06',
                            en: '2022-01-06',
                        },
                    },
                    boddMindreEnn12MndINorge: {
                        label: {
                            en: 'Which of the children have stayed outside of Norway during the last twelve months?',
                            nb: 'Hvem av barna har oppholdt seg utenfor Norge i løpet av de siste tolv månedene?',
                            nn: 'Kven av barna har oppheldt seg utanfor Noreg i løpet av dei siste tolv månadene?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    planleggerÅBoINorge12Mnd: {
                        label: {
                            en: 'Is it planned that BARN BARNESSEN III will live in Norway continuously for more than 12 months?',
                            nb: 'Er det planlagt at BARN BARNESSEN III skal bo sammenhengende i Norge i mer enn tolv måneder?',
                            nn: 'Er det planlagd at BARN BARNESSEN III skal bu i Noreg samanhengande i meir enn tolv månadar?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
                    },
                    barnetrygdFraEøslandHvilketLand: {
                        label: {
                            en: 'From which country are you receiving or have you applied for child benefit?',
                            nb: 'Hvilket land får eller har du søkt om barnetrygd fra?',
                            nn: 'Kva land får eller har du søkt barnetrygd frå?',
                        },
                        verdi: {
                            nb: 'Belgia',
                            nn: 'Belgia',
                            en: 'Belgium',
                        },
                    },
                    borFastMedSøker: {
                        label: {
                            en: 'Does BARN BARNESSEN III live with you on a permanent basis?',
                            nb: 'Bor BARN BARNESSEN III fast sammen med deg?',
                            nn: 'Bur BARN BARNESSEN III fast saman med deg?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
                    },
                    søkerForTidsrom: {
                        label: {
                            en: 'Are you applying for child benefit for a particular period of time for BARN BARNESSEN III?',
                            nb: 'Søker du barnetrygd for et spesielt tidsrom for BARN BARNESSEN III?',
                            nn: 'Søker du barnetrygd for eit spesielt tidsrom for BARN BARNESSEN III?',
                        },
                        verdi: {
                            nb: 'JA',
                            nn: 'JA',
                            en: 'JA',
                        },
                    },
                    søkerForTidsromStartdato: {
                        label: {
                            en: 'From',
                            nb: 'Fra og med',
                            nn: 'Frå og med',
                        },
                        verdi: {
                            nb: '2022-01-01',
                            nn: '2022-01-01',
                            en: '2022-01-01',
                        },
                    },
                    søkerForTidsromSluttdato: {
                        label: {
                            en: 'Up to and including',
                            nb: 'Til og med',
                            nn: 'Til og med',
                        },
                        verdi: {
                            en: 'Period does not have an up to and including date / Up to and including date is in the future',
                            nb: 'Tidsrommet har ikke en til og med dato / Til og med dato er frem i tid.',
                            nn: 'Tidsrommet har ikkje ein til og med dato / Til og med dato er fram i tid',
                        },
                    },
                    institusjonOppholdSluttdato: {
                        label: {
                            en: 'When is the stay at the institution ending?',
                            nb: 'Når avsluttes institusjonsoppholdet?',
                            nn: 'Når avsluttast institusjonsopphaldet?',
                        },
                        verdi: {
                            en: "I don't know when the stay at the institution is ending",
                            nb: 'Jeg vet ikke når institusjonsoppholdet avsluttes',
                            nn: 'Eg veit ikkje når institusjonsopphaldet avsluttast',
                        },
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
                verdi: {
                    nb: 'JA',
                    nn: 'JA',
                    en: 'JA',
                },
            },
            søktAsylForBarn: {
                label: {
                    en: 'Has an application for asylum been submitted for any of the children?',
                    nb: 'Er det søkt om asyl i Norge for noen av barna?',
                    nn: 'Er det søkt om asyl i Noreg for nokre av barna?',
                },
                verdi: {
                    nb: 'JA',
                    nn: 'JA',
                    en: 'JA',
                },
            },
            oppholderBarnSegIInstitusjon: {
                label: {
                    en: 'Are any of the children in a child welfare institution or other institution?',
                    nb: 'Er noen av barna i barnverninstitusjon eller i annen institusjon?',
                    nn: 'Er nokre av barna i barneverninstitusjon eller i anna institusjon?',
                },
                verdi: {
                    nb: 'JA',
                    nn: 'JA',
                    en: 'JA',
                },
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                label: {
                    en: 'Have the children stayed continuously in Norway during the last twelve months?',
                    nb: 'Har barna oppholdt seg sammenhengende i Norge de siste tolv månedene?',
                    nn: 'Har barna oppheldt seg samanhengande i Noreg dei siste tolv månadene?',
                },
                verdi: {
                    nb: 'NEI',
                    nn: 'NEI',
                    en: 'NEI',
                },
            },
            erBarnAdoptertFraUtland: {
                label: {
                    en: 'Are any of the children adopted from abroad?',
                    nb: 'Er noen av barna adoptert fra utlandet?',
                    nn: 'Er nokre av barna adoptert frå utlandet?',
                },
                verdi: {
                    nb: 'JA',
                    nn: 'JA',
                    en: 'JA',
                },
            },
            mottarBarnetrygdForBarnFraAnnetEøsland: {
                label: {
                    en: 'Are you receiving, have you received or have you applied for child benefit for some of the children from another EEA country?',
                    nb: 'Får, har du fått eller har du søkt om barnetrygd for noen av barna fra et annet EØS land?',
                    nn: 'Får du, har du fått eller har du søkt om barnetrygd for nokre av barna frå eit anna EØS land?',
                },
                verdi: {
                    nb: 'JA',
                    nn: 'JA',
                    en: 'JA',
                },
            },
            erAvdødPartnerForelder: {
                label: {
                    en: 'You are registered as a widow/widower in the Norwegian National Registry (folkeregisteret). Is your previous spouse the parent of any of the children you are applying for child benefit for?',
                    nb: 'Du er folkeregistrert som enke/enkemann. Er din tidligere ektefelle forelder til noen av barna du søker barnetrygd for?',
                    nn: 'Du er folkeregistrert som enke/enkemann. Er din tidlegare ektefelle forelder til nokre av barna du søker barnetrygd for?',
                },
                verdi: {
                    nb: null,
                    nn: null,
                    en: null,
                },
            },
            lestOgForståttBekreftelse: {
                label: {
                    en: 'I am aware that I may lose my right to child benefit if I provide incorrect information. I am also aware that I will have to pay back any money I receive that I am not entitled to, that I have received if I have failed to provide information or have provided incorrect information.',
                    nb: 'Jeg er klar over at jeg kan miste retten til barnetrygd dersom jeg gir feil opplysninger. Jeg er også klar over at jeg må betale tilbake dersom jeg får penger jeg ikke har rett til hvis jeg lar være å informere eller gir feil opplysninger.',
                    nn: 'Eg er klar over at eg kan miste retten til barnetrygd dersom eg gjev feil opplysningar. Eg er også klar over at eg må betale tilbake dersom eg får pengar eg ikkje har rett til hvis eg har latt vere å informere eller har gjeve feil opplysningar.',
                },
                verdi: {
                    en: 'I hereby confirm that I have read and understood.',
                    nb: 'Jeg bekrefter at jeg har lest og forstått.',
                    nn: 'Eg stadfestar at eg har lese og forstått',
                },
            },
        },
        dokumentasjon: [
            {
                dokumentasjonsbehov: 'VEDTAK_OPPHOLDSTILLATELSE',
                harSendtInn: false,
                opplastedeVedlegg: [],
                dokumentasjonSpråkTittel: {
                    en: 'Decision on permission to reside',
                    nb: 'Vedtak om oppholdstillatelse',
                    nn: 'Vedtak om opphaldsløyve',
                },
            },
            {
                dokumentasjonsbehov: 'ADOPSJON_DATO',
                harSendtInn: false,
                opplastedeVedlegg: [],
                dokumentasjonSpråkTittel: {
                    en: 'Confirmation of the date on which you assumed the care of the child in connection with adoption',
                    nb: 'Bekreftelse på dato du overtok omsorgen ved adopsjon',
                    nn: 'Stadfesting på dato du overtok omsorga ved adopsjon',
                },
            },
            {
                dokumentasjonsbehov: 'BEKREFTELSE_FRA_BARNEVERN',
                harSendtInn: false,
                opplastedeVedlegg: [],
                dokumentasjonSpråkTittel: {
                    en: 'Confirmation from the Child Welfare Service (barnevernet)',
                    nb: 'Bekreftelse fra barnevernet',
                    nn: 'Stadfesting frå barnevernet',
                },
            },
            {
                dokumentasjonsbehov: 'EØS_SKJEMA',
                harSendtInn: false,
                opplastedeVedlegg: [],
                dokumentasjonSpråkTittel: {
                    en: 'Supplementary form for claiming payment of child benefit based on export rules under the EEA agreement',
                    nb: 'Tilleggsskjema ved krav om utbetaling av barnetrygd og/eller kontantstøtte på grunnlag av regler om eksport etter EØS-avtalen',
                    nn: 'Tilleggskjema ved krav om utbetaling av barnetrygd og/eller kontantstønad på grunnlag av reglar om eksport etter EØS-avtalen',
                },
            },
            {
                dokumentasjonsbehov: 'ANNEN_DOKUMENTASJON',
                harSendtInn: false,
                opplastedeVedlegg: [],
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
                en: 'You have stated that you are receiving or have applied for child benefit for {navn} from another EEA country.',
                nb: 'Du har opplyst at du får eller har søkt om barnetrygd for {navn} fra et annet EØS land.',
                nn: 'Du har opplyst at du får eller har søkt om barnetrygd for {navn} frå eit anna EØS land.',
            },
            'omdeg.annensamboer.spm': {
                en: 'Have you had a cohabiting partner earlier during the period for which you are applying for child benefit?',
                nb: 'Har du hatt samboer tidligere i perioden du søker barnetrygd for?',
                nn: 'Har du hatt sambuar tidlegare i perioden du søker barnetrygd for?',
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
            'pdf.ombarnet.seksjonstittel': {
                en: 'About {navn}',
                nb: 'Om {navn}',
                nn: 'Om {navn}',
            },
            'pdf.omdeg.seksjonstittel': {
                en: 'About you',
                nb: 'Om deg',
                nn: 'Om deg',
            },
            'pdf.bosted.seksjonstittel': {
                en: 'Place of residence',
                nb: 'Bosted',
                nn: 'Bustad',
            },
            'pdf.ombarna.seksjonstittel': {
                en: 'About your children',
                nb: 'Om barna dine',
                nn: 'Om barna dine',
            },
            'pdf.søker-for-tidsrom.seksjonstittel': {
                en: 'Are you applying for a specific time period for {navn}?',
                nb: 'Søker du barnetrygd for et spesielt tidsrom for {navn}?',
                nn: 'Søker du barnetrygd for eit spesielt tidsrom for {navn}?',
            },
            'pdf.søker.seksjonstittel': {
                en: 'Applicant',
                nb: 'Søker',
                nn: 'Søkar',
            },
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
                en: 'I have already submitted this documentation to NAV in the past',
                nb: 'Jeg har sendt inn denne dokumentasjonen til NAV tidligere',
                nn: 'Eg har sendt inn denne dokumentasjonen til NAV tidlegare',
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
            'felles.sivilstatus.kode.GIFT': {
                en: 'Married',
                nb: 'Gift',
                nn: 'Gift',
            },
            'felles.sivilstatus.kode.ENKE_ELLER_ENKEMANN': {
                en: 'Widow(er)',
                nb: 'Enke/Enkemann',
                nn: 'Enke/enkemann',
            },
            'felles.sivilstatus.kode.SKILT': {
                en: 'Divorced',
                nb: 'Skilt',
                nn: 'Skilt',
            },
            'felles.sivilstatus.kode.SEPARERT': {
                en: 'Separated',
                nb: 'Separert',
                nn: 'Separert',
            },
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
            'felles.sivilstatus.kode.UGIFT': {
                en: 'Unmarried',
                nb: 'Ugift',
                nn: 'Ugift',
            },
            'felles.sivilstatus.kode.UOPPGITT': {
                en: 'Not specified',
                nb: 'Ikke oppgitt',
                nn: 'Ikkje oppgitt',
            },
            'felles.svaralternativ.ja': {
                en: 'Yes',
                nb: 'Ja',
                nn: 'Ja',
            },
            'felles.svaralternativ.nei': {
                en: 'No',
                nb: 'Nei',
                nn: 'Nei',
            },
            'felles.svaralternativ.vetikke': {
                en: "Don't know",
                nb: 'Jeg vet ikke',
                nn: 'Eg veit ikkje',
            },
        },
        originalSpråk: 'nb',
    },
};

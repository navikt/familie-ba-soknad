import { TilKontraktTestData } from './typer';

export const testdata1: TilKontraktTestData = {
    input: {
        søknadstype: 'ORDINÆR',
        erEøs: false,
        barnInkludertISøknaden: [
            {
                id: '136f8dd4-e4f0-42b6-aa77-403de54a1650',
                navn: null,
                ident: '23456789876',
                alder: '13',
                borMedSøker: false,
                adressebeskyttelse: true,
                barnErFyltUt: true,
                utenlandsperioder: [],
                andreForelder: {
                    arbeidsperioderNorge: [],
                    arbeidsperioderUtland: [],
                    andreUtbetalingsperioder: [],
                    pensjonsperioderNorge: [],
                    pensjonsperioderUtland: [],
                    navn: {
                        id: 'andre-forelder-navn',
                        svar: 'UKJENT',
                    },
                    fnr: {
                        id: 'andre-forelder-fødsels-/dnummer',
                        svar: '',
                    },
                    fødselsdato: {
                        id: 'andre-forelder-fødselsdato',
                        svar: '',
                    },
                    arbeidUtlandet: {
                        svar: null,
                        id: 'andre-forelder-arbeid',
                    },
                    arbeidUtlandetHvilketLand: {
                        svar: '',
                        id: 'andre-forelder-arbeid-hvilket-land',
                    },
                    pensjonUtland: {
                        svar: null,
                        id: 'andre-forelder-pensjon-utland',
                    },
                    pensjonHvilketLand: {
                        svar: '',
                        id: 'andre-forelder-pensjon-hvilket-land',
                    },
                    skriftligAvtaleOmDeltBosted: {
                        id: 'skriftlig-avtale-om-delt-bosted',
                        svar: 'NEI',
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
                barnetrygdFraEøslandHvilketLand: {
                    id: 'barnetrygd-hvilket-eøsland',
                    svar: '',
                },
                borFastMedSøker: {
                    id: 'bor-barnet-fast-med-deg',
                    svar: 'NEI',
                },
                søkerForTidsrom: {
                    id: 'søker-for-tidsrom',
                    svar: 'NEI',
                },
                søkerForTidsromStartdato: {
                    id: 'søker-for-tidsrom-startdato',
                    svar: '',
                },
                søkerForTidsromSluttdato: {
                    id: 'søker-for-tidsrom-sluttdato',
                    svar: '',
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
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'ADOPSJON_DATO',
                tittelSpråkId: 'dokumentasjon.adopsjon.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.adopsjon.informasjon',
                gjelderForBarnId: [],
                gjelderForSøker: false,
                harSendtInn: false,
                opplastedeVedlegg: [],
            },
            {
                dokumentasjonsbehov: 'BEKREFTELSE_FRA_BARNEVERN',
                tittelSpråkId: 'dokumentasjon.bekreftelsebarnevernet.vedleggtittel',
                beskrivelseSpråkId: 'dokumentasjon.bekreftelsebarnevernet.informasjon',
                gjelderForBarnId: [],
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
                opplastedeVedlegg: [],
            },
        ],
        søker: {
            navn: 'Voksen Voksnessen',
            barn: [
                {
                    id: '136f8dd4-e4f0-42b6-aa77-403de54a1650',
                    navn: null,
                    ident: '23456789876',
                    alder: '13',
                    borMedSøker: false,
                    adressebeskyttelse: true,
                },
                {
                    id: 'd6893513-1d8d-4a4c-9961-fe86b69b23cb',
                    navn: 'Barn Barnessen III',
                    ident: '12345678987',
                    alder: '12',
                    borMedSøker: true,
                    adressebeskyttelse: false,
                },
            ],
            triggetEøs: false,
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
            idNummer: [],
            adresseISøkeperiode: { id: 'eøs-om-deg.dittoppholdssted.spm', svar: '' },
            adresse: {
                adressenavn: 'Solveien',
                postnummer: '2304',
                husnummer: '2',
                husbokstav: 'A',
                bruksenhetnummer: 'H0101',
                bostedskommune: null,
                poststed: 'HAMAR',
            },
            utenlandsperioder: [],
            borPåRegistrertAdresse: {
                id: 'bor-på-registrert-adresse',
                svar: 'JA',
            },
            værtINorgeITolvMåneder: {
                id: 'søker-vært-i-norge-sammenhengende-tolv-måneder',
                svar: 'JA',
            },
            planleggerÅBoINorgeTolvMnd: {
                id: 'søker-planlegger-å-bo-i-norge-sammenhengende-tolv-måneder',
                svar: null,
            },
            erAsylsøker: {
                id: 'er-asylsøker',
                svar: 'NEI',
            },
            jobberPåBåt: {
                id: 'jobber-på-båt',
                svar: 'NEI',
            },
            arbeidsland: {
                id: 'arbeidsland',
                svar: '',
            },
            mottarUtenlandspensjon: {
                id: 'mottar-utenlandspensjon',
                svar: 'NEI',
            },
            pensjonsland: {
                id: 'pensjonsland',
                svar: '',
            },
            arbeidsperioderUtland: [],
            arbeidsperioderNorge: [],
            pensjonsperioderNorge: [],
            pensjonsperioderUtland: [],
            andreUtbetalingsperioder: [],
            harSamboerNå: {
                id: 'har-samboer-nå-og-gift',
                svar: 'NEI',
            },
            nåværendeSamboer: null,
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
            svar: 'NEI',
        },
        oppholderBarnSegIInstitusjon: {
            id: 'oppholder-barn-seg-i-institusjon',
            svar: 'NEI',
        },
        erBarnAdoptertFraUtland: {
            id: 'er-barn-adoptert-fra-utland',
            svar: 'NEI',
        },
        søktAsylForBarn: {
            id: 'søkt-asyl-for-barn',
            svar: 'NEI',
        },
        barnOppholdtSegTolvMndSammenhengendeINorge: {
            id: 'tolv-mnd-sammenhengende-i-norge',
            svar: 'JA',
        },
        mottarBarnetrygdForBarnFraAnnetEøsland: {
            id: 'barnetrygd-fra-annet-eøsland',
            svar: 'NEI',
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
            utenlandsperioder: [],
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
                        nb: 'JA',
                        nn: 'JA',
                        en: 'JA',
                    },
                },
                erAsylsøker: {
                    label: {
                        en: 'Are you an asylum seeker?',
                        nb: 'Er du asylsøker?',
                        nn: 'Er du asylsøkar?',
                    },
                    verdi: {
                        nb: 'NEI',
                        nn: 'NEI',
                        en: 'NEI',
                    },
                },
                jobberPåBåt: {
                    label: {
                        en: "Do you or have you worked outside of Norway, on a foreign ship or on another country's continental shelf?",
                        nb: 'Arbeider eller har du arbeidet utenfor Norge, på utenlandsk skip eller på utenlandsk kontinentalsokkel?',
                        nn: 'Arbeidar eller har du arbeida utanfor Noreg, på utanlandsk skip eller på utanlandsk kontinentalsokkel?',
                    },
                    verdi: {
                        nb: 'NEI',
                        nn: 'NEI',
                        en: 'NEI',
                    },
                },
                mottarUtenlandspensjon: {
                    label: {
                        en: 'Do you or have you received a pension from abroad?',
                        nb: 'Får eller har du fått pensjon fra utlandet?',
                        nn: 'Får eller har du fått pensjon frå utlandet?',
                    },
                    verdi: {
                        nb: 'NEI',
                        nn: 'NEI',
                        en: 'NEI',
                    },
                },
                harSamboerNå: {
                    label: {
                        en: 'Are you currently living with a cohabiting partner that is not your spouse?',
                        nb: 'Har du en annen samboer enn din ektefelle nå?',
                        nn: 'Har du ein anna sambuar enn din ektefelle no?',
                    },
                    verdi: {
                        nb: 'NEI',
                        nn: 'NEI',
                        en: 'NEI',
                    },
                },
            },
            tidligereSamboere: [],
            nåværendeSamboer: null,
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
                utenlandsperioder: [],
                andreForelder: {
                    navn: {
                        label: {
                            en: 'Name',
                            nb: 'Navn',
                            nn: 'Namn',
                        },
                        verdi: {
                            en: 'I am unable to provide information about the other parent',
                            nb: 'Jeg kan ikke gi opplysninger om den andre forelderen',
                            nn: 'Eg kan ikkje gje opplysningar om den andre forelderen',
                        },
                    },
                    fnr: {
                        label: {
                            en: 'Norwegian National identity number or D number',
                            nb: 'Fødselsnummer eller d-nummer',
                            nn: 'Fødselsnummer eller d-nummer',
                        },
                        verdi: {
                            nb: '',
                            nn: '',
                            en: '',
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
                    pensjonUtland: {
                        label: {
                            en: "Does BARN 234567 89876's other parent receive, or have they received a pension from abroad?",
                            nb: 'Får eller har den andre forelderen til BARN 234567 89876 fått pensjon fra utlandet?',
                            nn: 'Får eller har den andre forelderen til BARN 234567 89876 fått pensjon frå utlandet?',
                        },
                        verdi: {
                            nb: null,
                            nn: null,
                            en: null,
                        },
                    },
                    pensjonHvilketLand: {
                        label: {
                            en: "What country does BARN 234567 89876's other parent receive a pension from?",
                            nb: 'Hvilket land får den andre forelderen til BARN 234567 89876 pensjon fra?',
                            nn: 'Kva land får den andre forelderen til BARN 234567 89876 pensjon frå?',
                        },
                        verdi: {
                            nb: 'UKJENT',
                            nn: 'UKJENT',
                            en: 'UKJENT',
                        },
                    },
                    arbeidUtlandet: {
                        label: {
                            en: "Does BARN 234567 89876's other parent work, or have they worked outside of Norway, on a foreign ship or on a foreign continental shelf?",
                            nb: 'Arbeider eller har den andre forelderen til BARN 234567 89876 arbeidet utenfor Norge, på utenlandsk skip eller på utenlandsk kontinentalsokkel?',
                            nn: 'Arbeidar eller har den andre forelderen til BARN 234567 89876 arbeida utanfor Noreg, på utanlandsk skip eller på utanlandsk kontinentalsokkel?',
                        },
                        verdi: {
                            nb: null,
                            nn: null,
                            en: null,
                        },
                    },
                    arbeidUtlandetHvilketLand: {
                        label: {
                            en: 'What country does the other parent work in?',
                            nb: 'Hvilket land arbeider den andre forelderen i?',
                            nn: 'Kva land arbeidar den andre forelderen i?',
                        },
                        verdi: {
                            nb: 'UKJENT',
                            nn: 'UKJENT',
                            en: 'UKJENT',
                        },
                    },
                    skriftligAvtaleOmDeltBosted: {
                        label: {
                            en: 'Do you and the other parent have a written agreement on dual residence for BARN 234567 89876?',
                            nb: 'Har du og den andre forelderen skriftlig avtale om delt bosted for BARN 234567 89876?',
                            nn: 'Har du og den andre forelderen skriftleg avtale om delt bustad for BARN 234567 89876?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
                    },
                    utvidet: {
                        søkerHarBoddMedAndreForelder: {
                            label: {
                                en: "Have you ever lived with BARN 234567 89876's other parent?",
                                nb: 'Har du bodd sammen med BARN 234567 89876 sin andre forelder?',
                                nn: 'Har du budd saman med BARN 234567 89876 sin andre forelder?',
                            },
                            verdi: {
                                nb: null,
                                nn: null,
                                en: null,
                            },
                        },
                        søkerFlyttetFraAndreForelderDato: {
                            label: {
                                en: 'When did you move apart?',
                                nb: 'Når flyttet dere fra hverandre?',
                                nn: 'Når flytta de frå kvarandre?',
                            },
                            verdi: {
                                nb: '',
                                nn: '',
                                en: '',
                            },
                        },
                    },
                },
                spørsmål: {
                    erFosterbarn: {
                        label: {
                            en: 'Which of the children are foster children?',
                            nb: 'Hvem av barna er fosterbarn?',
                            nn: 'Kven av barna er fosterbarn?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
                    },
                    erAdoptertFraUtland: {
                        label: {
                            en: 'Which of the children are adopted from abroad?',
                            nb: 'Hvem av barna er adoptert fra utlandet?',
                            nn: 'Kven av barna er adoptert frå utlandet?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
                    },
                    erAsylsøker: {
                        label: {
                            en: 'For which of the children has an application for asylum been submitted?',
                            nb: 'Hvem av barna er det søkt om asyl for?',
                            nn: 'Kven av barna er det søkt om asyl for?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
                    },
                    barnetrygdFraAnnetEøsland: {
                        label: {
                            en: 'For which of the children are you receiving, have received or have applied for child benefit?',
                            nb: 'Hvem av barna får du, har du fått eller har du søkt om barnetrygd for?',
                            nn: 'Kven av barna får du, har du fått eller har du søkt om barnetrygd for?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
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
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
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
                    boddMindreEnn12MndINorge: {
                        label: {
                            en: 'Which of the children have stayed outside of Norway during the last twelve months?',
                            nb: 'Hvem av barna har oppholdt seg utenfor Norge i løpet av de siste tolv månedene?',
                            nn: 'Kven av barna har oppheldt seg utanfor Noreg i løpet av dei siste tolv månadene?',
                        },
                        verdi: {
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
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
                            nb: 'NEI',
                            nn: 'NEI',
                            en: 'NEI',
                        },
                    },
                    søkerForTidsromSluttdato: {
                        label: {
                            en: 'Up to and including',
                            nb: 'Til og med',
                            nn: 'Til og med',
                        },
                        verdi: {
                            nb: '',
                            nn: '',
                            en: '',
                        },
                    },
                    institusjonOppholdSluttdato: {
                        label: {
                            en: 'When is the stay at the institution ending?',
                            nb: 'Når avsluttes institusjonsoppholdet?',
                            nn: 'Når avsluttast institusjonsopphaldet?',
                        },
                        verdi: {
                            nb: '',
                            nn: '',
                            en: '',
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
                    nb: 'NEI',
                    nn: 'NEI',
                    en: 'NEI',
                },
            },
            søktAsylForBarn: {
                label: {
                    en: 'Has an application for asylum been submitted for any of the children?',
                    nb: 'Er det søkt om asyl i Norge for noen av barna?',
                    nn: 'Er det søkt om asyl i Noreg for nokre av barna?',
                },
                verdi: {
                    nb: 'NEI',
                    nn: 'NEI',
                    en: 'NEI',
                },
            },
            oppholderBarnSegIInstitusjon: {
                label: {
                    en: 'Are any of the children in a child welfare institution or other institution?',
                    nb: 'Er noen av barna i barnverninstitusjon eller i annen institusjon?',
                    nn: 'Er nokre av barna i barneverninstitusjon eller i anna institusjon?',
                },
                verdi: {
                    nb: 'NEI',
                    nn: 'NEI',
                    en: 'NEI',
                },
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                label: {
                    en: 'Have the children stayed continuously in Norway during the last twelve months?',
                    nb: 'Har barna oppholdt seg sammenhengende i Norge de siste tolv månedene?',
                    nn: 'Har barna oppheldt seg samanhengande i Noreg dei siste tolv månadene?',
                },
                verdi: {
                    nb: 'JA',
                    nn: 'JA',
                    en: 'JA',
                },
            },
            erBarnAdoptertFraUtland: {
                label: {
                    en: 'Are any of the children adopted from abroad?',
                    nb: 'Er noen av barna adoptert fra utlandet?',
                    nn: 'Er nokre av barna adoptert frå utlandet?',
                },
                verdi: {
                    nb: 'NEI',
                    nn: 'NEI',
                    en: 'NEI',
                },
            },
            mottarBarnetrygdForBarnFraAnnetEøsland: {
                label: {
                    en: 'Are you receiving, have you received or have you applied for child benefit for some of the children from another EEA country?',
                    nb: 'Får, har du fått eller har du søkt om barnetrygd for noen av barna fra et annet EØS land?',
                    nn: 'Får du, har du fått eller har du søkt om barnetrygd for nokre av barna frå eit anna EØS land?',
                },
                verdi: {
                    nb: 'NEI',
                    nn: 'NEI',
                    en: 'NEI',
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

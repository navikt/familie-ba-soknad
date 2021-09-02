import { OmBarnaDineSpørsmålId } from '../../../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { ESøknadstype } from '../../../typer/søknad';

export const inputISøknad = {
    søknadstype: ESøknadstype.UTVIDET,
    barnInkludertISøknaden: [
        {
            id: '38edcd47-72ab-42d7-ae06-a5d7652c284d',
            navn: 'Barn navn',
            ident: '23456789876',
            alder: '12 år',
            borMedSøker: false,
            adressebeskyttelse: true,
            barnErFyltUt: true,
            utvidet: {
                søkerHarBoddMedAndreForelder: {
                    id: 'søker-har-bodd-med-andre-forelder',
                    svar: 'JA',
                },
                søkerFlyttetFraAndreForelderDato: {
                    id: 'søker-flyttet-fra-andre-forelder-dato',
                    svar: 'UKJENT',
                },
            },
            erFosterbarn: { id: 'hvem-er-fosterbarn', svar: 'JA' },
            erAdoptertFraUtland: { id: 'hvem-er-adoptert-fra-utland', svar: 'JA' },
            erAsylsøker: { id: 'hvem-er-søkt-asyl-for', svar: 'JA' },
            barnetrygdFraAnnetEøsland: {
                id: OmBarnaDineSpørsmålId.hvemBarnetrygdFraAnnetEøsland,
                svar: 'JA',
            },
            oppholderSegIInstitusjon: { id: 'hvem-oppholder-seg-i-institusjon', svar: 'JA' },
            institusjonsnavn: { id: 'institusjonsnavn', svar: 'ints navn' },
            institusjonsadresse: { id: 'institusjonsadresse', svar: 'adresse institusjon' },
            institusjonspostnummer: { id: 'institusjonspostnummer', svar: '4321' },
            institusjonOppholdStartdato: {
                id: 'institusjon-opphold-startdato',
                svar: '2021-07-14',
            },
            institusjonOppholdSluttdato: { id: 'institusjon-opphold-sluttdato', svar: 'UKJENT' },
            oppholderSegIUtland: { id: 'hvem-oppholder-seg-i-utland', svar: 'JA' },
            oppholdsland: { id: 'barn-oppholdsland', svar: 'BHS' },
            oppholdslandSluttdato: { id: 'barn-utenlandsopphold-sluttdato', svar: '2021-08-18' },
            oppholdslandStartdato: { id: 'barn-utenlandsopphold-startdato', svar: '2021-07-13' },
            boddMindreEnn12MndINorge: { id: 'hvem-tolv-mnd-sammenhengende-i-norge', svar: 'NEI' },
            nårKomBarnTilNorgeDato: { id: 'når-kom-barnet-til-norge', svar: '' },
            planleggerÅBoINorge12Mnd: {
                id: 'barn-planlegger-å-bo-sammenhengende-i-norge-12mnd',
                svar: null,
            },
            barnetrygdFraEøslandHvilketLand: { id: 'barnetrygd-hvilket-eøsland', svar: 'AGO' },
            andreForelderNavn: { id: 'andre-forelder-navn', svar: '' },
            andreForelderFnr: { id: 'andre-forelder-fødsels-/dnummer', svar: '' },
            andreForelderFødselsdato: { id: 'andre-forelder-fødselsdato', svar: '' },
            andreForelderArbeidUtlandet: { id: 'andre-forelder-arbeid', svar: null },
            andreForelderArbeidUtlandetHvilketLand: {
                id: 'andre-forelder-arbeid-hvilket-land',
                svar: '',
            },
            andreForelderPensjonUtland: { id: 'andre-forelder-pensjon-utland', svar: null },
            andreForelderPensjonHvilketLand: {
                id: 'andre-forelder-pensjon-hvilket-land',
                svar: '',
            },
            borFastMedSøker: { id: 'bor-barnet-fast-med-deg', svar: 'JA' },
            skriftligAvtaleOmDeltBosted: { id: 'skriftlig-avtale-om-delt-bosted', svar: null },
            søkerForTidsromStartdato: { id: 'søker-for-tidsrom-startdato', svar: '2021-09-08' },
            søkerForTidsromSluttdato: { id: 'søker-for-tidsrom-sluttdato', svar: '2021-09-22' },
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
            gjelderForBarnId: ['38edcd47-72ab-42d7-ae06-a5d7652c284d'],
            gjelderForSøker: false,
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    dokumentId: 'f85ef180-ba37-48fd-8153-07060271c347',
                    navn: 'Screenshot 2021-08-13 at 13.04.31.png',
                    størrelse: 810149,
                    tidspunkt: '2021-09-01T11:42:59.852Z',
                },
            ],
        },
        {
            dokumentasjonsbehov: 'ADOPSJON_DATO',
            tittelSpråkId: 'dokumentasjon.adopsjon.vedleggtittel',
            beskrivelseSpråkId: 'dokumentasjon.adopsjon.informasjon',
            gjelderForBarnId: ['38edcd47-72ab-42d7-ae06-a5d7652c284d'],
            gjelderForSøker: false,
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    dokumentId: '0883c3ec-92a5-4f46-b0d7-6f0cba7bd2f7',
                    navn: 'Screenshot 2021-08-12 at 11.05.12.png',
                    størrelse: 149324,
                    tidspunkt: '2021-09-01T11:42:59.863Z',
                },
            ],
        },
        {
            dokumentasjonsbehov: 'BEKREFTELSE_FRA_BARNEVERN',
            tittelSpråkId: 'dokumentasjon.bekreftelsebarnevernet.vedleggtittel',
            beskrivelseSpråkId: 'dokumentasjon.bekreftelsebarnevernet.informasjon',
            gjelderForBarnId: ['38edcd47-72ab-42d7-ae06-a5d7652c284d'],
            gjelderForSøker: false,
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    dokumentId: '5ff8ddfe-a568-403a-bec3-a58c22e39504',
                    navn: 'Screenshot 2021-08-23 at 09.39.51.png',
                    størrelse: 115627,
                    tidspunkt: '2021-09-01T11:42:59.867Z',
                },
            ],
        },
        {
            dokumentasjonsbehov: 'BOR_FAST_MED_SØKER',
            tittelSpråkId: 'dokumentasjon.bekreftelseborsammen.vedleggtittel',
            beskrivelseSpråkId: 'dokumentasjon.bekreftelseborsammen.informasjon',
            gjelderForBarnId: ['38edcd47-72ab-42d7-ae06-a5d7652c284d'],
            gjelderForSøker: false,
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    dokumentId: 'aceb1761-7448-4ed1-87c5-bb3af660cc0d',
                    navn: 'Screenshot 2021-08-27 at 08.54.15.png',
                    størrelse: 153822,
                    tidspunkt: '2021-09-01T11:42:59.870Z',
                },
            ],
        },
        {
            dokumentasjonsbehov: 'SEPARERT_SKILT_ENKE',
            tittelSpråkId: 'dokumentasjon.separasjonskilsmissedødsfall.vedleggtittel',
            beskrivelseSpråkId: 'dokumentasjon.separasjonskilsmissedødsfall.informasjon',
            gjelderForBarnId: [],
            gjelderForSøker: true,
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    dokumentId: '494b4e7d-3969-4c32-b749-0955bd7be791',
                    navn: 'Screenshot 2021-08-12 at 11.05.12.png',
                    størrelse: 149324,
                    tidspunkt: '2021-09-01T11:42:59.874Z',
                },
            ],
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
            beskrivelseSpråkId: 'dokumentasjon.annendokumentasjon.utvidet.informasjon',
            gjelderForBarnId: [],
            gjelderForSøker: false,
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    dokumentId: 'ab284204-4081-451d-9784-af084038975e',
                    navn: 'Screenshot 2021-08-23 at 09.39.51.png',
                    størrelse: 115627,
                    tidspunkt: '2021-09-01T11:42:59.877Z',
                },
            ],
        },
    ],
    søker: {
        navn: 'Voksen Voksnessen',
        barn: [
            {
                id: '38edcd47-72ab-42d7-ae06-a5d7652c284d',
                navn: null,
                ident: '23456789876',
                alder: '12 år',
                borMedSøker: false,
                adressebeskyttelse: true,
            },
            {
                id: 'ec49c51c-f87d-46ac-91f5-2cd2e9d344d6',
                navn: 'Barn Barnessen III',
                ident: '12345678987',
                alder: '11 år',
                borMedSøker: true,
                adressebeskyttelse: false,
            },
        ],
        statsborgerskap: [{ landkode: 'NOR' }, { landkode: 'AFG' }],
        ident: '23058518298',
        sivilstand: { type: 'GIFT' },
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
        borPåRegistrertAdresse: { id: 'bor-på-registrert-adresse', svar: 'JA' },
        oppholderSegINorge: { id: 'søker-oppholder-seg-i-norge', svar: 'JA' },
        oppholdsland: { id: 'søker-oppholdsland', svar: '' },
        oppholdslandDato: { id: 'søker-oppholdsland-dato', svar: '' },
        værtINorgeITolvMåneder: {
            id: 'søker-vært-i-norge-sammenhengende-tolv-måneder',
            svar: 'JA',
        },
        komTilNorgeDato: { id: 'søker-kom-til-norge-dato', svar: '' },
        planleggerÅBoINorgeTolvMnd: {
            id: 'søker-planlegger-å-bo-i-norge-sammenhengende-tolv-måneder',
            svar: null,
        },
        erAsylsøker: { id: 'er-asylsøker', svar: 'NEI' },
        jobberPåBåt: { id: 'jobber-på-båt', svar: 'NEI' },
        arbeidsland: { id: 'arbeidsland', svar: '' },
        mottarUtenlandspensjon: { id: 'mottar-utenlandspensjon', svar: 'NEI' },
        pensjonsland: { id: 'pensjonsland', svar: '' },
        utvidet: {
            spørsmål: {
                årsak: { id: 'årsak', svar: 'SKILT' },
                separertEnkeSkilt: { id: 'separert-enke-skilt', svar: 'JA' },
                separertEnkeSkiltUtland: { id: 'separert-enke-skilt-utland', svar: 'NEI' },
                separertEnkeSkiltDato: { id: 'separert-enke-skilt-dato', svar: '2021-09-09' },
                harSamboerNå: { id: 'har-samboer-nå', svar: 'JA' },
            },
            nåværendeSamboer: {
                navn: { id: 'utvidet-nåværende-samboer-navn', svar: 'Gunnar' },
                ident: { id: 'utvidet-nåværende-samboer-fnr', svar: 'UKJENT' },
                fødselsdato: { id: 'utvidet-nåværende-samboer-fødselsdato', svar: 'UKJENT' },
                samboerFraDato: {
                    id: 'utvidet-nåværende-samboer-samboerFraDato',
                    svar: '2021-08-11',
                },
            },
            tidligereSamboere: [
                {
                    navn: { id: 'utvidet-tidligere-samboer-navn', svar: 'Donald' },
                    ident: { id: 'utvidet-tidligere-samboer-fnr', svar: 'UKJENT' },
                    fødselsdato: {
                        id: 'utvidet-tidligere-samboer-fødselsdato',
                        svar: '2021-09-02',
                    },
                    samboerFraDato: {
                        id: 'utvidet-tidligere-samboer-samboerFraDato',
                        svar: '2021-08-04',
                    },
                    samboerTilDato: {
                        id: 'utvidet-tidligere-samboer-samboerTilDato',
                        svar: '2021-08-19',
                    },
                },
            ],
        },
    },
    erNoenAvBarnaFosterbarn: { id: 'er-noen-av-barna-fosterbarn', svar: 'JA' },
    oppholderBarnSegIInstitusjon: { id: 'oppholder-barn-seg-i-institusjon', svar: 'JA' },
    erBarnAdoptertFraUtland: { id: 'er-barn-adoptert-fra-utland', svar: 'JA' },
    oppholderBarnSegIUtland: { id: 'oppholder-barn-seg-i-utland', svar: 'JA' },
    søktAsylForBarn: { id: 'søkt-asyl-for-barn', svar: 'JA' },
    barnOppholdtSegTolvMndSammenhengendeINorge: {
        id: 'tolv-mnd-sammenhengende-i-norge',
        svar: 'JA',
    },
    mottarBarnetrygdForBarnFraAnnetEøsland: { id: 'barnetrygd-fra-annet-eøsland', svar: 'JA' },
};

export const outputSoknadKontrakt = {
    søknadstype: 'UTVIDET',
    søker: {
        navn: { label: 'Navn', verdi: 'Voksen Voksnessen' },
        ident: { label: 'Ident', verdi: '23058518298' },
        sivilstand: { label: 'Sivilstand', verdi: 'GIFT' },
        statsborgerskap: { label: 'Statsborgerskap', verdi: ['Norge', 'Afghanistan'] },
        adresse: {
            label: 'Adresse',
            verdi: {
                adressenavn: 'Solveien',
                postnummer: '2304',
                husnummer: '2',
                husbokstav: 'A',
                bruksenhetnummer: 'H0101',
                bostedskommune: null,
                poststed: 'HAMAR',
            },
        },
        spørsmål: {
            borPåRegistrertAdresse: { label: 'Bor du på denne adressen?', verdi: 'JA' },
            oppholderSegINorge: { label: 'Oppholder du deg i Norge?', verdi: 'JA' },
            værtINorgeITolvMåneder: {
                label: 'Har du bodd sammenhengende i Norge de siste tolv månedene?',
                verdi: 'JA',
            },
            erAsylsøker: { label: 'Er du asylsøker?', verdi: 'NEI' },
            jobberPåBåt: {
                label:
                    'Arbeider du i utlandet, på utenlandsk skip eller på utenlandsk kontinentalsokkel?',
                verdi: 'NEI',
            },
            mottarUtenlandspensjon: { label: 'Får du pensjon fra utlandet?', verdi: 'NEI' },
        },
        utvidet: {
            label: 'Utvidet',
            verdi: {
                spørsmål: {
                    årsak: { label: 'Hvorfor søker du om utvidet barnetrygd?', verdi: 'SKILT' },
                    separertEnkeSkilt: {
                        label:
                            'Er du separert, skilt eller enke/enkemann uten at dette er registrert i folkeregisteret i Norge?',
                        verdi: 'JA',
                    },
                    separertEnkeSkiltUtland: {
                        label: 'Er du separert, skilt eller enke/enkemann i utlandet?',
                        verdi: 'NEI',
                    },
                    separertEnkeSkiltDato: {
                        label: 'Fra hvilken dato er du separert, skilt eller enke/enkemann? ',
                        verdi: '2021-09-09',
                    },
                    harSamboerNå: { label: 'Har du samboer nå?', verdi: 'JA' },
                },
                tidligereSamboere: [
                    {
                        label: 'Tidligere samboer: Donald',
                        verdi: {
                            navn: { label: 'Samboerens navn', verdi: 'Donald' },
                            ident: { label: 'Fødselsnummer eller d-nummer', verdi: 'UKJENT' },
                            fødselsdato: { label: 'Fødselsdato', verdi: '2021-09-02' },
                            samboerFraDato: {
                                label: 'Når startet samboerforholdet?',
                                verdi: '2021-08-04',
                            },
                            samboerTilDato: {
                                label: 'Når ble samboerforholdet avsluttet?',
                                verdi: '2021-08-19',
                            },
                        },
                    },
                ],
                nåværendeSamboer: {
                    label: 'Samboer',
                    verdi: {
                        navn: { label: 'Samboerens navn', verdi: 'Gunnar' },
                        ident: { label: 'Fødselsnummer eller d-nummer', verdi: 'UKJENT' },
                        fødselsdato: { label: 'Fødselsdato', verdi: 'UKJENT' },
                        samboerFraDato: {
                            label: 'Når startet samboerforholdet?',
                            verdi: '2021-08-11',
                        },
                    },
                },
            },
        },
    },
    barn: [
        {
            navn: { label: 'Navn', verdi: 'Barn 234567 89876' },
            ident: { label: 'Ident', verdi: '23456789876' },
            borMedSøker: { label: 'Bor med søker', verdi: false },
            alder: { label: 'Alder', verdi: '12 år' },
            spørsmål: {
                erFosterbarn: { label: 'Hvem av barna er fosterbarn?', verdi: 'JA' },
                erAdoptertFraUtland: {
                    label: 'Hvem av barna er adoptert fra utlandet?',
                    verdi: 'JA',
                },
                erAsylsøker: { label: 'Hvem av barna er det søkt om asyl for?', verdi: 'JA' },
                barnetrygdFraAnnetEøsland: {
                    label: 'Hvem av barna får eller er det søkt om barnetrygd for?',
                    verdi: 'JA',
                },
                oppholderSegIInstitusjon: {
                    label: 'Hvem av barna oppholder seg i institusjon?',
                    verdi: 'JA',
                },
                institusjonsnavn: { label: 'Navnet på institusjonen', verdi: 'ints navn' },
                institusjonsadresse: {
                    label: 'Adressen til institusjonen',
                    verdi: 'adresse institusjon',
                },
                institusjonspostnummer: { label: 'Postnummer', verdi: '4321' },
                institusjonOppholdStartdato: {
                    label: 'Når begynte oppholdet? ',
                    verdi: '2021-07-14',
                },
                institusjonOppholdSluttdato: {
                    label: 'Når skal oppholdet avsluttes? ',
                    verdi: 'UKJENT',
                },
                oppholderSegIUtland: {
                    label: 'Hvem av barna oppholder seg i utlandet?',
                    verdi: 'JA',
                },
                oppholdsland: { label: 'Hvilket land oppholder barnet seg i?', verdi: 'Bahamas' },
                oppholdslandSluttdato: {
                    label: 'Når skal oppholdet avsluttes?',
                    verdi: '2021-08-18',
                },
                oppholdslandStartdato: { label: 'Når begynte oppholdet?', verdi: '2021-07-13' },
                boddMindreEnn12MndINorge: {
                    label: 'Hvem av barna har bodd mindre enn tolv måneder sammenhengende i Norge?',
                    verdi: 'NEI',
                },
                barnetrygdFraEøslandHvilketLand: {
                    label: 'Hvilket land får eller har du søkt om barnetrygd fra?',
                    verdi: 'Angola',
                },
                borFastMedSøker: { label: 'Bor {navn} fast sammen med deg?', verdi: 'JA' },
                søkerForTidsromStartdato: { label: 'Fra og med ', verdi: '2021-09-08' },
                søkerForTidsromSluttdato: { label: 'Til og med ', verdi: '2021-09-22' },
            },
            utvidet: {
                søkerHarBoddMedAndreForelder: {
                    label: 'Har du bodd sammen med den andre forelderen?',
                    verdi: 'JA',
                },
                søkerFlyttetFraAndreForelderDato: {
                    label: 'Når flyttet dere fra hverandre?',
                    verdi: 'UKJENT',
                },
            },
        },
    ],
    spørsmål: {
        erNoenAvBarnaFosterbarn: { label: 'Er noen av barna fosterbarn?', verdi: 'JA' },
        søktAsylForBarn: { label: 'Er det søkt om asyl i Norge for noen av barna?', verdi: 'JA' },
        oppholderBarnSegIInstitusjon: {
            label: 'Oppholder noen av barna seg i barnverninstitusjon \neller i annen institusjon?',
            verdi: 'JA',
        },
        barnOppholdtSegTolvMndSammenhengendeINorge: {
            label: 'Har barna bodd sammenhengende i Norge de siste tolv månedene?',
            verdi: 'JA',
        },
        erBarnAdoptertFraUtland: { label: 'Er noen av barna adoptert fra utlandet?', verdi: 'JA' },
        mottarBarnetrygdForBarnFraAnnetEøsland: {
            label:
                'Får du eller er det søkt om barnetrygd for noen av barna fra et annet EØS land?',
            verdi: 'JA',
        },
        oppholderBarnSegIUtland: { label: 'Oppholder noen av barna seg i utlandet?', verdi: 'JA' },
        lestOgForståttBekreftelse: {
            label:
                'Jeg er klar over at jeg kan miste retten til barnetrygd dersom jeg gir feil opplysninger. Jeg er også klar over at jeg må betale tilbake dersom jeg får penger jeg ikke har rett til hvis jeg lar være å informere eller gir feil opplysninger.',
            verdi: 'Jeg bekrefter at jeg har lest og forstått.',
        },
        oppfølgingsspørsmåltekster: {
            label:
                'Tekster som ellers trengs til pdf-gen, typ "Du har opplyst at {navn} oppholder seg i institusjon"',
            verdi: {
                'ombarnet.fosterbarn': 'Du har opplyst at {navn} er fosterbarn',
                'ombarnet.institusjon': 'Du har opplyst at {navn} oppholder seg i institusjon.',
                'ombarnet.oppholdutland': 'Du har opplyst at {navn} oppholder seg i utlandet',
                'ombarnet.sammenhengende-opphold':
                    'Du har opplyst at {navn} ikke har bodd\nsammenhengende i Norge de siste tolv månedene',
                'ombarnet.barnetrygd-eøs':
                    'Du har opplyst at du får eller har søkt om barnetrygd\nfor {navn} fra et annet EØS land.',
            },
        },
    },
    dokumentasjon: [
        {
            dokumentasjonsbehov: 'VEDTAK_OPPHOLDSTILLATELSE',
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    navn: 'Screenshot 2021-08-13 at 13.04.31.png',
                    dokumentId: 'f85ef180-ba37-48fd-8153-07060271c347',
                    tittel: 'VEDTAK_OPPHOLDSTILLATELSE',
                },
            ],
        },
        {
            dokumentasjonsbehov: 'ADOPSJON_DATO',
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    navn: 'Screenshot 2021-08-12 at 11.05.12.png',
                    dokumentId: '0883c3ec-92a5-4f46-b0d7-6f0cba7bd2f7',
                    tittel: 'ADOPSJON_DATO',
                },
            ],
        },
        {
            dokumentasjonsbehov: 'BEKREFTELSE_FRA_BARNEVERN',
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    navn: 'Screenshot 2021-08-23 at 09.39.51.png',
                    dokumentId: '5ff8ddfe-a568-403a-bec3-a58c22e39504',
                    tittel: 'BEKREFTELSE_FRA_BARNEVERN',
                },
            ],
        },
        {
            dokumentasjonsbehov: 'BOR_FAST_MED_SØKER',
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    navn: 'Screenshot 2021-08-27 at 08.54.15.png',
                    dokumentId: 'aceb1761-7448-4ed1-87c5-bb3af660cc0d',
                    tittel: 'BOR_FAST_MED_SØKER',
                },
            ],
        },
        {
            dokumentasjonsbehov: 'SEPARERT_SKILT_ENKE',
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    navn: 'Screenshot 2021-08-12 at 11.05.12.png',
                    dokumentId: '494b4e7d-3969-4c32-b749-0955bd7be791',
                    tittel: 'SEPARERT_SKILT_ENKE',
                },
            ],
        },
        {
            dokumentasjonsbehov: 'ANNEN_DOKUMENTASJON',
            harSendtInn: false,
            opplastedeVedlegg: [
                {
                    navn: 'Screenshot 2021-08-23 at 09.39.51.png',
                    dokumentId: 'ab284204-4081-451d-9784-af084038975e',
                    tittel: 'ANNEN_DOKUMENTASJON',
                },
            ],
        },
    ],
};

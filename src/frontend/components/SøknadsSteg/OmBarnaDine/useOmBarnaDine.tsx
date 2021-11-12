import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { Dokumentasjonsbehov } from '../../../typer/dokumentasjon';
import { barnDataKeySpørsmål, ESivilstand } from '../../../typer/person';
import { IOmBarnaDineFeltTyper } from '../../../typer/skjema';
import { Årsak } from '../../../typer/utvidet';
import { genererOppdaterteBarn } from '../../../utils/barn';
import { OmBarnaDineSpørsmålId } from './spørsmål';
import useBarnCheckboxFelt from './useBarnCheckboxFelt';

export const useOmBarnaDine = (): {
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad } = useApp();

    const erNoenAvBarnaFosterbarn = useJaNeiSpmFelt(
        søknad.erNoenAvBarnaFosterbarn,
        'ombarna.fosterbarn.feilmelding'
    );

    const hvemErFosterbarn = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erFosterbarn,
        'ombarna.fosterbarn.hvem.feilmelding',
        erNoenAvBarnaFosterbarn
    );

    const oppholderBarnSegIInstitusjon = useJaNeiSpmFelt(
        søknad.oppholderBarnSegIInstitusjon,
        'ombarna.institusjon.feilmelding'
    );

    const hvemOppholderSegIInstitusjon = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIInstitusjon,
        'ombarna.institusjon.hvem.feilmelding',
        oppholderBarnSegIInstitusjon
    );

    const erBarnAdoptertFraUtland = useJaNeiSpmFelt(
        søknad.erBarnAdoptertFraUtland,
        'ombarna.adoptert.feilmelding',
        {
            erNoenAvBarnaFosterbarn: {
                hovedSpørsmål: erNoenAvBarnaFosterbarn,
                tilhørendeFelter: [hvemErFosterbarn],
            },
            oppholderBarnSegIInstitusjon: {
                hovedSpørsmål: oppholderBarnSegIInstitusjon,
                tilhørendeFelter: [hvemOppholderSegIInstitusjon],
            },
        }
    );

    const hvemErAdoptertFraUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAdoptertFraUtland,
        'ombarna.adoptert.hvem.feilmelding',
        erBarnAdoptertFraUtland
    );

    const søktAsylForBarn = useJaNeiSpmFelt(søknad.søktAsylForBarn, 'ombarna.asyl.feilmelding', {
        erBarnAdoptertFraUtland: {
            hovedSpørsmål: erBarnAdoptertFraUtland,
            tilhørendeFelter: [hvemErAdoptertFraUtland],
        },
    });

    const hvemErSøktAsylFor = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAsylsøker,
        'ombarna.asyl.hvem.feilmelding',
        søktAsylForBarn
    );

    const barnOppholdtSegTolvMndSammenhengendeINorge = useJaNeiSpmFelt(
        søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
        'ombarna.sammenhengende-opphold.feilmelding',
        {
            erBarnAdoptertFraUtland: {
                hovedSpørsmål: erBarnAdoptertFraUtland,
                tilhørendeFelter: [hvemErAdoptertFraUtland],
            },
        }
    );

    const hvemTolvMndSammenhengendeINorge = useBarnCheckboxFelt(
        barnDataKeySpørsmål.boddMindreEnn12MndINorge,
        'ombarna.sammenhengende-opphold.hvem.feilmelding',
        barnOppholdtSegTolvMndSammenhengendeINorge,
        ESvar.NEI
    );

    const mottarBarnetrygdForBarnFraAnnetEøsland = useJaNeiSpmFelt(
        søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
        'ombarna.barnetrygd-eøs.feilmelding',
        {
            søktAsylForBarn: {
                hovedSpørsmål: søktAsylForBarn,
                tilhørendeFelter: [hvemErSøktAsylFor],
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                hovedSpørsmål: barnOppholdtSegTolvMndSammenhengendeINorge,
                tilhørendeFelter: [hvemTolvMndSammenhengendeINorge],
            },
        }
    );

    const hvemBarnetrygdFraAnnetEøsland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.barnetrygdFraAnnetEøsland,
        'ombarna.barnetrygd-eøs.hvem.feilmelding',
        mottarBarnetrygdForBarnFraAnnetEøsland
    );

    const avdødPartnerForelderFeilmelding = () => {
        switch (søknad.erAvdødPartnerForelder.id) {
            case OmBarnaDineSpørsmålId.erOppgittAvdødPartnerForelder:
                return 'ombarna.enkeenkemann.feilmelding';
            case OmBarnaDineSpørsmålId.erFolkeregAvdødPartnerForelder:
                return 'ombarna.enkeenkemann.folkeregisteret-gjenlevende.feilmelding';
            default:
                return 'ombarna.enkeenkemann.folkeregisteret-enke.feilmelding';
        }
    };

    const erAvdødPartnerForelder = useJaNeiSpmFelt(
        søknad.erAvdødPartnerForelder,
        avdødPartnerForelderFeilmelding(),
        {
            søktAsylForBarn: {
                hovedSpørsmål: søktAsylForBarn,
                tilhørendeFelter: [hvemErSøktAsylFor],
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                hovedSpørsmål: barnOppholdtSegTolvMndSammenhengendeINorge,
                tilhørendeFelter: [hvemTolvMndSammenhengendeINorge],
            },
        },
        false,
        !(
            søknad.søker.sivilstand.type === ESivilstand.ENKE_ELLER_ENKEMANN ||
            søknad.søker.sivilstand.type === ESivilstand.GJENLEVENDE_PARTNER ||
            søknad.søker.utvidet.spørsmål.årsak.svar === Årsak.ENKE_ENKEMANN
        )
    );

    const hvemAvdødPartner = useBarnCheckboxFelt(
        barnDataKeySpørsmål.andreForelderErDød,
        'ombarna.enkeenkemann.hvem.feilmelding',
        erAvdødPartnerForelder
    );

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            erNoenAvBarnaFosterbarn: {
                ...søknad.erNoenAvBarnaFosterbarn,
                svar: erNoenAvBarnaFosterbarn.verdi,
            },
            oppholderBarnSegIInstitusjon: {
                ...søknad.oppholderBarnSegIInstitusjon,
                svar: oppholderBarnSegIInstitusjon.verdi,
            },
            erBarnAdoptertFraUtland: {
                ...søknad.erBarnAdoptertFraUtland,
                svar: erBarnAdoptertFraUtland.verdi,
            },
            søktAsylForBarn: {
                ...søknad.søktAsylForBarn,
                svar: søktAsylForBarn.verdi,
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                ...søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
                svar: barnOppholdtSegTolvMndSammenhengendeINorge.verdi,
            },
            mottarBarnetrygdForBarnFraAnnetEøsland: {
                ...søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
                svar: mottarBarnetrygdForBarnFraAnnetEøsland.verdi,
            },
            erAvdødPartnerForelder: {
                ...søknad.erAvdødPartnerForelder,
                svar: erAvdødPartnerForelder.verdi,
            },
            barnInkludertISøknaden: genererOppdaterteBarn(søknad, skjema),
            dokumentasjon: søknad.dokumentasjon.map(dok => {
                switch (dok.dokumentasjonsbehov) {
                    case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
                        return {
                            ...dok,
                            gjelderForBarnId: hvemErSøktAsylFor.verdi,
                        };
                    case Dokumentasjonsbehov.ADOPSJON_DATO:
                        return {
                            ...dok,
                            gjelderForBarnId: hvemErAdoptertFraUtland.verdi,
                        };
                    case Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN:
                        return {
                            ...dok,
                            gjelderForBarnId: hvemErFosterbarn.verdi,
                        };
                    default:
                        return dok;
                }
            }),
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IOmBarnaDineFeltTyper,
        string
    >({
        felter: {
            erNoenAvBarnaFosterbarn,
            oppholderBarnSegIInstitusjon,
            erBarnAdoptertFraUtland,
            søktAsylForBarn,
            barnOppholdtSegTolvMndSammenhengendeINorge,
            mottarBarnetrygdForBarnFraAnnetEøsland,
            erAvdødPartnerForelder,
            hvemErFosterbarn,
            hvemErAdoptertFraUtland,
            hvemOppholderSegIInstitusjon,
            hvemBarnetrygdFraAnnetEøsland,
            hvemTolvMndSammenhengendeINorge,
            hvemErSøktAsylFor,
            hvemAvdødPartner,
        },
        skjemanavn: 'ombarnadine',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        oppdaterSøknad,
        validerAlleSynligeFelter,
    };
};

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { Dokumentasjonsbehov } from '../../../typer/dokumentasjon';
import { barnDataKeySpørsmål, BarnetsId } from '../../../typer/person';
import { genererOppdaterteBarn } from '../../../utils/barn';
import useBarnCheckboxFelt from './useBarnCheckboxFelt';

export interface IOmBarnaDineFeltTyper {
    erNoenAvBarnaFosterbarn: ESvar | null;
    oppholderBarnSegIInstitusjon: ESvar | null;
    erBarnAdoptertFraUtland: ESvar | null;
    oppholderBarnSegIUtland: ESvar | null;
    søktAsylForBarn: ESvar | null;
    barnOppholdtSegTolvMndSammenhengendeINorge: ESvar | null;
    mottarBarnetrygdForBarnFraAnnetEøsland: ESvar | null;
    hvemErFosterbarn: BarnetsId[];
    hvemOppholderSegIInstitusjon: BarnetsId[];
    hvemErAdoptertFraUtland: BarnetsId[];
    hvemOppholderSegIUtland: BarnetsId[];
    hvemBarnetrygdFraAnnetEøsland: BarnetsId[];
    hvemTolvMndSammenhengendeINorge: BarnetsId[];
    hvemErSøktAsylFor: BarnetsId[];
}

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

    const oppholderBarnSegIUtland = useJaNeiSpmFelt(
        søknad.oppholderBarnSegIUtland,
        'ombarna.opphold-utland.feilmelding',
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

    const hvemOppholderSegIUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIUtland,
        'ombarna.opphold-utland.hvem.feilmelding',
        oppholderBarnSegIUtland
    );

    const søktAsylForBarn = useJaNeiSpmFelt(søknad.søktAsylForBarn, 'ombarna.asyl.feilmelding', {
        erBarnAdoptertFraUtland: {
            hovedSpørsmål: erBarnAdoptertFraUtland,
            tilhørendeFelter: [hvemErAdoptertFraUtland],
        },
        oppholderBarnSegIUtland: {
            hovedSpørsmål: oppholderBarnSegIUtland,
            tilhørendeFelter: [hvemOppholderSegIUtland],
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
            oppholderBarnSegIUtland: {
                hovedSpørsmål: oppholderBarnSegIUtland,
                tilhørendeFelter: [hvemOppholderSegIUtland],
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
            oppholderBarnSegIUtland: {
                ...søknad.oppholderBarnSegIUtland,
                svar: oppholderBarnSegIUtland.verdi,
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
            oppholderBarnSegIUtland,
            søktAsylForBarn,
            barnOppholdtSegTolvMndSammenhengendeINorge,
            mottarBarnetrygdForBarnFraAnnetEøsland,
            hvemErFosterbarn,
            hvemErAdoptertFraUtland,
            hvemOppholderSegIInstitusjon,
            hvemOppholderSegIUtland,
            hvemBarnetrygdFraAnnetEøsland,
            hvemTolvMndSammenhengendeINorge,
            hvemErSøktAsylFor,
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

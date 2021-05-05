import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { barnDataKeySpørsmål } from '../../../typer/person';
import { BarnetsIdent } from './HvilkeBarnCheckboxGruppe';
import useBarnCheckboxFelt from './useBarnCheckboxFelt';
import { genererOppdaterteBarn } from './utils';

export interface IOmBarnaDineFeltTyper {
    erNoenAvBarnaFosterbarn: ESvar | undefined;
    oppholderBarnSegIInstitusjon: ESvar | undefined;
    erBarnAdoptertFraUtland: ESvar | undefined;
    oppholderBarnSegIUtland: ESvar | undefined;
    søktAsylForBarn: ESvar | undefined;
    barnOppholdtSegTolvMndSammenhengendeINorge: ESvar | undefined;
    mottarBarnetrygdForBarnFraAnnetEøsland: ESvar | undefined;
    hvemErFosterbarn: BarnetsIdent[];
    hvemOppholderSegIInstitusjon: BarnetsIdent[];
    hvemErAdoptertFraUtland: BarnetsIdent[];
    hvemOppholderSegIUtland: BarnetsIdent[];
    hvemBarnetrygdFraAnnetEøsland: BarnetsIdent[];
    hvemTolvMndSammenhengendeINorge: BarnetsIdent[];
    hvemErSøktAsylFor: BarnetsIdent[];
}

export const useOmBarnaDine = (): {
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
} => {
    const { søknad, settSøknad } = useApp();

    const erNoenAvBarnaFosterbarn = useJaNeiSpmFelt(søknad.erNoenAvBarnaFosterbarn);

    const hvemErFosterbarn = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erFosterbarn,
        erNoenAvBarnaFosterbarn
    );

    const oppholderBarnSegIInstitusjon = useJaNeiSpmFelt(søknad.oppholderBarnSegIInstitusjon);

    const hvemOppholderSegIInstitusjon = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIInstitusjon,
        oppholderBarnSegIInstitusjon
    );

    const erBarnAdoptertFraUtland = useJaNeiSpmFelt(søknad.erBarnAdoptertFraUtland, {
        erNoenAvBarnaFosterbarn: {
            jaNeiSpm: erNoenAvBarnaFosterbarn,
            tilhørendeFelter: [hvemErFosterbarn],
        },
        oppholderBarnSegIInstitusjon: {
            jaNeiSpm: oppholderBarnSegIInstitusjon,
            tilhørendeFelter: [hvemOppholderSegIInstitusjon],
        },
    });

    const hvemErAdoptertFraUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAdoptertFraUtland,
        erBarnAdoptertFraUtland
    );

    const oppholderBarnSegIUtland = useJaNeiSpmFelt(søknad.oppholderBarnSegIUtland, {
        erNoenAvBarnaFosterbarn: {
            jaNeiSpm: erNoenAvBarnaFosterbarn,
            tilhørendeFelter: [hvemErFosterbarn],
        },
        oppholderBarnSegIInstitusjon: {
            jaNeiSpm: oppholderBarnSegIInstitusjon,
            tilhørendeFelter: [hvemOppholderSegIInstitusjon],
        },
    });

    const hvemOppholderSegIUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIUtland,
        oppholderBarnSegIUtland
    );

    const søktAsylForBarn = useJaNeiSpmFelt(søknad.søktAsylForBarn, {
        erBarnAdoptertFraUtland: {
            jaNeiSpm: erBarnAdoptertFraUtland,
            tilhørendeFelter: [hvemErAdoptertFraUtland],
        },
        oppholderBarnSegIUtland: {
            jaNeiSpm: oppholderBarnSegIUtland,
            tilhørendeFelter: [hvemOppholderSegIUtland],
        },
    });

    const hvemErSøktAsylFor = useBarnCheckboxFelt(barnDataKeySpørsmål.erAsylsøker, søktAsylForBarn);

    const barnOppholdtSegTolvMndSammenhengendeINorge = useJaNeiSpmFelt(
        søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
        {
            erBarnAdoptertFraUtland: {
                jaNeiSpm: erBarnAdoptertFraUtland,
                tilhørendeFelter: [hvemErAdoptertFraUtland],
            },
            oppholderBarnSegIUtland: {
                jaNeiSpm: oppholderBarnSegIUtland,
                tilhørendeFelter: [hvemOppholderSegIUtland],
            },
        }
    );

    const hvemTolvMndSammenhengendeINorge = useBarnCheckboxFelt(
        barnDataKeySpørsmål.boddMindreEnn12MndINorge,
        barnOppholdtSegTolvMndSammenhengendeINorge,
        ESvar.NEI
    );

    const mottarBarnetrygdForBarnFraAnnetEøsland = useJaNeiSpmFelt(
        søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
        {
            søktAsylForBarn: { jaNeiSpm: søktAsylForBarn, tilhørendeFelter: [hvemErSøktAsylFor] },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                jaNeiSpm: barnOppholdtSegTolvMndSammenhengendeINorge,
                tilhørendeFelter: [hvemTolvMndSammenhengendeINorge],
            },
        }
    );

    const hvemBarnetrygdFraAnnetEøsland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.barnetrygdFraAnnetEøsland,
        mottarBarnetrygdForBarnFraAnnetEøsland
    );

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            erNoenAvBarnaFosterbarn: {
                ...søknad.erNoenAvBarnaFosterbarn,
                svar: skjema.felter.erNoenAvBarnaFosterbarn.verdi,
            },
            oppholderBarnSegIInstitusjon: {
                ...søknad.oppholderBarnSegIInstitusjon,
                svar: skjema.felter.oppholderBarnSegIInstitusjon.verdi,
            },
            erBarnAdoptertFraUtland: {
                ...søknad.erBarnAdoptertFraUtland,
                svar: skjema.felter.erBarnAdoptertFraUtland.verdi,
            },
            oppholderBarnSegIUtland: {
                ...søknad.oppholderBarnSegIUtland,
                svar: skjema.felter.oppholderBarnSegIUtland.verdi,
            },
            søktAsylForBarn: {
                ...søknad.søktAsylForBarn,
                svar: skjema.felter.søktAsylForBarn.verdi,
            },
            barnOppholdtSegTolvMndSammenhengendeINorge: {
                ...søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
                svar: skjema.felter.barnOppholdtSegTolvMndSammenhengendeINorge.verdi,
            },
            mottarBarnetrygdForBarnFraAnnetEøsland: {
                ...søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
                svar: skjema.felter.mottarBarnetrygdForBarnFraAnnetEøsland.verdi,
            },
            barnInkludertISøknaden: genererOppdaterteBarn(søknad, skjema),
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IOmBarnaDineFeltTyper, string>({
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
    };
};

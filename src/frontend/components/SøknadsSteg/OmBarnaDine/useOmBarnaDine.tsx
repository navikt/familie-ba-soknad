import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { barnDataKeySpørsmål } from '../../../typer/person';
import { hentFiltrerteAvhengigheter } from '../../../utils/felthook';
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

    const erNoenAvBarnaFosterbarn = useJaNeiSpmFelt(
        søknad.erNoenAvBarnaFosterbarn,
        'personopplysninger.feilmelding.janei'
    );

    const hvemErFosterbarn = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erFosterbarn,
        'ombarnadine.feil.du-må-velge-barn',
        erNoenAvBarnaFosterbarn
    );

    const oppholderBarnSegIInstitusjon = useJaNeiSpmFelt(
        søknad.oppholderBarnSegIInstitusjon,
        'personopplysninger.feilmelding.janei'
    );

    const hvemOppholderSegIInstitusjon = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIInstitusjon,
        'ombarnadine.feil.du-må-velge-barn',
        oppholderBarnSegIInstitusjon
    );

    const erBarnAdoptertFraUtland = useJaNeiSpmFelt(
        søknad.erBarnAdoptertFraUtland,
        'personopplysninger.feilmelding.janei',
        hentFiltrerteAvhengigheter(
            [
                { jaNeiSpm: erNoenAvBarnaFosterbarn, tilhørendeFelter: { hvemErFosterbarn } },
                {
                    jaNeiSpm: oppholderBarnSegIInstitusjon,
                    tilhørendeFelter: { hvemOppholderSegIInstitusjon },
                },
            ],
            ESvar.JA
        )
    );

    const hvemErAdoptertFraUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAdoptertFraUtland,
        'ombarnadine.feil.du-må-velge-barn',
        erBarnAdoptertFraUtland
    );

    const oppholderBarnSegIUtland = useJaNeiSpmFelt(
        søknad.oppholderBarnSegIUtland,
        'personopplysninger.feilmelding.janei',
        hentFiltrerteAvhengigheter(
            [
                { jaNeiSpm: erNoenAvBarnaFosterbarn, tilhørendeFelter: { hvemErFosterbarn } },
                {
                    jaNeiSpm: oppholderBarnSegIInstitusjon,
                    tilhørendeFelter: { hvemOppholderSegIInstitusjon },
                },
            ],
            ESvar.JA
        )
    );

    const hvemOppholderSegIUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIUtland,
        'ombarnadine.feil.du-må-velge-barn',
        oppholderBarnSegIUtland
    );

    const søktAsylForBarn = useJaNeiSpmFelt(
        søknad.søktAsylForBarn,
        'personopplysninger.feilmelding.janei',
        hentFiltrerteAvhengigheter(
            [
                {
                    jaNeiSpm: erBarnAdoptertFraUtland,
                    tilhørendeFelter: { hvemErAdoptertFraUtland },
                },
                {
                    jaNeiSpm: oppholderBarnSegIUtland,
                    tilhørendeFelter: { hvemOppholderSegIUtland },
                },
            ],
            ESvar.JA
        )
    );

    const hvemErSøktAsylFor = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAsylsøker,
        'ombarnadine.feil.du-må-velge-barn',
        søktAsylForBarn
    );

    const barnOppholdtSegTolvMndSammenhengendeINorge = useJaNeiSpmFelt(
        søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
        'personopplysninger.feilmelding.janei',
        hentFiltrerteAvhengigheter(
            [
                {
                    jaNeiSpm: erBarnAdoptertFraUtland,
                    tilhørendeFelter: { hvemErAdoptertFraUtland },
                },
                {
                    jaNeiSpm: oppholderBarnSegIUtland,
                    tilhørendeFelter: { hvemOppholderSegIUtland },
                },
            ],
            ESvar.JA
        )
    );

    const hvemTolvMndSammenhengendeINorge = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholdtSegINorgeSammenhengendeTolvMnd,
        'ombarnadine.feil.du-må-velge-barn',
        barnOppholdtSegTolvMndSammenhengendeINorge
    );

    const mottarBarnetrygdForBarnFraAnnetEøsland = useJaNeiSpmFelt(
        søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
        'personopplysninger.feilmelding.janei',
        hentFiltrerteAvhengigheter(
            [
                { jaNeiSpm: søktAsylForBarn, tilhørendeFelter: { hvemErSøktAsylFor } },
                {
                    jaNeiSpm: barnOppholdtSegTolvMndSammenhengendeINorge,
                    tilhørendeFelter: { hvemTolvMndSammenhengendeINorge },
                },
            ],
            ESvar.JA
        )
    );

    const hvemBarnetrygdFraAnnetEøsland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.barnetrygdFraAnnetEøsland,
        'ombarnadine.feil.du-må-velge-barn',
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

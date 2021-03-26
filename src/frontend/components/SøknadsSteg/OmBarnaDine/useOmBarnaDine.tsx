import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål, IBarn } from '../../../typer/person';
import { søknadDataKeySpørsmål } from '../../../typer/søknad';
import { BarnetsIdent } from './HvilkeBarnCheckboxGruppe';
import useBarnCheckboxFelt from './useBarnCheckboxFelt';
import useJaNeiSpmFelt from './useJaNeiSpmFelt';

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
        søknadDataKeySpørsmål.erNoenAvBarnaFosterbarn,
        'personopplysninger.feilmelding.janei'
    );

    const hvemErFosterbarn = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erFosterbarn,
        'ombarnadine.feil.du-må-velge-barn',
        erNoenAvBarnaFosterbarn
    );

    const oppholderBarnSegIInstitusjon = useJaNeiSpmFelt(
        søknadDataKeySpørsmål.oppholderBarnSegIInstitusjon,
        'personopplysninger.feilmelding.janei'
    );

    const hvemOppholderSegIInstitusjon = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIInstitusjon,
        'ombarnadine.feil.du-må-velge-barn',
        oppholderBarnSegIInstitusjon
    );

    const erBarnAdoptertFraUtland = useJaNeiSpmFelt(
        søknadDataKeySpørsmål.erBarnAdoptertFraUtland,
        'personopplysninger.feilmelding.janei'
    );

    const hvemErAdoptertFraUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAdoptertFraUtland,
        'ombarnadine.feil.du-må-velge-barn',
        erBarnAdoptertFraUtland
    );

    const oppholderBarnSegIUtland = useJaNeiSpmFelt(
        søknadDataKeySpørsmål.oppholderBarnSegIUtland,
        'personopplysninger.feilmelding.janei'
    );

    const hvemOppholderSegIUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIUtland,
        'ombarnadine.feil.du-må-velge-barn',
        oppholderBarnSegIUtland
    );

    const søktAsylForBarn = useJaNeiSpmFelt(
        søknadDataKeySpørsmål.søktAsylForBarn,
        'personopplysninger.feilmelding.janei'
    );

    const hvemErSøktAsylFor = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAsylsøker,
        'ombarnadine.feil.du-må-velge-barn',
        søktAsylForBarn
    );

    const barnOppholdtSegTolvMndSammenhengendeINorge = useJaNeiSpmFelt(
        søknadDataKeySpørsmål.barnOppholdtSegTolvMndSammenhengendeINorge,
        'personopplysninger.feilmelding.janei'
    );

    const hvemTolvMndSammenhengendeINorge = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholdtSegINorgeSammenhengendeTolvMnd,
        'ombarnadine.feil.du-må-velge-barn',
        barnOppholdtSegTolvMndSammenhengendeINorge
    );

    const mottarBarnetrygdForBarnFraAnnetEøsland = useJaNeiSpmFelt(
        søknadDataKeySpørsmål.mottarBarnetrygdForBarnFraAnnetEøsland,
        'personopplysninger.feilmelding.janei'
    );

    const hvemBarnetrygdFraAnnetEøsland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.barnetrygdFraAnnetEøsland,
        'ombarnadine.feil.du-må-velge-barn',
        mottarBarnetrygdForBarnFraAnnetEøsland
    );

    const hentSvarForSpørsmålBarn = (barn: IBarn, felt: Felt<string[]>): ESvar =>
        felt.verdi.includes(barn.ident) ? ESvar.JA : ESvar.NEI;

    const genererOppdaterteBarn = (): IBarn[] => {
        return søknad.barnInkludertISøknaden.map(barn => {
            return {
                ...barn,
                erFosterbarn: {
                    ...barn.erFosterbarn,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn),
                },
                erAsylsøker: {
                    ...barn.erAsylsøker,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErSøktAsylFor),
                },
                erAdoptertFraUtland: {
                    ...barn.erAdoptertFraUtland,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErAdoptertFraUtland),
                },
                oppholderSegIInstitusjon: {
                    ...barn.oppholderSegIInstitusjon,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemOppholderSegIInstitusjon),
                },
                oppholdtSegINorgeSammenhengendeTolvMnd: {
                    ...barn.oppholdtSegINorgeSammenhengendeTolvMnd,
                    svar: hentSvarForSpørsmålBarn(
                        barn,
                        skjema.felter.hvemTolvMndSammenhengendeINorge
                    ),
                },
                oppholderSegIUtland: {
                    ...barn.oppholderSegIUtland,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemOppholderSegIUtland),
                },
                barnetrygdFraAnnetEøsland: {
                    ...barn.barnetrygdFraAnnetEøsland,
                    svar: hentSvarForSpørsmålBarn(
                        barn,
                        skjema.felter.hvemBarnetrygdFraAnnetEøsland
                    ),
                },
            };
        });
    };

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
            barnInkludertISøknaden: genererOppdaterteBarn(),
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

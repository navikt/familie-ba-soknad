import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { Dokumentasjonsbehov } from '../../../typer/dokumentasjon';
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
            hovedSpørsmål: erNoenAvBarnaFosterbarn,
            tilhørendeFelter: [hvemErFosterbarn],
        },
        oppholderBarnSegIInstitusjon: {
            hovedSpørsmål: oppholderBarnSegIInstitusjon,
            tilhørendeFelter: [hvemOppholderSegIInstitusjon],
        },
    });

    const hvemErAdoptertFraUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.erAdoptertFraUtland,
        erBarnAdoptertFraUtland
    );

    const oppholderBarnSegIUtland = useJaNeiSpmFelt(søknad.oppholderBarnSegIUtland, {
        erNoenAvBarnaFosterbarn: {
            hovedSpørsmål: erNoenAvBarnaFosterbarn,
            tilhørendeFelter: [hvemErFosterbarn],
        },
        oppholderBarnSegIInstitusjon: {
            hovedSpørsmål: oppholderBarnSegIInstitusjon,
            tilhørendeFelter: [hvemOppholderSegIInstitusjon],
        },
    });

    const hvemOppholderSegIUtland = useBarnCheckboxFelt(
        barnDataKeySpørsmål.oppholderSegIUtland,
        oppholderBarnSegIUtland
    );

    const søktAsylForBarn = useJaNeiSpmFelt(søknad.søktAsylForBarn, {
        erBarnAdoptertFraUtland: {
            hovedSpørsmål: erBarnAdoptertFraUtland,
            tilhørendeFelter: [hvemErAdoptertFraUtland],
        },
        oppholderBarnSegIUtland: {
            hovedSpørsmål: oppholderBarnSegIUtland,
            tilhørendeFelter: [hvemOppholderSegIUtland],
        },
    });

    const hvemErSøktAsylFor = useBarnCheckboxFelt(barnDataKeySpørsmål.erAsylsøker, søktAsylForBarn);

    const barnOppholdtSegTolvMndSammenhengendeINorge = useJaNeiSpmFelt(
        søknad.barnOppholdtSegTolvMndSammenhengendeINorge,
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
        barnOppholdtSegTolvMndSammenhengendeINorge,
        ESvar.NEI
    );

    const mottarBarnetrygdForBarnFraAnnetEøsland = useJaNeiSpmFelt(
        søknad.mottarBarnetrygdForBarnFraAnnetEøsland,
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
        mottarBarnetrygdForBarnFraAnnetEøsland
    );

    const mapFraIdentTilBarnId = (identer: string[]): string[] => {
        const mapTilBarnMedISøknad = søknad.barnInkludertISøknaden.filter(barn =>
            identer.includes(barn.ident)
        );

        return mapTilBarnMedISøknad.map(barn => barn.id);
    };

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
                            gjelderForBarnId: mapFraIdentTilBarnId(hvemErSøktAsylFor.verdi),
                        };
                    case Dokumentasjonsbehov.ADOPSJON_DATO:
                        return {
                            ...dok,
                            gjelderForBarnId: mapFraIdentTilBarnId(hvemErAdoptertFraUtland.verdi),
                        };
                    case Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN:
                        return {
                            ...dok,
                            gjelderForBarnId: mapFraIdentTilBarnId(hvemErFosterbarn.verdi),
                        };
                    default:
                        return dok;
                }
            }),
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

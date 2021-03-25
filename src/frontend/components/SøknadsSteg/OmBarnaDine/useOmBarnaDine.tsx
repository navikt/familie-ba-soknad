import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarn } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { BarnasIdenter } from './HvilkeBarnCheckboxGruppe';
import { OmBarnaDineSpørsmålId } from './spørsmål';

export interface IOmBarnaDineFeltTyper {
    erNoenAvBarnaFosterbarn: ESvar | undefined;
    oppholderBarnSegIInstitusjon: ESvar | undefined;
    erBarnAdoptertFraUtland: ESvar | undefined;
    oppholderBarnSegIUtland: ESvar | undefined;
    søktAsylForBarn: ESvar | undefined;
    barnOppholdtSegTolvMndSammenhengendeINorge: ESvar | undefined;
    mottarBarnetrygdForBarnFraAnnetEøsland: ESvar | undefined;
    hvemErFosterbarn: string[];
}

export const useOmBarnaDine = (): {
    skjema: ISkjema<IOmBarnaDineFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
} => {
    const { søknad, settSøknad } = useApp();

    const erNoenAvBarnaFosterbarn = useFelt<ESvar | undefined>({
        feltId: søknad.erNoenAvBarnaFosterbarn.id,
        verdi: søknad.erNoenAvBarnaFosterbarn.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const hvemErFosterbarn = useFelt<BarnasIdenter>({
        feltId: OmBarnaDineSpørsmålId.hvemErFosterbarn, //TOODO: fiks id
        verdi: søknad.barn.filter(barn => barn.erFosterbarn).map(barn => barn.ident),
        valideringsfunksjon: (felt: FeltState<string[]>) => {
            return felt.verdi.length > 0 ? ok(felt) : feil(felt, 'Du må velge barn');
        },
    });

    const oppholderBarnSegIInstitusjon = useFelt<ESvar | undefined>({
        feltId: søknad.oppholderBarnSegIInstitusjon.id,
        verdi: søknad.oppholderBarnSegIInstitusjon.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const erBarnAdoptertFraUtland = useFelt<ESvar | undefined>({
        feltId: søknad.erBarnAdoptertFraUtland.id,
        verdi: søknad.erBarnAdoptertFraUtland.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const oppholderBarnSegIUtland = useFelt<ESvar | undefined>({
        feltId: søknad.oppholderBarnSegIUtland.id,
        verdi: søknad.oppholderBarnSegIUtland.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const søktAsylForBarn = useFelt<ESvar | undefined>({
        feltId: søknad.søktAsylForBarn.id,
        verdi: søknad.søktAsylForBarn.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const barnOppholdtSegTolvMndSammenhengendeINorge = useFelt<ESvar | undefined>({
        feltId: søknad.barnOppholdtSegTolvMndSammenhengendeINorge.id,
        verdi: søknad.barnOppholdtSegTolvMndSammenhengendeINorge.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const mottarBarnetrygdForBarnFraAnnetEøsland = useFelt<ESvar | undefined>({
        feltId: søknad.mottarBarnetrygdForBarnFraAnnetEøsland.id,
        verdi: søknad.mottarBarnetrygdForBarnFraAnnetEøsland.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'personopplysninger.feilmelding.janei'} />);
        },
    });

    const hentSvarForSpørsmålBarn = (barn: IBarn, felt: Felt<string[]>): ESvar =>
        felt.verdi.includes(barn.ident) ? ESvar.JA : ESvar.NEI;

    const hentOppdaterteBarn = (): IBarn[] => {
        //TODO: OPPDATER MED RIKTIG FELT NÅR DE ER LAGT TIL I SKJEMA
        return søknad.barn.map(barn => {
            return {
                ...barn,
                erFosterbarn: {
                    ...barn.erFosterbarn,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn),
                },
                erAsylsøker: {
                    ...barn.erAsylsøker,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn),
                },
                erAdoptertFraUtland: {
                    ...barn.erAdoptertFraUtland,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn),
                },
                oppholderSegIInstitusjon: {
                    ...barn.oppholderSegIInstitusjon,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn),
                },
                oppholdtSegINorgeSammenhengendeTolvMnd: {
                    ...barn.oppholdtSegINorgeSammenhengendeTolvMnd,
                    svar: hentSvarForSpørsmålBarn(barn, skjema.felter.hvemErFosterbarn),
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
            barn: hentOppdaterteBarn(),
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

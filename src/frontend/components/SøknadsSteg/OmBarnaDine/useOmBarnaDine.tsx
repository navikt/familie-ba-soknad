import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

export interface IOmBarnaDineFeltTyper {
    erNoenAvBarnaFosterbarn: ESvar | undefined;
    oppholderBarnSegIInstitusjon: ESvar | undefined;
    erBarnAdoptertFraUtland: ESvar | undefined;
    oppholderBarnSegIUtland: ESvar | undefined;
    søktAsylForBarn: ESvar | undefined;
    barnOppholdtSegTolvMndSammenhengendeINorge: ESvar | undefined;
    mottarBarnetrygdForBarnFraAnnetEøsland: ESvar | undefined;
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

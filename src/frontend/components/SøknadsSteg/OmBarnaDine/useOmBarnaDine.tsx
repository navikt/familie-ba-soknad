import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

export interface IOmBarnaDineFeltTyper {
    erNoenAvBarnaFosterbarn: ESvar | undefined;
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

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            erNoenAvBarnaFosterbarn: {
                ...søknad.erNoenAvBarnaFosterbarn,
                svar: skjema.felter.erNoenAvBarnaFosterbarn.verdi,
            },
        });
    };

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IOmBarnaDineFeltTyper, string>({
        felter: {
            erNoenAvBarnaFosterbarn,
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

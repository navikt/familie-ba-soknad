import React from 'react';

import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import { useFeatureToggles } from '../../../../context/FeatureToggleContext';
import { IArbeidsperiode } from '../../../../typer/perioder';
import { IEøsForSøkerFeltTyper } from '../../../../typer/skjema';
import { arbeidsperiodeFeilmelding } from '../../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { useArbeidsperioder } from '../../../Felleskomponenter/Arbeidsperiode/useArbeidsperioder';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

export const useEøsForSøker = (): {
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
} => {
    const placeholderForFeltSomKommer = useFelt<string>({
        feltId: 'todo',
        verdi: '',
        valideringsfunksjon: (felt: FeltState<string>) => {
            return ok(felt);
        },
    });

    const oppdaterSøknad = () => {
        //TODO
    };

    const { søknad } = useApp();
    const søker = søknad.søker;
    const { toggles } = useFeatureToggles();

    const { fjernArbeidsperiode, leggTilArbeidsperiode, registrerteArbeidsperioder } =
        useArbeidsperioder(
            søker.arbeidsperioderUtland,
            {},
            avhengigheter => toggles.EØS_KOMPLETT,
            felt =>
                felt.verdi.length === 0
                    ? feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(false)} />)
                    : ok(felt)
        );

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IEøsForSøkerFeltTyper, string>({
        felter: { placeholderForFeltSomKommer, registrerteArbeidsperioder },
        skjemanavn: 'eøsForSøker',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        oppdaterSøknad,
        fjernArbeidsperiode,
        leggTilArbeidsperiode,
    };
};

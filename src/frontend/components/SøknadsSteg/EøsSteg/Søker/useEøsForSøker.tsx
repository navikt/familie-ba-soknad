import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import { useFeatureToggles } from '../../../../context/FeatureToggleContext';
import useJaNeiSpmFelt from '../../../../hooks/useJaNeiSpmFelt';
import { usePerioder } from '../../../../hooks/usePerioder';
import { IArbeidsperiode } from '../../../../typer/perioder';
import { ISøker } from '../../../../typer/person';
import { IEøsForSøkerFeltTyper } from '../../../../typer/skjema';
import { arbeidsperiodeFeilmelding } from '../../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

export const useEøsForSøker = (): {
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
} => {
    const { søknad, settSøknad } = useApp();
    const søker = søknad.søker;
    const { toggles } = useFeatureToggles();

    const arbeiderINorge = useJaNeiSpmFelt({
        søknadsfelt: søker.arbeiderINorge,
        feilmeldingSpråkId: 'eøs-om-deg.arbeidsperioderinorge.feilmelding',
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: registrerteArbeidsperioder,
    } = usePerioder<IArbeidsperiode>(
        søker.arbeidsperioderNorge,
        { arbeiderINorge },
        avhengigheter => avhengigheter.arbeiderINorge.verdi === ESvar.JA && toggles.EØS_KOMPLETT,
        felt =>
            arbeiderINorge.verdi === ESvar.JA && felt.verdi.length === 0
                ? feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(false)} />)
                : ok(felt)
    );

    const oppdaterSøknad = () => {
        const oppdatertSøker = genererOppdatertSøker();
        settSøknad({
            ...søknad,
            søker: oppdatertSøker,
        });
    };
    const genererOppdatertSøker = (): ISøker => ({
        ...søknad.søker,
        arbeiderINorge: {
            ...søknad.søker.arbeiderINorge,
            svar: skjema.felter.arbeiderINorge.verdi,
        },

        arbeidsperioderNorge:
            skjema.felter.arbeiderINorge.verdi === ESvar.JA
                ? skjema.felter.registrerteArbeidsperioder.verdi
                : [],
    });

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IEøsForSøkerFeltTyper, string>({
        felter: { arbeiderINorge, registrerteArbeidsperioder },
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

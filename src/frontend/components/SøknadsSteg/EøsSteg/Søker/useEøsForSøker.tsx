import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, ISkjema, ok, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import useJaNeiSpmFelt from '../../../../hooks/useJaNeiSpmFelt';
import { usePerioder } from '../../../../hooks/usePerioder';
import { IArbeidsperiode, IPensjonsperiode } from '../../../../typer/perioder';
import { ISøker } from '../../../../typer/person';
import { IEøsForSøkerFeltTyper } from '../../../../typer/skjema';
import { arbeidsperiodeFeilmelding } from '../../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { pensjonsperiodeFeilmelding } from '../../../Felleskomponenter/Pensjonsmodal/språkUtils';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

export const useEøsForSøker = (): {
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    validerAlleSynligeFelter: () => void;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
} => {
    const { søknad, settSøknad } = useApp();
    const søker = søknad.søker;

    const arbeidINorge = useJaNeiSpmFelt({
        søknadsfelt: søker.arbeidINorge,
        feilmeldingSpråkId: 'eøs-om-deg.arbeidsperioderinorge.feilmelding',
    });

    const {
        fjernPeriode: fjernArbeidsperiode,
        leggTilPeriode: leggTilArbeidsperiode,
        registrertePerioder: registrerteArbeidsperioder,
    } = usePerioder<IArbeidsperiode>(
        søker.arbeidsperioderNorge,
        { arbeidINorge },
        avhengigheter => avhengigheter.arbeidINorge.verdi === ESvar.JA,
        felt =>
            arbeidINorge.verdi === ESvar.JA && felt.verdi.length === 0
                ? feil(felt, <SpråkTekst id={arbeidsperiodeFeilmelding(false)} />)
                : ok(felt)
    );

    const pensjonNorge = useJaNeiSpmFelt({
        søknadsfelt: søker.pensjonNorge,
        feilmeldingSpråkId: 'eøs-om-deg.pensjoninorge.feilmelding',
    });
    const {
        fjernPeriode: fjernPensjonsperiode,
        leggTilPeriode: leggTilPensjonsperiode,
        registrertePerioder: registrertePensjonsperioder,
    } = usePerioder<IPensjonsperiode>(
        søker.pensjonsperioderNorge,
        { pensjonNorge },
        avhengigheter => avhengigheter.pensjonNorge.verdi === ESvar.JA,
        felt =>
            pensjonNorge.verdi === ESvar.JA && felt.verdi.length === 0
                ? feil(felt, <SpråkTekst id={pensjonsperiodeFeilmelding(false)} />)
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
        arbeidINorge: {
            ...søknad.søker.arbeidINorge,
            svar: skjema.felter.arbeidINorge.verdi,
        },

        arbeidsperioderNorge:
            skjema.felter.arbeidINorge.verdi === ESvar.JA
                ? skjema.felter.registrerteArbeidsperioder.verdi
                : [],

        pensjonNorge: {
            ...søknad.søker.pensjonNorge,
            svar: skjema.felter.pensjonNorge.verdi,
        },
        pensjonsperioderNorge:
            skjema.felter.pensjonNorge.verdi === ESvar.JA
                ? skjema.felter.registrertePensjonsperioder.verdi
                : [],
    });

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IEøsForSøkerFeltTyper,
        string
    >({
        felter: {
            arbeidINorge,
            registrerteArbeidsperioder,
            pensjonNorge,
            registrertePensjonsperioder,
        },
        skjemanavn: 'eøsForSøker',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        validerAlleSynligeFelter,
        oppdaterSøknad,
        fjernArbeidsperiode,
        leggTilArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
    };
};

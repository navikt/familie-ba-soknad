import React from 'react';

import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { useEøsForSøker } from './useEøsForSøker';

const EøsForSøker: React.FC = () => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
    } = useEøsForSøker();

    return (
        <Steg
            tittel={<SpråkTekst id="eøs-om-deg.sidetittel" />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <Arbeidsperiode
                skjema={skjema}
                arbeiderEllerArbeidetFelt={skjema.felter.arbeidINorge}
                leggTilArbeidsperiode={leggTilArbeidsperiode}
                fjernArbeidsperiode={fjernArbeidsperiode}
                registrerteArbeidsperioder={skjema.felter.registrerteArbeidsperioder}
            />
        </Steg>
    );
};

export default EøsForSøker;

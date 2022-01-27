import React from 'react';

import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import SkjemaFieldset from '../../../Felleskomponenter/SkjemaFieldset';
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
            tittel={'Steg for eøs søker'}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <SkjemaFieldset tittelId={'eøs-om-deg.sidetittel'}>
                <Arbeidsperiode
                    skjema={skjema}
                    arbeiderEllerArbeidetFelt={skjema.felter.arbeiderINorge}
                    leggTilArbeidsperiode={leggTilArbeidsperiode}
                    fjernArbeidsperiode={fjernArbeidsperiode}
                    registrerteArbeidsperioder={skjema.felter.registrerteArbeidsperioder}
                />
            </SkjemaFieldset>
        </Steg>
    );
};

export default EøsForSøker;

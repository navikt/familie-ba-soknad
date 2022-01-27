import React from 'react';

import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
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
            <div>
                {/*
                <Arbeidsperiode skjema={skjema} leggTilArbeidsperiode={leggTilArbeidsperiode} fjernArbeidsperiode={fjernArbeidsperiode} arbeiderEllerArbeidetFelt={skjema.felter.placeholderForFeltSomKommer} registrerteArbeidsperioder={skjema.felter.registrerteArbeidsperioder}
                */}
            </div>
        </Steg>
    );
};

export default EøsForSøker;

import React from 'react';

import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';
import { IdNummer } from '../IdNummer';
import { useEøsForSøker } from './useEøsForSøker';

const EøsForSøker: React.FC = () => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        leggTilAndreUtbetalingsperiode,
        fjernAndreUtbetalingsperiode,
        settIdNummerFelter,
    } = useEøsForSøker();

    const testListeMedLand = ['NOR', 'NED', 'ENG']; //TODO: bytt ut med ekte land

    return (
        <Steg
            tittel={<SpråkTekst id={'eøs-om-deg.sidetittel'} />}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            {testListeMedLand.map((land, index) => {
                return (
                    <IdNummer
                        skjema={skjema}
                        key={index}
                        settIdNummerFelter={settIdNummerFelter}
                        land={land}
                    />
                );
            })}

            <KomponentGruppe>
                <Arbeidsperiode
                    skjema={skjema}
                    arbeiderEllerArbeidetFelt={skjema.felter.arbeidINorge}
                    leggTilArbeidsperiode={leggTilArbeidsperiode}
                    fjernArbeidsperiode={fjernArbeidsperiode}
                    registrerteArbeidsperioder={skjema.felter.registrerteArbeidsperioder}
                />
                <Pensjonsperiode
                    skjema={skjema}
                    mottarEllerMottattPensjonFelt={skjema.felter.pensjonNorge}
                    leggTilPensjonsperiode={leggTilPensjonsperiode}
                    fjernPensjonsperiode={fjernPensjonsperiode}
                    registrertePensjonsperioder={skjema.felter.registrertePensjonsperioder}
                />
                <Utbetalingsperiode
                    skjema={skjema}
                    leggTilUtbetalingsperiode={leggTilAndreUtbetalingsperiode}
                    fjernUtbetalingsperiode={fjernAndreUtbetalingsperiode}
                    mottarEllerMottattUtbetalingFelt={skjema.felter.andreUtbetalinger}
                    registrerteUtbetalingsperioder={skjema.felter.registrerteAndreUtbetalinger}
                />
            </KomponentGruppe>
        </Steg>
    );
};

export default EøsForSøker;

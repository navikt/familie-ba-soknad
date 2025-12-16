import React from 'react';

import { ESanitySteg } from '../../../../../common/sanity';
import { useAppContext } from '../../../../context/AppContext';
import { PersonType } from '../../../../typer/personType';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import TekstBlock from '../../../Felleskomponenter/Sanity/TekstBlock';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';

import IdNummerForSøker from './IdNummerForSøker';
import { useEøsForSøker } from './useEøsForSøker';

const EøsForSøker: React.FC = () => {
    const { tekster } = useAppContext();

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

    const stegTekster = tekster()[ESanitySteg.EØS_FOR_SØKER];
    const { eosForSokerGuide } = stegTekster;

    return (
        <Steg
            tittel={<TekstBlock block={stegTekster.eoesForSoekerTittel} />}
            guide={eosForSokerGuide}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <IdNummerForSøker skjema={skjema} settIdNummerFelter={settIdNummerFelter} />
            {skjema.felter.adresseISøkeperiode.erSynlig && (
                <SkjemaFeltInput
                    felt={skjema.felter.adresseISøkeperiode}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={<TekstBlock block={stegTekster.hvorBor.sporsmal} />}
                    description={<TekstBlock block={stegTekster.hvorBor.beskrivelse} />}
                />
            )}
            <Arbeidsperiode
                skjema={skjema}
                arbeiderEllerArbeidetFelt={skjema.felter.arbeidINorge}
                leggTilArbeidsperiode={leggTilArbeidsperiode}
                fjernArbeidsperiode={fjernArbeidsperiode}
                registrerteArbeidsperioder={skjema.felter.registrerteArbeidsperioder}
                personType={PersonType.Søker}
            />
            <Pensjonsperiode
                skjema={skjema}
                mottarEllerMottattPensjonFelt={skjema.felter.pensjonNorge}
                gjelderUtlandet={false}
                leggTilPensjonsperiode={leggTilPensjonsperiode}
                fjernPensjonsperiode={fjernPensjonsperiode}
                registrertePensjonsperioder={skjema.felter.registrertePensjonsperioder}
                personType={PersonType.Søker}
            />
            <Utbetalingsperiode
                skjema={skjema}
                leggTilUtbetalingsperiode={leggTilAndreUtbetalingsperiode}
                fjernUtbetalingsperiode={fjernAndreUtbetalingsperiode}
                tilhørendeJaNeiSpmFelt={skjema.felter.andreUtbetalinger}
                registrerteUtbetalingsperioder={skjema.felter.registrerteAndreUtbetalinger}
                personType={PersonType.Søker}
            />
        </Steg>
    );
};

export default EøsForSøker;

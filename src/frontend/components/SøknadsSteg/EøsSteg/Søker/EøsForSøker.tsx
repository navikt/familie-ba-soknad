import { ESanitySteg } from '@common/sanity';
import { Arbeidsperiode } from '@components/Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import { Pensjonsperiode } from '@components/Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import TekstBlock from '@components/Felleskomponenter/Sanity/TekstBlock';
import { SkjemaFeltInput } from '@components/Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import Steg from '@components/Felleskomponenter/Steg/Steg';
import { Utbetalingsperiode } from '@components/Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';
import { useAppContext } from '@context/AppContext';
import { PersonType } from '@typer/personType';
import type { FC } from 'react';

import IdNummerForSøker from './IdNummerForSøker';
import { useEøsForSøker } from './useEøsForSøker';

const EøsForSøker: FC = () => {
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

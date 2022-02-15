import React from 'react';

import { useApp } from '../../../../context/AppContext';
import { useEøs } from '../../../../context/EøsContext';
import { Arbeidsperiode } from '../../../Felleskomponenter/Arbeidsperiode/Arbeidsperiode';
import KomponentGruppe from '../../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { Pensjonsperiode } from '../../../Felleskomponenter/Pensjonsmodal/Pensjonsperiode';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { Utbetalingsperiode } from '../../../Felleskomponenter/UtbetalingerModal/Utbetalingsperiode';
import { IdNummer } from '../IdNummer';
import { idNummerLandMedPeriodeType } from '../idnummerUtils';
import { EøsSøkerSpørsmålId, eøsSøkerSpørsmålSpråkId } from './spørsmål';
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

    const { erEøsLand } = useEøs();
    const { søknad } = useApp();
    const { søker } = søknad;

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
            <KomponentGruppe>
                {idNummerLandMedPeriodeType(
                    søker.arbeidsperioderUtland,
                    søker.pensjonsperioderUtland,
                    søker.utenlandsperioder,
                    erEøsLand
                ).map((landMedPeriodeType, index) => {
                    return (
                        !!landMedPeriodeType.land && (
                            <IdNummer
                                skjema={skjema}
                                key={index}
                                settIdNummerFelter={settIdNummerFelter}
                                landAlphaCode={landMedPeriodeType.land}
                                periodeType={landMedPeriodeType.periodeType}
                            />
                        )
                    );
                })}
                <SkjemaFeltInput
                    felt={skjema.felter.adresseISøkeperiode}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={
                        eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.adresseISøkeperiode]
                    }
                    description={<SpråkTekst id={'felles.hjelpetekst.fulladresse'} />}
                />
            </KomponentGruppe>

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

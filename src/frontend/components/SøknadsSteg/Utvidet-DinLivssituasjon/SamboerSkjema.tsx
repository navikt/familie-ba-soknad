import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import { SamboerSpørsmålId, samboerSpørsmålSpråkId } from './spørsmål';
import { IDinLivssituasjonFeltTyper } from './useDinLivssituasjon';

const SamboerSkjema: React.FC<{
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
}> = ({ skjema }) => {
    return (
        <KomponentGruppe dynamisk>
            <SkjemaFeltInput
                felt={skjema.felter.nåværendeSamboerNavn}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={samboerSpørsmålSpråkId[SamboerSpørsmålId.nåværendeSamboerNavn]}
            />
            <SkjemaFeltInput
                felt={skjema.felter.nåværendeSamboerFnr}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={samboerSpørsmålSpråkId[SamboerSpørsmålId.nåværendeSamboerFnr]}
                disabled={skjema.felter.nåværendeSamboerFnrUkjent.verdi === ESvar.JA}
                bredde={'XL'}
            />
            <SkjemaCheckbox
                labelSpråkTekstId={
                    samboerSpørsmålSpråkId[SamboerSpørsmålId.nåværendeSamboerFnrUkjent]
                }
                felt={skjema.felter.nåværendeSamboerFnrUkjent}
            />
            <Datovelger
                skjema={skjema}
                felt={skjema.felter.nåværendeSamboerFødselsdato}
                labelTekstId={samboerSpørsmålSpråkId[SamboerSpørsmålId.nåværendeSamboerFødselsdato]}
                disabled={skjema.felter.nåværendeSamboerFødselsdatoUkjent.verdi === ESvar.JA}
            />
            <SkjemaCheckbox
                labelSpråkTekstId={
                    samboerSpørsmålSpråkId[SamboerSpørsmålId.nåværendeSamboerFødselsdatoUkjent]
                }
                felt={skjema.felter.nåværendeSamboerFødselsdatoUkjent}
            />
            <Datovelger
                skjema={skjema}
                felt={skjema.felter.nåværendeSamboerFraDato}
                labelTekstId={samboerSpørsmålSpråkId[SamboerSpørsmålId.nåværendeSamboerFraDato]}
            />
        </KomponentGruppe>
    );
};

export default SamboerSkjema;

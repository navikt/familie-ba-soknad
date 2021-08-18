import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import { SamboerSpørsmålId, samboerSpørsmålSpråkId } from './spørsmål';
import { IDinLivssituasjonFeltTyper } from './useDinLivssituasjon';

const NåværendeSamboerSkjema: React.FC<{
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
}> = ({ skjema }) => {
    return skjema.felter.harSamboerNå.verdi === ESvar.JA ? (
        <KomponentGruppe>
            <SkjemaFeltInput
                felt={skjema.felter.nåværendeSamboerNavn}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={samboerSpørsmålSpråkId[SamboerSpørsmålId.navn]}
            />
            <SkjemaFeltInput
                felt={skjema.felter.nåværendeSamboerFnr}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={samboerSpørsmålSpråkId[SamboerSpørsmålId.fnr]}
                disabled={skjema.felter.nåværendeSamboerFnrUkjent.verdi === ESvar.JA}
                bredde={'XL'}
            />
            <SkjemaCheckbox
                labelSpråkTekstId={samboerSpørsmålSpråkId[SamboerSpørsmålId.fnrUkjent]}
                felt={skjema.felter.nåværendeSamboerFnrUkjent}
            />
            <Datovelger
                skjema={skjema}
                felt={skjema.felter.nåværendeSamboerFødselsdato}
                labelTekstId={samboerSpørsmålSpråkId[SamboerSpørsmålId.fødselsdato]}
                disabled={skjema.felter.nåværendeSamboerFødselsdatoUkjent.verdi === ESvar.JA}
            />
            <SkjemaCheckbox
                labelSpråkTekstId={samboerSpørsmålSpråkId[SamboerSpørsmålId.fødselsdatoUkjent]}
                felt={skjema.felter.nåværendeSamboerFødselsdatoUkjent}
            />
            <Datovelger
                skjema={skjema}
                felt={skjema.felter.nåværendeSamboerFraDato}
                labelTekstId={samboerSpørsmålSpråkId[SamboerSpørsmålId.samboerFraDato]}
            />
        </KomponentGruppe>
    ) : null;
};

export default NåværendeSamboerSkjema;

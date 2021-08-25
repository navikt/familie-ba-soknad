import React from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { DatoMedUkjent } from '../../../typer/person';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import { samboerSpråkIder } from './spørsmål';
import { IDinLivssituasjonFeltTyper } from './useDinLivssituasjon';

const SamboerSkjema: React.FC<{
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    samboerFelter: {
        navn: Felt<string>;
        fnr: Felt<string>;
        fnrUkjent: Felt<ESvar>;
        fødselsdato: Felt<DatoMedUkjent>;
        fødselsdatoUkjent: Felt<ESvar>;
        samboerFraDato: Felt<ISODateString>;
        samboerTilDato?: Felt<ISODateString>;
    };
}> = ({ skjema, samboerFelter }) => {
    return (
        <KomponentGruppe inline>
            <SkjemaFeltInput
                felt={samboerFelter.navn}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={samboerSpråkIder.navn}
            />
            <SkjemaFeltInput
                felt={samboerFelter.fnr}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={samboerSpråkIder.fnr}
                disabled={samboerFelter.fnrUkjent.verdi === ESvar.JA}
                bredde={'XL'}
            />
            <SkjemaCheckbox
                labelSpråkTekstId={samboerSpråkIder.fnrUkjent}
                felt={samboerFelter.fnrUkjent}
            />
            <Datovelger
                skjema={skjema}
                felt={samboerFelter.fødselsdato}
                labelTekstId={samboerSpråkIder.fødselsdato}
                disabled={samboerFelter.fødselsdatoUkjent.verdi === ESvar.JA}
            />
            <SkjemaCheckbox
                labelSpråkTekstId={samboerSpråkIder.fødselsdatoUkjent}
                felt={samboerFelter.fødselsdatoUkjent}
            />
            <Datovelger
                skjema={skjema}
                felt={samboerFelter.samboerFraDato}
                labelTekstId={samboerSpråkIder.samboerFraDato}
            />
        </KomponentGruppe>
    );
};

export default SamboerSkjema;

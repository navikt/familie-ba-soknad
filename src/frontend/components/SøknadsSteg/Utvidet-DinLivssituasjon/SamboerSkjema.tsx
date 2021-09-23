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
import { ITidligereSamboerFeltTyper } from './useTidligereSamboer';

const SamboerSkjema: React.FC<{
    skjema: ISkjema<IDinLivssituasjonFeltTyper | ITidligereSamboerFeltTyper, string>;
    samboerFelter: {
        navn: Felt<string>;
        fnr: Felt<string>;
        fnrUkjent: Felt<ESvar>;
        fødselsdato: Felt<DatoMedUkjent>;
        fødselsdatoUkjent: Felt<ESvar>;
        samboerFraDato: Felt<ISODateString>;
        samboerTilDato?: Felt<ISODateString>;
    };
    erIModal?: boolean;
}> = ({ skjema, samboerFelter, erIModal = false }) => {
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
            {samboerFelter.fødselsdato.erSynlig && (
                <KomponentGruppe inline dynamisk>
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
                </KomponentGruppe>
            )}
            <Datovelger
                skjema={skjema}
                felt={samboerFelter.samboerFraDato}
                labelTekstId={samboerSpråkIder.samboerFraDato}
                avgrensDatoFremITid={
                    /* Tidligere samboereforhold kan ikke starte i fremtiden, nåværende kan */
                    !!samboerFelter.samboerTilDato
                }
                calendarPosition={erIModal ? 'fullscreen' : ''}
            />
            {samboerFelter.samboerTilDato && (
                <Datovelger
                    skjema={skjema}
                    felt={samboerFelter.samboerTilDato}
                    labelTekstId={samboerSpråkIder.samboerTilDato}
                    fraOgMedFelt={samboerFelter.samboerFraDato}
                    avgrensDatoFremITid={true}
                    calendarPosition={erIModal ? 'fullscreen' : ''}
                />
            )}
        </KomponentGruppe>
    );
};

export default SamboerSkjema;

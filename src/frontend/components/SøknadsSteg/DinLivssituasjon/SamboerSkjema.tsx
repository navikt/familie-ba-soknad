import React from 'react';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { DatoMedUkjent } from '../../../typer/common';
import { IDinLivssituasjonFeltTyper, ITidligereSamboerFeltTyper } from '../../../typer/skjema';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { samboerSpråkIder } from './spørsmål';

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
                        label={<SpråkTekst id={samboerSpråkIder.fødselsdato} />}
                        avgrensMaxDato={dagensDato()}
                        disabled={samboerFelter.fødselsdatoUkjent.verdi === ESvar.JA}
                        calendarPosition={erIModal ? 'fullscreen' : ''}
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
                label={<SpråkTekst id={samboerSpråkIder.samboerFraDato} />}
                avgrensMaxDato={samboerFelter.samboerTilDato ? gårsdagensDato() : dagensDato()}
                calendarPosition={erIModal ? 'fullscreen' : ''}
            />
            {samboerFelter.samboerTilDato && (
                <Datovelger
                    skjema={skjema}
                    felt={samboerFelter.samboerTilDato}
                    label={<SpråkTekst id={samboerSpråkIder.samboerTilDato} />}
                    tilhørendeFraOgMedFelt={samboerFelter.samboerFraDato}
                    avgrensDatoFremITid={true}
                    calendarPosition={erIModal ? 'fullscreen' : ''}
                />
            )}
        </KomponentGruppe>
    );
};

export default SamboerSkjema;

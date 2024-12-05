import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { DatoMedUkjent, ISODateString } from '../../../typer/common';
import { IDinLivssituasjonFeltTyper, ITidligereSamboerFeltTyper } from '../../../typer/skjema';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import Datovelger from '../../Felleskomponenter/Datovelger/Datovelger';
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
        <>
            <SkjemaFeltInput
                felt={samboerFelter.navn}
                visFeilmeldinger={skjema.visFeilmeldinger}
                labelSpråkTekstId={samboerSpråkIder.navn}
            />
            <div>
                <SkjemaFeltInput
                    felt={samboerFelter.fnr}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    labelSpråkTekstId={samboerSpråkIder.fnr}
                    disabled={samboerFelter.fnrUkjent.verdi === ESvar.JA}
                />
                <SkjemaCheckbox
                    labelSpråkTekstId={samboerSpråkIder.fnrUkjent}
                    felt={samboerFelter.fnrUkjent}
                />
            </div>
            {samboerFelter.fødselsdato.erSynlig && (
                <div>
                    <Datovelger
                        skjema={skjema}
                        felt={samboerFelter.fødselsdato}
                        label={<SpråkTekst id={samboerSpråkIder.fødselsdato} />}
                        avgrensMaxDato={dagensDato()}
                        disabled={samboerFelter.fødselsdatoUkjent.verdi === ESvar.JA}
                        strategy={erIModal ? 'absolute' : 'fixed'}
                    />
                    <SkjemaCheckbox
                        labelSpråkTekstId={samboerSpråkIder.fødselsdatoUkjent}
                        felt={samboerFelter.fødselsdatoUkjent}
                    />
                </div>
            )}
            <Datovelger
                skjema={skjema}
                felt={samboerFelter.samboerFraDato}
                label={<SpråkTekst id={samboerSpråkIder.samboerFraDato} />}
                avgrensMaxDato={samboerFelter.samboerTilDato ? gårsdagensDato() : dagensDato()}
                strategy={erIModal ? 'absolute' : 'fixed'}
            />
            {samboerFelter.samboerTilDato && (
                <Datovelger
                    skjema={skjema}
                    felt={samboerFelter.samboerTilDato}
                    label={<SpråkTekst id={samboerSpråkIder.samboerTilDato} />}
                    tilhørendeFraOgMedFelt={samboerFelter.samboerFraDato}
                    avgrensDatoFremITid={true}
                    strategy={erIModal ? 'absolute' : 'fixed'}
                />
            )}
        </>
    );
};

export default SamboerSkjema;

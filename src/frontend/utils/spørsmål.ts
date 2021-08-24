import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import {
    OmBarnaDineSpørsmålId,
    omBarnaDineSpørsmålSpråkId,
} from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import {
    OmBarnetSpørsmålsId,
    omBarnetSpørsmålSpråkId,
} from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { OmDegSpørsmålId, omDegSpørsmålSpråkId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
    SamboerSpørsmålId,
    samboerSpørsmålSpråkId,
} from '../components/SøknadsSteg/Utvidet-DinLivssituasjon/spørsmål';
import {
    VelgBarnSpørsmålId,
    velgBarnSpørsmålSpråkId,
} from '../components/SøknadsSteg/VelgBarn/spørsmål';
import { AlternativtSvarForInput } from '../typer/person';
import { SpørsmålId } from '../typer/søknad';

export const samletSpørsmålId: { [key: string]: SpørsmålId } = {
    ...OmDegSpørsmålId,
    ...VelgBarnSpørsmålId,
    ...OmBarnaDineSpørsmålId,
    ...OmBarnetSpørsmålsId,
    ...DinLivssituasjonSpørsmålId,
    ...SamboerSpørsmålId,
};

export const samletSpørsmålSpråkTekstId: Record<SpørsmålId, string> = {
    ...omDegSpørsmålSpråkId,
    ...velgBarnSpørsmålSpråkId,
    ...omBarnaDineSpørsmålSpråkId,
    ...omBarnetSpørsmålSpråkId,
    ...dinLivssituasjonSpørsmålSpråkId,
    ...samboerSpørsmålSpråkId,
};

export const språkIndexListe = [
    omDegSpørsmålSpråkId,
    velgBarnSpørsmålSpråkId,
    omBarnaDineSpørsmålSpråkId,
    omBarnetSpørsmålSpråkId,
    dinLivssituasjonSpørsmålSpråkId,
    samboerSpørsmålSpråkId,
];
export const svarForSpørsmålMedUkjent = (
    vetIkkeFelt: Felt<ESvar>,
    spørsmålFelt: Felt<string>
): string => {
    if (!spørsmålFelt.erSynlig) {
        return '';
    } else {
        return vetIkkeFelt.verdi === ESvar.JA ? AlternativtSvarForInput.UKJENT : spørsmålFelt.verdi;
    }
};

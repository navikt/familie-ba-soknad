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

export const samletSpørsmålId = {
    ...OmDegSpørsmålId,
    ...VelgBarnSpørsmålId,
    ...OmBarnaDineSpørsmålId,
    ...OmBarnetSpørsmålsId,
    ...DinLivssituasjonSpørsmålId,
    ...SamboerSpørsmålId,
};

export const samletSpørsmålSpråkTekstId = {
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

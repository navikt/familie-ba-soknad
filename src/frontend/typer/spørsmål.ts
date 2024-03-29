import { ArbeidsperiodeSpørsmålsId } from '../components/Felleskomponenter/Arbeidsperiode/spørsmål';
import { BarnetrygdperiodeSpørsmålId } from '../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import { PensjonsperiodeSpørsmålId } from '../components/Felleskomponenter/Pensjonsmodal/spørsmål';
import { UtbetalingerSpørsmålId } from '../components/Felleskomponenter/UtbetalingerModal/spørsmål';
import { UtenlandsoppholdSpørsmålId } from '../components/Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import {
    DinLivssituasjonSpørsmålId,
    SamboerSpørsmålId,
    TidligereSamboerSpørsmålId,
} from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { EøsBarnSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import { EøsSøkerSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Søker/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { VelgBarnSpørsmålId } from '../components/SøknadsSteg/VelgBarn/spørsmål';

export type SpørsmålId =
    | OmDegSpørsmålId
    | VelgBarnSpørsmålId
    | OmBarnaDineSpørsmålId
    | OmBarnetSpørsmålsId
    | DinLivssituasjonSpørsmålId
    | SamboerSpørsmålId
    | TidligereSamboerSpørsmålId
    | UtenlandsoppholdSpørsmålId
    | ArbeidsperiodeSpørsmålsId
    | UtbetalingerSpørsmålId
    | BarnetrygdperiodeSpørsmålId
    | PensjonsperiodeSpørsmålId
    | EøsSøkerSpørsmålId
    | EøsBarnSpørsmålId;

export interface ISøknadSpørsmål<T> {
    id: SpørsmålId;
    svar: T;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ISøknadSpørsmålMap = Record<string, ISøknadSpørsmål<any>>;

import type { ArbeidsperiodeSpørsmålsId } from '../components/Felleskomponenter/Arbeidsperiode/spørsmål';
import type { BarnetrygdperiodeSpørsmålId } from '../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import type { PensjonsperiodeSpørsmålId } from '../components/Felleskomponenter/Pensjonsmodal/spørsmål';
import type { UtbetalingerSpørsmålId } from '../components/Felleskomponenter/UtbetalingerModal/spørsmål';
import type { UtenlandsoppholdSpørsmålId } from '../components/Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import type {
    DinLivssituasjonSpørsmålId,
    SamboerSpørsmålId,
    TidligereSamboerSpørsmålId,
} from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import type { EøsBarnSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Barn/spørsmål';
import type { EøsSøkerSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Søker/spørsmål';
import type { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import type { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import type { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import type { VelgBarnSpørsmålId } from '../components/SøknadsSteg/VelgBarn/spørsmål';

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

export type ISøknadSpørsmålMap = Record<string, ISøknadSpørsmål<any>>;

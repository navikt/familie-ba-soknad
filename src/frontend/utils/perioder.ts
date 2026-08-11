import type { ArbeidsperiodeSpørsmålsId } from '../components/Felleskomponenter/Arbeidsperiode/spørsmål';
import type { BarnetrygdperiodeSpørsmålId } from '../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import type { PensjonsperiodeSpørsmålId } from '../components/Felleskomponenter/Pensjonsmodal/spørsmål';
import type { UtbetalingerSpørsmålId } from '../components/Felleskomponenter/UtbetalingerModal/spørsmål';
import type { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import type { BarnetsId } from '../typer/person';
import { PersonType } from '../typer/personType';

import {
    dagenEtterDato,
    dagensDato,
    erDatoFormatGodkjent,
    erSammeDatoSomDagensDato,
    morgendagensDato,
    stringTilDate,
} from './dato';

export const minTilDatoForPeriode = (periodenErAvsluttet: boolean, fraDato: string) => {
    const gyldigFraDato = fraDato !== '' && erDatoFormatGodkjent(stringTilDate(fraDato));
    if (periodenErAvsluttet) {
        return gyldigFraDato ? dagenEtterDato(stringTilDate(fraDato)) : undefined;
    } else if (gyldigFraDato && erSammeDatoSomDagensDato(stringTilDate(fraDato))) {
        return morgendagensDato();
    } else {
        return dagensDato();
    }
};

export const genererPeriodeId = ({
    personType,
    spørsmålsId,
    barnetsId,
}: {
    personType: PersonType;
    spørsmålsId:
        | ArbeidsperiodeSpørsmålsId
        | PensjonsperiodeSpørsmålId
        | BarnetrygdperiodeSpørsmålId
        | UtbetalingerSpørsmålId
        | DinLivssituasjonSpørsmålId;
    barnetsId?: BarnetsId;
}) => {
    return personType === PersonType.Søker
        ? `${spørsmålsId}-${personType}`
        : `${spørsmålsId}-${personType}-${barnetsId}`;
};

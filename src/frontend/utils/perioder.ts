import { ArbeidsperiodeSpørsmålsId } from '../components/Felleskomponenter/Arbeidsperiode/spørsmål';
import { BarnetrygdperiodeSpørsmålId } from '../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import { PensjonsperiodeSpørsmålId } from '../components/Felleskomponenter/Pensjonsmodal/spørsmål';
import { UtbetalingerSpørsmålId } from '../components/Felleskomponenter/UtbetalingerModal/spørsmål';
import { BarnetsId } from '../typer/common';
import { PersonType } from '../typer/personType';
import {
    dagenEtterDato,
    dagensDato,
    erDatoFormatGodkjent,
    erSammeDatoSomDagensDato,
    morgendagensDato,
    stringTilDate,
} from './dato';

export const minTilDatoForUtbetalingEllerArbeidsperiode = (
    periodenErAvsluttet: boolean,
    fraDato: string
) => {
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
        | UtbetalingerSpørsmålId;
    barnetsId?: BarnetsId;
}) => {
    return personType === PersonType.Søker
        ? `${spørsmålsId}-${personType}`
        : `${spørsmålsId}-${personType}-${barnetsId}`;
};

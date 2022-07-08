import { ISODateString } from '@navikt/familie-form-elements';

import { ArbeidsperiodeSpørsmålsId } from '../components/Felleskomponenter/Arbeidsperiode/spørsmål';
import { BarnetrygdperiodeSpørsmålId } from '../components/Felleskomponenter/Barnetrygdperiode/spørsmål';
import { PensjonsperiodeSpørsmålId } from '../components/Felleskomponenter/Pensjonsmodal/spørsmål';
import { UtbetalingerSpørsmålId } from '../components/Felleskomponenter/UtbetalingerModal/spørsmål';
import { BarnetsId } from '../typer/common';
import { PersonType } from '../typer/personType';
import { dagenEtterDato, dagensDato, erSammeDatoSomDagensDato, morgendagensDato } from './dato';

export const minTilDatoForUtbetalingEllerArbeidsperiode = (
    periodenErAvsluttet: boolean,
    fraDato: ISODateString
) => {
    if (periodenErAvsluttet) {
        return dagenEtterDato(fraDato);
    } else if (erSammeDatoSomDagensDato(fraDato)) {
        return morgendagensDato();
    } else {
        return dagensDato();
    }
};

export const hentPeriodeId = ({
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

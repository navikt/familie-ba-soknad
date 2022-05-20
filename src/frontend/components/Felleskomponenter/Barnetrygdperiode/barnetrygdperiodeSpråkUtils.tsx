import React, { ReactNode } from 'react';

import { PersonType } from '../../../utils/perioder';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../SøknadsSteg/EøsSteg/Barn/spørsmål';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { BarnetrygdperiodeSpørsmålId, barnetrygdperiodeSpørsmålSpråkId } from './spørsmål';

export const barnetrygdslandFeilmelding = (periodenErAvsluttet: boolean): string =>
    periodenErAvsluttet
        ? 'modal.hvilketlandbarnetrygd.feilmelding'
        : 'ombarnet.hvilketlandfår.feilmelding';

export const eøsBarnetrygdSpørsmålSpråkTekst = (
    periodenErAvsluttet: boolean,
    spørsmålsId: BarnetrygdperiodeSpørsmålId,
    språkValues?: Record<string, ReactNode>
) => (
    <SpråkTekst
        id={barnetrygdperiodeSpørsmålSpråkId(periodenErAvsluttet)[spørsmålsId]}
        values={språkValues}
    />
);

export const barnetrygdSpørsmålSpråkId = (personType: PersonType, erDød?: boolean): string => {
    switch (personType) {
        case PersonType.AndreForelder: {
            return erDød
                ? eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderBarnetrygdGjenlevende]
                : eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.andreForelderBarnetrygd];
        }
        case PersonType.Søker:
        default:
            return omBarnetSpørsmålSpråkId[OmBarnetSpørsmålsId.mottarEllerMottokEøsBarnetrygd];
    }
};

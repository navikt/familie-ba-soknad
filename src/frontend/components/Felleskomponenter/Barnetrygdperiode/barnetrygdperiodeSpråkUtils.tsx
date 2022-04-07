import React, { ReactNode } from 'react';

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

import React, { ReactNode } from 'react';

import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { BarnetrygdperiodeSpørsmålId, barnetrygdperiodeSpørsmålSpråkId } from './spørsmål';

export const barnetrygdslandFeilmelding = (tilbakeITid: boolean): string =>
    tilbakeITid ? 'modal.hvilketlandbarnetrygd.feilmelding' : 'ombarnet.hvilketlandfår.feilmelding';

export const eøsBarnetrygdSpørsmålSpråkTekst = (
    tilbakeITid: boolean,
    spørsmålsId: BarnetrygdperiodeSpørsmålId,
    språkValues?: Record<string, ReactNode> | undefined
) => (
    <SpråkTekst
        id={barnetrygdperiodeSpørsmålSpråkId(tilbakeITid)[spørsmålsId]}
        values={språkValues}
    />
);

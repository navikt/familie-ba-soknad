import React from 'react';
import { ReactNode } from 'react';

import { FeiloppsummeringFeil } from 'nav-frontend-skjema';

import { IRoute } from '../../../context/RoutesContext';
import { AppLenke } from '../AppLenke/AppLenke';

export const lagRouteFeilRenderer = (route: IRoute) => {
    return (feil: FeiloppsummeringFeil): ReactNode => {
        const { feilmelding, skjemaelementId } = feil;
        return (
            <AppLenke route={route} hash={skjemaelementId}>
                {feilmelding}
            </AppLenke>
        );
    };
};

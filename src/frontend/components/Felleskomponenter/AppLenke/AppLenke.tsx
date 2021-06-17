import React, { MouseEventHandler } from 'react';

import { useHistory } from 'react-router-dom';

import Lenke from 'nav-frontend-lenker';

import { IRoute } from '../../../context/RoutesContext';
import { basePath } from '../../../Miljø';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { unslash } from '../../../../shared-utils/unslash';
import { useAppNavigation } from '../../../context/AppNavigationContext';

export const AppLenke: React.FC<{ route: IRoute; språkTekstId: string, returnTo?: IRoute }> = ({
    route,
    språkTekstId,
    returnTo
}) => {
    const { push } = useHistory();
    const { settKomFra } = useAppNavigation();

    const clickHandler: MouseEventHandler = event => {
        event.preventDefault();
        returnTo && settKomFra(returnTo);
        push(route.path);
    };

    return (
        <Lenke href={basePath + unslash(route.path)} rel="noopener noreferrer" onClick={clickHandler}>
            <SpråkTekst id={språkTekstId} />
        </Lenke>
    );
};

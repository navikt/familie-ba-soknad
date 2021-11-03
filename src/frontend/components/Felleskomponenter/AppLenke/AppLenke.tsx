import React, { MouseEventHandler } from 'react';

import { useHistory } from 'react-router-dom';

import Lenke from 'nav-frontend-lenker';

import { unslash } from '../../../../shared-utils/unslash';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import { basePath } from '../../../Miljø';
import { IRoute } from '../../../typer/routes';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    route: IRoute;
    hash?: string;
    språkTekstId?: string;
    returnTo?: IRoute;
}

export const AppLenke: React.FC<Props> = ({ route, hash, språkTekstId, returnTo, children }) => {
    const { push: pushHistory } = useHistory();
    const { settKomFra } = useAppNavigation();

    const clickHandler: MouseEventHandler = event => {
        event.preventDefault();
        returnTo && settKomFra(returnTo);
        pushHistory({
            pathname: route.path,
            hash,
        });
    };

    return (
        <Lenke
            href={basePath + unslash(route.path) + (hash ? '#' + hash : '')}
            rel="noopener noreferrer"
            onClick={clickHandler}
        >
            {språkTekstId ? <SpråkTekst id={språkTekstId} /> : children}
        </Lenke>
    );
};

import React, { MouseEventHandler } from 'react';

import { useHistory } from 'react-router-dom';

import { Link } from '@navikt/ds-react';

import { basePath } from '../../../../shared-utils/Miljø';
import { unslash } from '../../../../shared-utils/unslash';
import { useAppNavigation } from '../../../context/AppNavigationContext';
import { ISteg } from '../../../typer/routes';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    steg: ISteg;
    hash?: string;
    språkTekstId?: string;
    returnTo?: ISteg;
}

export const AppLenke: React.FC<Props> = ({ steg, hash, språkTekstId, returnTo, children }) => {
    const { push: pushHistory } = useHistory();
    const { settKomFra } = useAppNavigation();

    const clickHandler: MouseEventHandler = event => {
        event.preventDefault();
        returnTo && settKomFra(returnTo);
        pushHistory({
            pathname: steg.path,
            hash,
        });
    };

    return (
        <Link
            href={basePath + unslash(steg.path) + (hash ? '#' + hash : '')}
            rel="noopener noreferrer"
            onClick={clickHandler}
        >
            {språkTekstId ? <SpråkTekst id={språkTekstId} /> : children}
        </Link>
    );
};

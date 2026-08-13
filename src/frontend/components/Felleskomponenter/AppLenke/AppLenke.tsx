import { Link } from '@navikt/ds-react';

import type { FC, MouseEventHandler, ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { BASE_PATH } from '../../../../common/miljø';
import { unslash } from '../../../../common/unslash';
import { useAppNavigationContext } from '../../../context/AppNavigationContext';
import type { ISteg } from '../../../typer/routes';

interface Props {
    steg: ISteg;
    hash?: string;
    returnTo?: ISteg;
    children?: ReactNode;
}

export const AppLenke: FC<Props> = ({ steg, hash, returnTo, children }) => {
    const navigate = useNavigate();
    const { settKomFra } = useAppNavigationContext();

    const clickHandler: MouseEventHandler = event => {
        event.preventDefault();
        if (returnTo) {
            settKomFra(returnTo);
        }
        navigate({
            pathname: steg.path,
            hash,
        });
    };

    return (
        <Link
            href={BASE_PATH + unslash(steg.path) + (hash ? `#${hash}` : '')}
            rel="noopener noreferrer"
            onClick={clickHandler}
        >
            {children}
        </Link>
    );
};

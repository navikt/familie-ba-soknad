import React, { FC, ReactNode } from 'react';

import { Link } from '@navikt/ds-react';

interface IGåTilBakeTilForrigeSideLenkeProps {
    children: ReactNode;
}

export const GåTilBakeTilForrigeSideLenke: FC<IGåTilBakeTilForrigeSideLenkeProps> = ({
    children,
}) => {
    return (
        <Link variant="action" onClick={() => history.back()}>
            {children}
        </Link>
    );
};

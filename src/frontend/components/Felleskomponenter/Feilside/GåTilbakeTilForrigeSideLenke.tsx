import React, { FC, ReactNode } from 'react';

import { Link } from '@navikt/ds-react';

interface IGåTilBakeTilForrigeSideLenkeProps {
    children: ReactNode;
}

export const GåTilBakeTilForrigeSideLenke: FC<IGåTilBakeTilForrigeSideLenkeProps> = ({
    children,
}) => {
    const håndterTilbake = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        history.back();
    };

    return (
        <Link variant="action" onClick={håndterTilbake}>
            {children}
        </Link>
    );
};

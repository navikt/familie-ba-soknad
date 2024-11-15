import React, { FC, ReactNode } from 'react';

import { Link } from '@navikt/ds-react';

interface ILastInnSidenPåNyttLenkeProps {
    children: ReactNode;
}

export const LastInnSidenPåNyttLenke: FC<ILastInnSidenPåNyttLenkeProps> = ({ children }) => {
    return (
        <Link href={location.href} variant="action">
            {children}
        </Link>
    );
};

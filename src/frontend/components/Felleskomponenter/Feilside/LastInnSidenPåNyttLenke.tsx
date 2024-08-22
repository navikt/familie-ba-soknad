import React, { FC, ReactNode } from 'react';

import { Link } from '@navikt/ds-react';

import { useSteg } from '../../../context/StegContext';

export const LastInnSidenPåNyttLenke: FC<{ children: ReactNode }> = ({ children }) => {
    const { hentNåværendeSteg } = useSteg();
    const nåværendeSteg = hentNåværendeSteg();

    const håndterLastInnPåNytt = (event: React.MouseEvent) => {
        event.preventDefault();
        location.reload();
    };

    return (
        <Link href={nåværendeSteg.path} variant="action" onClick={håndterLastInnPåNytt}>
            {children}
        </Link>
    );
};

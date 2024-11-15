import React, { FC, ReactNode } from 'react';

import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface IGåTilBakeTilForrigeSideLenkeProps {
    children: ReactNode;
}

export const GåTilBakeTilForrigeSideLenke: FC<IGåTilBakeTilForrigeSideLenkeProps> = ({
    children,
}) => {
    const handleNavigate = (event: React.MouseEvent) => {
        history.back();
        event.preventDefault();
    };

    return (
        <Button variant="secondary" size="small" icon={<ArrowUndoIcon />} onClick={handleNavigate}>
            {children}
        </Button>
    );
};

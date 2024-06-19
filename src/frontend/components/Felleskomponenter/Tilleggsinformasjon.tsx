import React, { ReactNode } from 'react';

import { Box } from '@navikt/ds-react';

const Tilleggsinformasjon: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <Box padding="4" background="surface-subtle">
            {children}
        </Box>
    );
};

export default Tilleggsinformasjon;

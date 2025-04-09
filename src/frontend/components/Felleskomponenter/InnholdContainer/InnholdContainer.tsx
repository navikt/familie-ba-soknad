import React, { ReactNode } from 'react';

import { Box, Heading, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';

const InnholdContainer: React.FC<{ className?: string; children?: ReactNode }> = ({
    children,
    className,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const forsidetekster = tekster().FORSIDE;

    return (
        <Box marginBlock="10 16" className={className}>
            <VStack gap="10">
                <Heading level="1" size="xlarge">
                    {plainTekst(forsidetekster.soeknadstittelBarnetrygd)}
                </Heading>
                {children}
            </VStack>
        </Box>
    );
};

export default InnholdContainer;

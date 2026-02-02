import React, { ReactNode } from 'react';

import { Box, Heading, VStack } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';

const InnholdContainer: React.FC<{ className?: string; children?: ReactNode }> = ({ children, className }) => {
    const { tekster, plainTekst } = useAppContext();
    const forsidetekster = tekster().FORSIDE;

    return (
        <Box marginBlock="space-12 space-16" className={className}>
            <VStack gap="space-12">
                <Heading level="1" size="xlarge">
                    {plainTekst(forsidetekster.soeknadstittelBarnetrygd)}
                </Heading>
                {children}
            </VStack>
        </Box>
    );
};

export default InnholdContainer;

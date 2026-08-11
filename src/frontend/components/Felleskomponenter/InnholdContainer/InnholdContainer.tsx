import { Box, Heading, VStack } from '@navikt/ds-react';

import type { FC, ReactNode } from 'react';

import { useAppContext } from '../../../context/AppContext';

const InnholdContainer: FC<{ className?: string; children?: ReactNode }> = ({ children, className }) => {
    const { tekster, plainTekst } = useAppContext();
    const forsidetekster = tekster().FORSIDE;

    return (
        <Box marginBlock="space-40 space-64" className={className}>
            <VStack gap="space-40">
                <Heading level="1" size="xlarge">
                    {plainTekst(forsidetekster.soeknadstittelBarnetrygd)}
                </Heading>
                {children}
            </VStack>
        </Box>
    );
};

export default InnholdContainer;

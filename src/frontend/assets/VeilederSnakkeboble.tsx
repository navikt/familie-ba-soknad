import React from 'react';

import styled from 'styled-components';

import { GuidePanel } from '@navikt/ds-react';

const StyledGuidePanel = styled(GuidePanel)`
    .navds-guide-panel__content {
        min-height: 3rem;
    }
`;

const VeilederSnakkeboble: React.FC = ({ children }) => (
    <StyledGuidePanel poster>{children}</StyledGuidePanel>
);

export default VeilederSnakkeboble;

import React from 'react';

import styled from 'styled-components';

import { Alert as NavAlert, AlertProps } from '@navikt/ds-react';

interface AlertStripeProps extends AlertProps {
    dynamisk?: boolean;
    className?: '';
}

const StyledAlert = styled(NavAlert)`
    p {
        margin: 0;
    }
`;

const AlertStripe: React.FC<AlertStripeProps> = ({
    variant,
    inline = true,
    size = 'medium',
    fullWidth = false,
    dynamisk = false,
    className,
    children,
}) => {
    return (
        <StyledAlert
            className={className}
            data-testid={'alertstripe'}
            variant={variant}
            inline={inline}
            size={size}
            fullWidth={fullWidth}
            aria-live={dynamisk ? 'polite' : 'off'}
        >
            {children}
        </StyledAlert>
    );
};

export default AlertStripe;

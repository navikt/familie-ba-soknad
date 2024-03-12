import React from 'react';

import styled from 'styled-components';

import { Alert, AlertProps } from '@navikt/ds-react';

interface AlertStripeProps extends AlertProps {
    dynamisk?: boolean;
    className?: '';
}

const StyledAlert = styled(Alert)`
    p {
        margin: 0;
    }
`;

const FamilieAlert: React.FC<AlertStripeProps> = ({
    // TODO: vurder om denne kan fjernes etter arbeid med kombinert søknad
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

export default FamilieAlert;

import React from 'react';

import styled from 'styled-components';

import { AlertStripeType, default as NavAlertStripe } from 'nav-frontend-alertstriper';

interface AlertStripeProps {
    type?: AlertStripeType;
    form?: 'default' | 'inline' | undefined;
}

export const StyledAlertStripe = styled(NavAlertStripe)`
    p {
        margin: 0;
    }
`;

const AlertStripe: React.FC<AlertStripeProps> = ({ type = 'info', form = 'inline', children }) => {
    return (
        <StyledAlertStripe type={type} form={form}>
            <p>{children}</p>
        </StyledAlertStripe>
    );
};

export default AlertStripe;

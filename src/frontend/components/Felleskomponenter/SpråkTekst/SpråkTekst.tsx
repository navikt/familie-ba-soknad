import React from 'react';

import { FormattedMessage } from 'react-intl';
import { Props as MessageProps } from 'react-intl/lib/src/components/message';

const SpråkTekst: React.FC<MessageProps> = props => {
    const propsMedFellesFunksjoner: MessageProps = {
        ...props,
        values: {
            ...props.values,
            linjeskift: <br />,
            b: msg => <b>{msg}</b>,
        },
    };

    return <FormattedMessage {...propsMedFellesFunksjoner} />;
};

export default SpråkTekst;

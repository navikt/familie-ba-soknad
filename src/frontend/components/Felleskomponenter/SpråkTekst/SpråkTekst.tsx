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
            punktliste: msg => <ul>{msg}</ul>,
            punkt: msg => <li>{msg}</li>,
            p: msg => <p>{msg}</p>,
        },
    };

    return <FormattedMessage {...propsMedFellesFunksjoner} />;
};

export default SpråkTekst;

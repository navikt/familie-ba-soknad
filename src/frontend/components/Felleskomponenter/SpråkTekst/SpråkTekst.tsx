import React from 'react';

import { FormattedMessage } from 'react-intl';
import { Props as MessageProps } from 'react-intl/lib/src/components/message';

import EksternLenke from '../EksternLenke/EksternLenke';

export const innebygdeFormatterere = {
    linjeskift: <br />,
    b: msg => <b>{msg}</b>,
    punktliste: msg => <ul>{msg}</ul>,
    punkt: msg => <li>{msg}</li>,
    p: msg => <p>{msg}</p>,
    bokmål: msg => <span lang="nb">{msg}</span>,
    lenketekst: msg => <> {msg} </>,
    lenke: msg => (
        <EksternLenke lenkeTekstSpråkId={msg} lenkeSpråkId={msg} target="_blank"></EksternLenke>
    ),
};

const SpråkTekst: React.FC<MessageProps> = props => {
    const propsMedFellesFunksjoner: MessageProps = {
        ...props,
        values: {
            ...props.values,
            ...innebygdeFormatterere,
        },
    };

    return <FormattedMessage {...propsMedFellesFunksjoner} />;
};

export default SpråkTekst;

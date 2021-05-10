import React from 'react';

import { useIntl } from 'react-intl';

import Lenke, { Props as LenkeProps } from 'nav-frontend-lenker';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface SpråkLenkeProps extends Omit<LenkeProps, 'href' | 'children'> {
    hrefId: string;
    lenkeTekstId: string;
}

export const SpråkLenke: React.FC<SpråkLenkeProps> = ({ hrefId, lenkeTekstId, ...props }) => {
    const intl = useIntl();

    return (
        <Lenke {...props} href={intl.formatMessage({ id: hrefId })}>
            <SpråkTekst id={lenkeTekstId} />
        </Lenke>
    );
};

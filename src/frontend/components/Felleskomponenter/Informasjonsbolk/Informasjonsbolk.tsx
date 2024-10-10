import React, { ReactNode } from 'react';

import { Heading } from '@navikt/ds-react';

import { HeadingLevel } from '../../../typer/common';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

export interface IInformasjonsbolkProps {
    tittelId?: string;
    språkValues?: { [key: string]: ReactNode };
    children?: ReactNode;
    headingLevel?: HeadingLevel;
}

const Informasjonsbolk: React.FC<IInformasjonsbolkProps> = ({
    tittelId,
    språkValues,
    children,
    headingLevel = '3',
    ...props
}) => {
    return (
        <div {...props}>
            {tittelId && (
                <Heading level={headingLevel} size={'xsmall'}>
                    <SpråkTekst id={tittelId} values={språkValues} />
                </Heading>
            )}
            {children}
        </div>
    );
};

export default Informasjonsbolk;

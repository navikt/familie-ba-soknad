import React, { ReactNode } from 'react';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button, FormSummary } from '@navikt/ds-react';

import { HeadingLevel } from '../../../typer/common';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const PeriodeOppsummeringMedFormSummary: React.FC<{
    nummer: number;
    fjernPeriodeCallback?: () => void;
    fjernKnappSpråkId?: string;
    tittelSpråkId: string;
    vedleggNotis?: ReactNode;
    children?: ReactNode;
    headingLevel?: HeadingLevel;
}> = ({
    nummer,
    fjernPeriodeCallback = undefined,
    fjernKnappSpråkId,
    tittelSpråkId,
    vedleggNotis,
    children,
}) => {
    return (
        <FormSummary.Answer>
            <FormSummary.Label>
                <SpråkTekst id={tittelSpråkId} values={{ x: nummer }} />
            </FormSummary.Label>
            <FormSummary.Value>
                <FormSummary.Answers>
                    {children}
                    {fjernPeriodeCallback !== undefined && (
                        <Button
                            type={'button'}
                            variant={'tertiary'}
                            onClick={() => fjernPeriodeCallback()}
                            icon={<TrashFillIcon aria-hidden />}
                        >
                            <SpråkTekst id={fjernKnappSpråkId} />
                        </Button>
                    )}
                </FormSummary.Answers>
            </FormSummary.Value>
            {vedleggNotis}
        </FormSummary.Answer>
    );
};

export default PeriodeOppsummeringMedFormSummary;

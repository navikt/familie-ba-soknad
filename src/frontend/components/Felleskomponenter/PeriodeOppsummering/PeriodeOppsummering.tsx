import React, { ReactNode } from 'react';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button, FormSummary } from '@navikt/ds-react';

import { HeadingLevel } from '../../../typer/common';
import { LocaleRecordBlock } from '../../../typer/sanity/sanity';
import TekstBlock from '../Sanity/TekstBlock';

interface Props {
    fjernPeriodeCallback?: () => void;
    fjernKnappTekst?: LocaleRecordBlock;
    tittel: ReactNode;
    children: ReactNode;
    headingLevel?: HeadingLevel;
}

function PeriodeOppsummering({ fjernPeriodeCallback = undefined, fjernKnappTekst, tittel, children }: Props) {
    return (
        <FormSummary.Answer>
            <FormSummary.Label>{tittel}</FormSummary.Label>
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
                            <TekstBlock block={fjernKnappTekst} />
                        </Button>
                    )}
                </FormSummary.Answers>
            </FormSummary.Value>
        </FormSummary.Answer>
    );
}

export default PeriodeOppsummering;

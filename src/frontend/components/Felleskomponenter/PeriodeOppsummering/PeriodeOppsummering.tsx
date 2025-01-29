import React, { ReactNode } from 'react';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button, FormSummary } from '@navikt/ds-react';

import { HeadingLevel } from '../../../typer/common';
import { LocaleRecordBlock } from '../../../typer/sanity/sanity';
import TekstBlock from '../Sanity/TekstBlock';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    nummer: number;
    fjernPeriodeCallback?: () => void;
    fjernKnappSpråkId?: string;
    fjernKnappTekst?: LocaleRecordBlock;
    tittelSpråkId: string;
    tittel?: ReactNode;
    children?: ReactNode;
    headingLevel?: HeadingLevel;
}

function PeriodeOppsummering({
    nummer,
    fjernPeriodeCallback = undefined,
    fjernKnappSpråkId,
    fjernKnappTekst,
    tittelSpråkId,
    tittel,
    children,
}: Props) {
    return (
        <FormSummary.Answer>
            <FormSummary.Label>
                {tittel ? tittel : <SpråkTekst id={tittelSpråkId} values={{ x: nummer }} />}
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
                            {fjernKnappTekst ? (
                                <TekstBlock block={fjernKnappTekst} />
                            ) : (
                                <SpråkTekst id={fjernKnappSpråkId} />
                            )}
                        </Button>
                    )}
                </FormSummary.Answers>
            </FormSummary.Value>
        </FormSummary.Answer>
    );
}

export default PeriodeOppsummering;

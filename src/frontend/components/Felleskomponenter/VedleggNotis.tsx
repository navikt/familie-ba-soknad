import React, { ReactNode } from 'react';

import styled from 'styled-components/macro';

import { FileContent } from '@navikt/ds-icons';

import EksternLenke from './EksternLenke/EksternLenke';
import SpråkTekst from './SpråkTekst/SpråkTekst';

const NotisWrapper = styled.div`
    display: flex;
    margin-top: 1rem;
`;

const StyledFileContent = styled(FileContent)`
    max-width: 1.125rem;
    min-width: 1.125rem;
    max-height: fit-content;
    margin-right: 1rem;
`;

const NotisInnhold = styled.div`
    ul {
        margin: 0;
        padding-left: 1.3rem; // For kulepunkt
    }

    p {
        margin: 0;
    }
`;

const StyledEksternLenkeWrapper = styled.div`
    margin: 0.5rem 0 0 2rem;
    a {
        span {
            font-size: 16px;
        }
    }
`;

export const VedleggNotis: React.FC<{
    språkTekstId: string;
    dynamisk?: boolean;
    språkValues?: Record<string, ReactNode>;
}> = ({ språkTekstId, dynamisk = false, språkValues = {} }) => {
    return (
        <NotisWrapper aria-live={dynamisk ? 'polite' : 'off'}>
            <StyledFileContent role={'img'} focusable={false} aria-label={'vedleggsikon'} />
            <NotisInnhold>
                <SpråkTekst id={språkTekstId} values={språkValues} />
            </NotisInnhold>
        </NotisWrapper>
    );
};

export const VedleggNotisTilleggsskjema: React.FC<{ språkTekstId: string; dynamisk?: boolean }> = ({
    språkTekstId,
    dynamisk = false,
}) => {
    return (
        <>
            <VedleggNotis språkTekstId={språkTekstId} dynamisk={dynamisk} />
            <StyledEksternLenkeWrapper>
                <EksternLenke
                    lenkeSpråkId={'eøs.tilleggsskjema.lenke'}
                    lenkeTekstSpråkId={'eøs.tilleggsskjema.lenketekst'}
                    target="_blank"
                />
            </StyledEksternLenkeWrapper>
        </>
    );
};

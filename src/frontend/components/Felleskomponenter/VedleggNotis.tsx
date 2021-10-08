import React, { ReactNode } from 'react';

import styled from 'styled-components/macro';

import { Normaltekst } from 'nav-frontend-typografi';

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
    margin-top: 0.2rem;
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

const StyledEksternLenkeWrapper = styled(EksternLenke)`
    margin: 0.5rem 0 0 2rem;
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
                <Normaltekst>
                    <SpråkTekst id={språkTekstId} values={språkValues} />
                </Normaltekst>
            </NotisInnhold>
        </NotisWrapper>
    );
};

export const VedleggNotisTilleggsskjema: React.FC<{
    språkTekstId: string;
    dynamisk?: boolean;
    språkValues?: Record<string, ReactNode>;
}> = ({ språkTekstId, dynamisk = false, språkValues = {} }) => {
    return (
        <>
            <VedleggNotis
                språkTekstId={språkTekstId}
                dynamisk={dynamisk}
                språkValues={språkValues}
            />
            <StyledEksternLenkeWrapper
                lenkeSpråkId={'eøs.tilleggsskjema.lenke'}
                lenkeTekstSpråkId={'eøs.tilleggsskjema.lenketekst'}
                target="_blank"
            />
        </>
    );
};

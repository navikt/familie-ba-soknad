import React from 'react';

import styled from 'styled-components';

import { PaperclipIcon, TrashFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import { ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

import { IVedlegg } from '../../../../typer/dokumentasjon';
import { formaterFilstørrelse } from '../../../../utils/dokumentasjon';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface Props {
    filliste: IVedlegg[];
    slettVedlegg: (vedlegg: IVedlegg) => void;
}

const FilListe = styled.ul`
    padding: 0;
`;

const FilRad = styled.li<{ $skillelinje: boolean }>`
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: ${props => (props.$skillelinje ? `1px solid ${ABorderDivider}` : 'none')};
`;

const FilTekstWrapper = styled.div`
    display: flex;
    align-items: center;
    word-break: break-all;
    margin-right: 1rem;
`;

const StyledAttachment = styled(PaperclipIcon)`
    margin-right: 1rem;
    min-width: 1rem;
    font-size: 1.5rem;
`;

const OpplastedeFiler: React.FC<Props> = ({ filliste, slettVedlegg }) => {
    return (
        <FilListe>
            {filliste.map((fil: IVedlegg, index: number) => {
                return (
                    <FilRad key={fil.dokumentId} $skillelinje={index !== filliste.length - 1}>
                        <FilTekstWrapper>
                            <StyledAttachment
                                focusable={false}
                                role={'img'}
                                aria-hidden={true}
                                aria-label={''}
                            />
                            <BodyShort>
                                {`${fil.navn} (${formaterFilstørrelse(fil.størrelse)})`}
                            </BodyShort>
                        </FilTekstWrapper>
                        <Button
                            variant={'tertiary'}
                            onClick={() => slettVedlegg(fil)}
                            icon={<TrashFillIcon focusable={false} />}
                        >
                            <SpråkTekst id={'felles.slett'} />
                        </Button>
                    </FilRad>
                );
            })}
        </FilListe>
    );
};

export default OpplastedeFiler;

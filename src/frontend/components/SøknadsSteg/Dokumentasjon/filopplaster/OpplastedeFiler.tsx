import React from 'react';

import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { Flatknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { Attachment, DeleteFilled } from '@navikt/ds-icons';

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

const FilRad = styled.li<{ skillelinje: boolean }>`
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: ${props => (props.skillelinje ? `1px solid ${navFarger.navGra20}` : 'none')};
`;

const FilTekstWrapper = styled.div`
    display: flex;
    align-items: center;
    word-break: break-all;
    margin-right: 1rem;
`;

const StyledAttachment = styled(Attachment)`
    margin-right: 1rem;
    min-width: 1rem;
`;

const OpplastedeFiler: React.FC<Props> = ({ filliste, slettVedlegg }) => {
    return (
        <FilListe>
            {filliste.map((fil: IVedlegg, index: number) => {
                return (
                    <FilRad key={fil.dokumentId} skillelinje={index !== filliste.length - 1}>
                        <FilTekstWrapper>
                            <StyledAttachment
                                focusable={false}
                                role={'img'}
                                aria-hidden={true}
                                aria-label={''}
                            />
                            <Normaltekst>
                                {`${fil.navn} (${formaterFilstørrelse(fil.størrelse)})`}
                            </Normaltekst>
                        </FilTekstWrapper>
                        <Flatknapp mini kompakt onClick={() => slettVedlegg(fil)}>
                            <span>
                                <SpråkTekst id={'felles.slett'} />
                            </span>
                            <DeleteFilled focusable={false} />
                        </Flatknapp>
                    </FilRad>
                );
            })}
        </FilListe>
    );
};

export default OpplastedeFiler;

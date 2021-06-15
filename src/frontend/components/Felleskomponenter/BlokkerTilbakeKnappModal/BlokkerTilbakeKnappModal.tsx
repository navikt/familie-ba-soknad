import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { Prompt } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import Knappelenke from '@navikt/sif-common-core/lib/components/knappelenke/Knappelenke';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledModal = styled(Modal)`
    max-width: 600px;
`;
const StyledUndertittel = styled(Undertittel)`
    padding-bottom: 18px;
`;
const Wrapper = styled.div`
    padding: 9px;
`;
const Flex = styled.div`
    padding-top: 18px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-content: space-between;
    gap: 1rem;
`;
const StyledFlatknapp = styled(Flatknapp)`
    margin-right: 1rem;
`;

const BlokkerTilbakeKnappModal = () => {
    const [show, setShow] = useState(false);
    const { formatMessage } = useIntl();

    const handleNavigation = () => {
        setShow(true);
        return false;
    };
    const håndterAvbryt = () => {
        setShow(false);
    };

    return (
        <>
            <Prompt message={handleNavigation} />
            <StyledModal
                onRequestClose={() => setShow(false)}
                isOpen={show}
                contentLabel={formatMessage({ id: 'felles.blokkerTilbakeKnapp.modal.tittel' })}
            >
                <Wrapper>
                    <StyledUndertittel>
                        <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tittel'} />
                    </StyledUndertittel>
                    <Normaltekst>
                        <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tekst'} />
                    </Normaltekst>
                    <Flex>
                        <StyledFlatknapp onClick={håndterAvbryt}>
                            <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.avbrytKnapp'} />
                        </StyledFlatknapp>
                        <Knappelenke href={'https://www.nav.no/person/dittnav/'}>
                            <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tilDittNavKnapp'} />
                        </Knappelenke>
                    </Flex>
                </Wrapper>
            </StyledModal>
        </>
    );
};

export default BlokkerTilbakeKnappModal;

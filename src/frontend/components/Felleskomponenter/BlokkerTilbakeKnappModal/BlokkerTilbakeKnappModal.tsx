import React, { useState } from 'react';

import { Prompt } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Knapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';

import Informasjonsbolk from '../Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledModal = styled(Modal)`
    max-width: 600px;
`;
const Wrapper = styled.div`
    text-align: center;
`;
const Flex = styled.div`
    display: flex;
    flex-direction: row;
    align-content: space-between;
    flex-wrap: wrap;
    justify-content: center;
`;

const StyledKnapp = styled(Knapp)`
    margin: 0 2rem 1rem 2rem;
`;

const BlokkerTilbakeKnappModal = () => {
    const [show, setShow] = useState(false);

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
                contentLabel={'Hva skal tittelen være?'}
            >
                <Wrapper>
                    <Informasjonsbolk tittelId={'felles.blokkerTilbakeKnapp.modal.tittel'}>
                        <Normaltekst>
                            <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tekst'} />
                        </Normaltekst>
                    </Informasjonsbolk>
                    <Flex>
                        <Lenke
                            href={'https://www.nav.no/familie/barnetrygd/soknad/ordinaer'}
                            rel={'noopener noreferrer'}
                        >
                            <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.forsideKnapp'} />
                        </Lenke>
                        <Lenke
                            href={'https://www.nav.no/person/dittnav/'}
                            rel={'noopener noreferrer'}
                        >
                            <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tilDittNavKnapp'} />
                        </Lenke>
                        <StyledKnapp onClick={håndterAvbryt}>
                            <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.avbrytKnapp'} />
                        </StyledKnapp>
                    </Flex>
                </Wrapper>
            </StyledModal>
        </>
    );
};

export default BlokkerTilbakeKnappModal;

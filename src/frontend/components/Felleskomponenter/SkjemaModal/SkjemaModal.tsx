import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Button, Heading, Modal } from '@navikt/ds-react';

import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledButton = styled(Button)`
    && {
        margin-top: 4rem;
        white-space: normal;
        max-width: 100%;
        box-sizing: border-box;
    }
`;

const SkjemaModal: React.FC<{
    erÅpen: boolean;
    lukkModal: () => void;
    modalTittelSpråkId: string;
    submitSpinner?: boolean;
    valideringErOk: () => boolean;
    onAvbrytCallback?: () => void;
    submitKnappSpråkId: string;
    onSubmitCallback: () => void;
    children?: ReactNode;
}> = ({
    erÅpen,
    lukkModal,
    modalTittelSpråkId,
    submitSpinner = false,
    valideringErOk,
    onAvbrytCallback,
    submitKnappSpråkId,
    onSubmitCallback,
    children,
}) => {
    const { formatMessage } = useIntl();

    return (
        <Modal
            open={erÅpen}
            onClose={() => {
                lukkModal();
                onAvbrytCallback && onAvbrytCallback();
            }}
            aria-label={formatMessage({ id: modalTittelSpråkId })}
            width={'medium'}
            portal={true}
        >
            <Modal.Header>
                {modalTittelSpråkId && (
                    <Heading level={'1'} size={'large'}>
                        <SpråkTekst id={modalTittelSpråkId} />
                    </Heading>
                )}
            </Modal.Header>
            <ModalContent>
                <form>
                    {children}
                    <StyledButton
                        variant={valideringErOk() ? 'primary' : 'secondary'}
                        type={'submit'}
                        loading={submitSpinner}
                        onClick={event => {
                            event.preventDefault();
                            onSubmitCallback();
                        }}
                    >
                        <SpråkTekst id={submitKnappSpråkId} />
                    </StyledButton>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default SkjemaModal;

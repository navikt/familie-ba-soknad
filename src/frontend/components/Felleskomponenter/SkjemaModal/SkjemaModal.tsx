import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Innholdstittel } from 'nav-frontend-typografi';

import { Button, Modal } from '@navikt/ds-react';

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
const StyledInnholdstittel = styled(Innholdstittel)`
    text-align: center;
    padding: 2rem 0;
`;

const SkjemaModal: React.FC<{
    erÅpen: boolean;
    toggleModal: () => void;
    modalTittelSpråkId: string;
    submitSpinner?: boolean;
    valideringErOk: () => boolean;
    onAvbrytCallback?: () => void;
    submitKnappSpråkId: string;
    onSubmitCallback: () => void;
}> = ({
    erÅpen,
    toggleModal,
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
                toggleModal();
                onAvbrytCallback && onAvbrytCallback();
            }}
            aria-label={formatMessage({ id: modalTittelSpråkId })}
        >
            <ModalContent>
                {modalTittelSpråkId && (
                    <StyledInnholdstittel>
                        <SpråkTekst id={modalTittelSpråkId} />
                    </StyledInnholdstittel>
                )}
                <form>
                    {children}
                    <StyledButton
                        variant={valideringErOk() ? 'primary' : 'secondary'}
                        type={'submit'}
                        loading={!!submitSpinner}
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

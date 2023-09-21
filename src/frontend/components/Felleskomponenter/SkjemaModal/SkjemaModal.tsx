import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';

import { Button, Heading, Modal } from '@navikt/ds-react';

import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

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
                <form id="skjema">{children}</form>
            </ModalContent>
            <Modal.Footer>
                <Button
                    data-testid={submitKnappSpråkId}
                    form="skjema"
                    variant={valideringErOk() ? 'primary' : 'secondary'}
                    loading={submitSpinner}
                    onClick={event => {
                        event.preventDefault();
                        onSubmitCallback();
                    }}
                >
                    <SpråkTekst id={submitKnappSpråkId} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SkjemaModal;

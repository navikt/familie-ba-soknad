import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';

import { BodyShort, Button, Modal } from '@navikt/ds-react';

import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const SkjemaModal: React.FC<{
    erÅpen: boolean;
    lukkModal: () => void;
    modalTittelSpråkId: string;
    hjelpetekst?: string;
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
    hjelpetekst = undefined,
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
            width={'medium'}
            portal={true}
            header={{
                heading: formatMessage({ id: modalTittelSpråkId }),
                size: 'medium',
            }}
        >
            <ModalContent>
                {hjelpetekst && <BodyShort spacing>{hjelpetekst}</BodyShort>}
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

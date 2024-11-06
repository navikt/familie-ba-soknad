import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';

import { BodyShort, Button, Modal, VStack } from '@navikt/ds-react';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const SkjemaModal: React.FC<{
    erÅpen: boolean;
    lukkModal: () => void;
    modalTittelSpråkId: string;
    forklaring?: string;
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
    forklaring = undefined,
    submitSpinner = false,
    valideringErOk,
    onAvbrytCallback,
    submitKnappSpråkId,
    onSubmitCallback,
    children,
}) => {
    const { formatMessage } = useIntl();
    const { toggles } = useFeatureToggles();

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
                {toggles.NYE_MODAL_TEKSTER && forklaring && (
                    <BodyShort spacing>{forklaring}</BodyShort>
                )}
                <form id="skjema">
                    <VStack gap="10">{children}</VStack>
                </form>
            </ModalContent>
            <Modal.Footer>
                <Button
                    form="skjema"
                    variant={valideringErOk() ? 'primary' : 'secondary'}
                    data-testid={submitKnappSpråkId}
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

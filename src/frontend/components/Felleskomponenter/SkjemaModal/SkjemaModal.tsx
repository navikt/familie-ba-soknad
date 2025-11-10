import { ReactNode } from 'react';

import { BodyShort, Button, Modal, VStack } from '@navikt/ds-react';

import { FlettefeltVerdier, LocaleRecordBlock } from '../../../../common/typer/sanity';
import { useAppContext } from '../../../context/AppContext';
import ModalContent from '../ModalContent';

const SkjemaModal: React.FC<{
    erÅpen: boolean;
    lukkModal: () => void;
    submitSpinner?: boolean;
    valideringErOk: () => boolean;
    onAvbrytCallback?: () => void;
    onSubmitCallback: () => void;
    tittel: LocaleRecordBlock;
    forklaring?: ReactNode;
    submitKnappTekst: ReactNode;
    flettefelter?: FlettefeltVerdier;
    children?: ReactNode;
}> = ({
    erÅpen,
    lukkModal,
    submitSpinner = false,
    valideringErOk,
    onAvbrytCallback,
    onSubmitCallback,
    tittel,
    forklaring = undefined,
    submitKnappTekst,
    flettefelter,
    children,
}) => {
    const { plainTekst } = useAppContext();

    return (
        <Modal
            open={erÅpen}
            onClose={() => {
                lukkModal();
                if (onAvbrytCallback) {
                    onAvbrytCallback();
                }
            }}
            width={'medium'}
            portal={true}
            header={{
                heading: plainTekst(tittel, flettefelter),
                size: 'medium',
            }}
        >
            <ModalContent>
                <BodyShort spacing>{forklaring}</BodyShort>
                <form id="skjema">
                    <VStack gap="10">{children}</VStack>
                </form>
            </ModalContent>
            <Modal.Footer>
                <Button
                    form="skjema"
                    variant={valideringErOk() ? 'primary' : 'secondary'}
                    data-testid="submit-knapp-i-modal"
                    loading={submitSpinner}
                    onClick={event => {
                        event.preventDefault();
                        onSubmitCallback();
                    }}
                >
                    {submitKnappTekst}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SkjemaModal;

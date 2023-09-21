import React, { FC } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { BodyLong, Button, Heading, Modal } from '@navikt/ds-react';

import FamilieAlert from '../../Felleskomponenter/FamilieAlert/FamilieAlert';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import ModalContent from '../../Felleskomponenter/ModalContent';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const StyledButton = styled(Button)`
    && {
        margin: 0 auto 2rem auto;
        padding: 1rem 3rem 1rem 3rem;
    }
`;

const StyledFortsettPåSøknad = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
`;

const FortsettPåSøknad: FC = () => {
    const { fortsettPåSøknaden, startPåNytt, visStartPåNyttModal, settVisStartPåNyttModal } =
        useBekreftelseOgStartSoknad();
    const { formatMessage } = useIntl();
    return (
        <StyledFortsettPåSøknad role={'navigation'}>
            <KomponentGruppe>
                <FamilieAlert variant={'info'} inline={false}>
                    <BodyLong>
                        <SpråkTekst id={'mellomlagring.info'} />
                    </BodyLong>
                </FamilieAlert>
            </KomponentGruppe>
            <StyledButton onClick={fortsettPåSøknaden}>
                <SpråkTekst id={'mellomlagring.knapp.fortsett'} />
            </StyledButton>
            <StyledButton variant={'secondary'} onClick={() => settVisStartPåNyttModal(true)}>
                <SpråkTekst id={'mellomlagring.knapp.startpånytt'} />
            </StyledButton>
            <Modal
                open={visStartPåNyttModal}
                aria-label={formatMessage({ id: 'felles.startpånytt.modal.startpånyttknapp' })}
                onClose={() => {
                    settVisStartPåNyttModal(false);
                }}
            >
                <Modal.Header>
                    <Heading level={'1'} size={'large'}>
                        <SpråkTekst id={'felles.startpånytt.modal.startpånyttknapp'} />{' '}
                    </Heading>
                </Modal.Header>
                <ModalContent>
                    <BodyLong>
                        <SpråkTekst id={'felles.startpånytt.modal.tekst'} />
                    </BodyLong>
                </ModalContent>
                <Modal.Footer>
                    <Button variant={'primary'} onClick={startPåNytt}>
                        <SpråkTekst id={'felles.startpånytt.modal.startpånyttknapp'} />{' '}
                    </Button>
                    <Button variant={'secondary'} onClick={() => settVisStartPåNyttModal(false)}>
                        <SpråkTekst id={'felles.startpånytt.modal.avbrytknapp'} />
                    </Button>
                </Modal.Footer>
            </Modal>
        </StyledFortsettPåSøknad>
    );
};
export default FortsettPåSøknad;

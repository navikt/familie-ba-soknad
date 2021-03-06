import React, { FC } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import KnappBase, { Flatknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';

import { device } from '../../../Theme';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const StyledKnappBase = styled(KnappBase)`
    margin: 0 auto 2rem auto;
`;

const StyledFortsettPåSøknad = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ModalInnholdContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    max-width: 35rem;
`;

const ModalKnappeContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;

    @media all and ${device.mobile} {
        justify-content: center;
        flex-direction: column-reverse;
        max-width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }
`;

const StyledSideTittel = styled(Sidetittel)`
    && {
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }
`;

const FortsettPåSøknad: FC = () => {
    const {
        fortsettPåSøknaden,
        startPåNytt,
        visStartPåNyttModal,
        settVisStartPåNyttModal,
    } = useBekreftelseOgStartSoknad();
    const { formatMessage } = useIntl();
    return (
        <StyledFortsettPåSøknad role={'navigation'}>
            <KomponentGruppe>
                <AlertStripeInfo>
                    <Normaltekst>
                        <SpråkTekst id={'mellomlagring.info'} />
                    </Normaltekst>
                </AlertStripeInfo>
            </KomponentGruppe>
            <StyledKnappBase type={'hoved'} onClick={fortsettPåSøknaden}>
                <SpråkTekst id={'mellomlagring.knapp.fortsett'} />
            </StyledKnappBase>
            <StyledKnappBase onClick={() => settVisStartPåNyttModal(true)}>
                <SpråkTekst id={'mellomlagring.knapp.startpånytt'} />
            </StyledKnappBase>
            <Modal
                isOpen={visStartPåNyttModal}
                contentLabel={formatMessage({ id: 'felles.startpånytt.modal.startpånyttknapp' })}
                onRequestClose={() => {
                    settVisStartPåNyttModal(false);
                }}
            >
                <ModalInnholdContainer>
                    <StyledSideTittel>
                        <SpråkTekst id={'felles.startpånytt.modal.startpånyttknapp'} />{' '}
                    </StyledSideTittel>
                    <Normaltekst>
                        <SpråkTekst id={'felles.startpånytt.modal.tekst'} />
                    </Normaltekst>
                    <ModalKnappeContainer>
                        <Flatknapp kompakt={true} onClick={() => settVisStartPåNyttModal(false)}>
                            <SpråkTekst id={'felles.startpånytt.modal.avbrytknapp'} />
                        </Flatknapp>
                        <Knapp onClick={startPåNytt} kompakt={true}>
                            <SpråkTekst id={'felles.startpånytt.modal.startpånyttknapp'} />{' '}
                        </Knapp>
                    </ModalKnappeContainer>
                </ModalInnholdContainer>
            </Modal>
        </StyledFortsettPåSøknad>
    );
};
export default FortsettPåSøknad;

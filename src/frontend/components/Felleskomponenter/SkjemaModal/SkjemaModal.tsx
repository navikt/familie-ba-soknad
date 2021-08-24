import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Innholdstittel } from 'nav-frontend-typografi';

import { device } from '../../../Theme';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledModal = styled(Modal)`
    && {
        padding: 2rem;
    }

    width: 45rem;
    @media all and ${device.mobile} {
        width: 95%;
    }
`;

const StyledKnappIModal = styled(Knapp)`
    margin-top: 4rem;
`;
const StyledInnholdstittel = styled(Innholdstittel)`
    text-align: center;
    padding: 2rem;
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
        <StyledModal
            isOpen={erÅpen}
            contentLabel={formatMessage({ id: modalTittelSpråkId })}
            onRequestClose={() => {
                toggleModal();
                onAvbrytCallback && onAvbrytCallback();
            }}
            /* aria-modal blir satt til true så vi trenger ikke å gjøre aria-hidden på appen */
            ariaHideApp={false}
        >
            <form
                onSubmit={event => {
                    event.preventDefault();
                    onSubmitCallback();
                }}
            >
                <StyledInnholdstittel>
                    <SpråkTekst id={modalTittelSpråkId} />
                </StyledInnholdstittel>
                {children}
                <StyledKnappIModal
                    type={valideringErOk() ? 'hoved' : 'standard'}
                    htmlType={'submit'}
                    spinner={submitSpinner}
                    autoDisableVedSpinner={true}
                >
                    <SpråkTekst id={submitKnappSpråkId} />
                </StyledKnappIModal>
            </form>
        </StyledModal>
    );
};

export default SkjemaModal;

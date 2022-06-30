import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import Modal from 'nav-frontend-modal';
import { Innholdstittel } from 'nav-frontend-typografi';

import { Button } from '@navikt/ds-react';

import { device } from '../../../Theme';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledModal = styled(Modal)`
    && {
        padding: 2rem;
    }

    width: 45rem;
    @media all and ${device.mobile} {
        width: 95%;
        && {
            padding: 2rem -100% 2rem -100%;
        }
    }
`;

const StyledKnappIModal = styled(Button)`
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
            <form>
                <StyledInnholdstittel>
                    <SpråkTekst id={modalTittelSpråkId} />
                </StyledInnholdstittel>
                {children}
                <StyledKnappIModal
                    variant={valideringErOk() ? 'primary' : 'secondary'}
                    htmlType={'submit'}
                    spinner={submitSpinner}
                    autoDisableVedSpinner={true}
                    onClick={event => {
                        event.preventDefault();
                        onSubmitCallback();
                    }}
                >
                    <SpråkTekst id={submitKnappSpråkId} />
                </StyledKnappIModal>
            </form>
        </StyledModal>
    );
};

export default SkjemaModal;

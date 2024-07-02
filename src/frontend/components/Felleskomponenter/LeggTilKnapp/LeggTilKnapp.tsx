import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage } from '@navikt/ds-react';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    onClick: () => void | Promise<void>;
    språkTekst: string;
    forklaring?: string;
    feilmelding?: ReactNode;
    id?: string;
}

const StyledButton = styled(Button)`
    && {
        border: ${props => (props.$feilmelding ? `2px solid ${ARed500}` : 'none')};
    }
`;

export const LeggTilKnapp: React.FC<Props> = ({
    onClick,
    språkTekst,
    forklaring,
    feilmelding,
    id,
}) => {
    const { toggles } = useFeatureToggles();

    return (
        <>
            {toggles.NYE_MODAL_TEKSTER && forklaring && <BodyShort spacing>{forklaring}</BodyShort>}
            <StyledButton
                id={id}
                variant={'tertiary'}
                type={'button'}
                onClick={onClick}
                $feilmelding={!!feilmelding}
                icon={<PlusCircleIcon aria-hidden />}
            >
                <SpråkTekst id={språkTekst} />
            </StyledButton>
            {!!feilmelding && <ErrorMessage>{feilmelding}</ErrorMessage>}
        </>
    );
};

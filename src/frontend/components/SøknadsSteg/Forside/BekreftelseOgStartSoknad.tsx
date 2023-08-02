import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { BekreftCheckboksPanel } from 'nav-frontend-skjema';

import { BodyLong, Button } from '@navikt/ds-react';
import { AGreen500, ANavRed, AOrange500 } from '@navikt/ds-tokens/dist/tokens';

import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
`;

const StyledBekreftCheckboksPanel = styled(BekreftCheckboksPanel)<{ status: BekreftelseStatus }>`
    && {
        border: 1px solid ${props => bekreftelseBoksBorderFarge(props.status)};
        padding: 1.5rem;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    }
`;

const StyledButton = styled(Button)`
    && {
        margin: 2.3rem auto 0 auto;
    }
`;

export const bekreftelseBoksBorderFarge = (status: BekreftelseStatus) => {
    switch (status) {
        case BekreftelseStatus.BEKREFTET:
            return AGreen500;
        case BekreftelseStatus.FEIL:
            return ANavRed;
        default:
            return AOrange500;
    }
};

const BekreftelseOgStartSoknad: React.FC = () => {
    const { formatMessage } = useIntl();
    const { onStartSøknad, bekreftelseOnChange, bekreftelseStatus } = useBekreftelseOgStartSoknad();

    return (
        <FormContainer onSubmit={event => onStartSøknad(event)}>
            <Informasjonsbolk tittelId="forside.bekreftelsesboks.tittel">
                <StyledBekreftCheckboksPanel
                    label={formatMessage({ id: 'forside.bekreftelsesboks.erklæring.spm' })}
                    onChange={bekreftelseOnChange}
                    checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                    feil={
                        bekreftelseStatus === BekreftelseStatus.FEIL && (
                            <span role={'alert'}>
                                <SpråkTekst id={'forside.bekreftelsesboks.feilmelding'} />
                            </span>
                        )
                    }
                    status={bekreftelseStatus}
                >
                    <BodyLong>
                        <SpråkTekst id="forside.bekreftelsesboks.brødtekst" />
                    </BodyLong>
                </StyledBekreftCheckboksPanel>
            </Informasjonsbolk>

            <StyledButton
                variant={
                    bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'primary' : 'secondary'
                }
                type={'submit'}
            >
                <SpråkTekst id="forside.start-soknad.knapp" />
            </StyledButton>
        </FormContainer>
    );
};

export default BekreftelseOgStartSoknad;

import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import KnappBase from 'nav-frontend-knapper';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import Informasjonsbolk from '../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../Felleskomponenter/SpråkTekst/SpråkTekst';
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

const StyledKnappBase = styled(KnappBase)`
    margin: 2.3rem auto 0 auto;
`;

export const bekreftelseBoksBorderFarge = (status: BekreftelseStatus) => {
    switch (status) {
        case BekreftelseStatus.BEKREFTET:
            return navFarger.navGronn;
        case BekreftelseStatus.FEIL:
            return navFarger.navRod;
        default:
            return navFarger.navOransje;
    }
};

const BekreftelseOgStartSoknad: React.FC<{
    navn: string;
}> = ({ navn }) => {
    const { formatMessage } = useIntl();
    const { onStartSøknad, bekreftelseOnChange, bekreftelseStatus } = useBekreftelseOgStartSoknad();

    return (
        <FormContainer onSubmit={event => onStartSøknad(event)}>
            <Informasjonsbolk tittelId="forside.bekreftelsesboks.tittel">
                <StyledBekreftCheckboksPanel
                    label={formatMessage({ id: 'forside.bekreftelsesboks.erklæring' }, { navn })}
                    onChange={bekreftelseOnChange}
                    checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                    feil={
                        bekreftelseStatus === BekreftelseStatus.FEIL && (
                            <SpråkTekst id={'forside.bekreftelsesboks.feil'} />
                        )
                    }
                    status={bekreftelseStatus}
                >
                    <Normaltekst>
                        <SpråkTekst id="forside.dokumentasjonskrav.brødtekst" />
                    </Normaltekst>
                </StyledBekreftCheckboksPanel>
            </Informasjonsbolk>

            <StyledKnappBase
                type={bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'hoved' : 'standard'}
                htmlType={'submit'}
            >
                <SpråkTekst id="forside.startsoknad" />
            </StyledKnappBase>
        </FormContainer>
    );
};

export default BekreftelseOgStartSoknad;

import React, { useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import KnappBase from 'nav-frontend-knapper';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import { StegRoutes } from '../../routing/Routes';
import Informasjonsbolk from '../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
`;

const StyledBekreftCheckboksPanel = styled(BekreftCheckboksPanel)<{ status: BekreftelseStatus }>`
    border: 1px solid ${props => bekreftelsesBoksBorderFarge(props.status)};
    padding: 1.5rem;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const StyledKnappBase = styled(KnappBase)`
    margin: 2.3rem auto 0 auto;
`;

export enum BekreftelseStatus {
    NORMAL = 'NORMAL',
    BEKREFTET = 'BEKREFTET',
    FEIL = 'FEIL',
}

const bekreftelsesBoksBorderFarge = (status: BekreftelseStatus) => {
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
    const history = useHistory();

    const [bekreftelseStatus, settBekreftelseStatus] = useState<BekreftelseStatus>(
        BekreftelseStatus.NORMAL
    );

    const onStartSøknad = (event: React.FormEvent) => {
        event.preventDefault();
        if (bekreftelseStatus === BekreftelseStatus.BEKREFTET) {
            history.push(Object.values(StegRoutes)[0].path);
        } else {
            settBekreftelseStatus(BekreftelseStatus.FEIL);
        }
    };

    const bekreftelseOnChange = () => {
        settBekreftelseStatus(prevState => {
            return prevState !== BekreftelseStatus.BEKREFTET
                ? BekreftelseStatus.BEKREFTET
                : BekreftelseStatus.NORMAL;
        });
    };

    return (
        <FormContainer onSubmit={event => onStartSøknad(event)}>
            <Informasjonsbolk tittelId="forside.bekreftelsesboks.tittel">
                <StyledBekreftCheckboksPanel
                    label={formatMessage({ id: 'forside.bekreftelsesboks.erklæring' }, { navn })}
                    onChange={bekreftelseOnChange}
                    checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                    feil={
                        bekreftelseStatus === BekreftelseStatus.FEIL && (
                            <FormattedMessage id={'forside.bekreftelsesboks.feil'} />
                        )
                    }
                    status={bekreftelseStatus}
                >
                    <Normaltekst>
                        <FormattedMessage id="forside.dokumentasjonskrav.brødtekst" />
                    </Normaltekst>
                </StyledBekreftCheckboksPanel>
            </Informasjonsbolk>

            <StyledKnappBase
                type={bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'hoved' : 'standard'}
                htmlType={'submit'}
            >
                <FormattedMessage id="forside.startsoknad" />
            </StyledKnappBase>
        </FormContainer>
    );
};

export default BekreftelseOgStartSoknad;

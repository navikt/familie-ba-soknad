import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import Informasjonsbolk from '../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import { BekreftelseStatus } from './Forside';

const StyledBekreftCheckboksPanel = styled(BekreftCheckboksPanel)<{ status: BekreftelseStatus }>`
    border: 1px solid ${props => bekreftelsesBoksBorderFarge(props.status)};
    padding: 1.5rem;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

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

const BekreftelsePanel: React.FC<{
    navn: string;
    bekreftelseStatus: BekreftelseStatus;
    onChange: () => void;
}> = ({ navn, bekreftelseStatus, onChange }) => {
    const { formatMessage } = useIntl();

    return (
        <Informasjonsbolk tittelId="forside.bekreftelsesboks.tittel">
            <StyledBekreftCheckboksPanel
                label={formatMessage({ id: 'forside.bekreftelsesboks.erklæring' }, { navn })}
                onChange={onChange}
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
    );
};

export default BekreftelsePanel;

import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import KnappBase from 'nav-frontend-knapper';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';

import { hentNesteRoute, IRoute, Routes } from '../../routing/Routes';
import { ILokasjon } from '../../typer/lokasjon';
import Informasjonsbolk from '../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../Felleskomponenter/SpråkTekst/SpråkTekst';

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

export enum BekreftelseStatus {
    NORMAL = 'NORMAL',
    BEKREFTET = 'BEKREFTET',
    FEIL = 'FEIL',
}

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
    const history = useHistory();
    const location = useLocation<ILokasjon>();

    const [bekreftelseStatus, settBekreftelseStatus] = useState<BekreftelseStatus>(
        BekreftelseStatus.NORMAL
    );
    const nesteRoute: IRoute = hentNesteRoute(Routes, location.pathname);

    const onStartSøknad = (event: React.FormEvent) => {
        event.preventDefault();
        if (bekreftelseStatus === BekreftelseStatus.BEKREFTET) {
            history.push(nesteRoute.path);
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

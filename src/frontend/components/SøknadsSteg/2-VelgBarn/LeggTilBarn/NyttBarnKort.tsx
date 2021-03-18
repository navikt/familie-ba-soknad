import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import AlertStripe from 'nav-frontend-alertstriper';
import navFarger from 'nav-frontend-core';
import { guid } from 'nav-frontend-js-utils';
import { Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Input } from 'nav-frontend-skjema';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';

import { ESvar, JaNeiSpørsmål } from '@navikt/familie-form-elements';

import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { useLeggTilBarn } from './useLeggTilBarn';

const LeggTilBarnKortWrapper = styled.div`
    width: 17.25rem;
    padding: 0.625rem;
`;
const Informasjonsboks = styled.div`
    padding: 2rem;
    border-radius: 0.3rem;
    background-color: ${navFarger.navLysGra};
`;

const StyledIngress = styled(Ingress)`
    && {
        font-size: 1rem;
        font-weight: 600;
    }
`;

const StyledSystemtittel = styled(Systemtittel)`
    text-align: center;
    padding: 2rem;
`;

const StyledKnapp = styled(Knapp)`
    margin-top: 1rem;
`;

const StyledKnappIModal = styled(Knapp)`
    margin-top: 4rem;
`;

const StyledModal = styled(Modal)`
    && {
        padding: 2rem;
        width: 80vw;
    }
`;

const StyledInput = styled(Input)`
    @media all and (min-device-width: 992px) {
        max-width: 30rem;
    }
`;

export const NyttBarnKort: React.FC = () => {
    const [modalÅpen, settModalÅpen] = useState<boolean>(false);
    const { skjema, validerFelterOgVisFeilmelding } = useLeggTilBarn();
    const intl = useIntl();

    return (
        <>
            <StyledModal
                isOpen={modalÅpen}
                contentLabel={intl.formatMessage({ id: 'leggtilbarn.popup.label' })}
                onRequestClose={() => settModalÅpen(!modalÅpen)}
            >
                <StyledSystemtittel>
                    <SpråkTekst id={'leggtilbarn.tittel'} />
                </StyledSystemtittel>
                <JaNeiSpørsmål
                    {...skjema.felter.erFødt.hentNavInputProps(false)}
                    legend={<SpråkTekst id={'leggtilbarn.er-barnet-født'} />}
                    name={guid()}
                    labelTekstForJaNei={{
                        ja: <SpråkTekst id={'ja'} />,
                        nei: <SpråkTekst id={'nei'} />,
                    }}
                />
                {skjema.felter.erFødt.verdi === ESvar.NEI && (
                    <AlertStripe type={'advarsel'} form={'inline'}>
                        <SpråkTekst id={'leggtilbarn.feil.må-være-født'} />
                    </AlertStripe>
                )}

                {skjema.felter.navn.erSynlig && (
                    <Input
                        {...skjema.felter.navn.hentNavInputProps(skjema.visFeilmeldinger)}
                        label={<SpråkTekst id={'leggtibarn.barnets-navn'} />}
                    />
                )}

                {skjema.felter.ident.erSynlig && (
                    <StyledInput
                        {...skjema.felter.ident.hentNavInputProps(skjema.visFeilmeldinger)}
                        label={<SpråkTekst id={'leggtilbarn.fødselsnummer'} />}
                    />
                )}

                <StyledKnappIModal onClick={validerFelterOgVisFeilmelding}>
                    <SpråkTekst id={'leggtilbarn.tittel'} />
                </StyledKnappIModal>
            </StyledModal>
            <LeggTilBarnKortWrapper>
                <Informasjonsboks>
                    <StyledIngress>
                        Har du nylig fått barn, eller har du fosterbarn som foreløpig ikke er
                        registrert i Folkeregisteret?
                    </StyledIngress>
                    <StyledKnapp
                        onClick={event => {
                            event.preventDefault();
                            settModalÅpen(!modalÅpen);
                        }}
                    >
                        <SpråkTekst id={'leggtilbarn.tittel'} />
                    </StyledKnapp>
                </Informasjonsboks>
            </LeggTilBarnKortWrapper>
        </>
    );
};

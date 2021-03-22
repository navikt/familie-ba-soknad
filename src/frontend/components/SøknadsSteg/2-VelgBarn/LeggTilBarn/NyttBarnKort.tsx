import React, { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import AlertStripe from 'nav-frontend-alertstriper';
import navFarger from 'nav-frontend-core';
import { Knapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import Modal from 'nav-frontend-modal';
import { Checkbox, Input, SkjemaGruppe } from 'nav-frontend-skjema';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { device } from '../../../../Theme';
import JaNeiSpm from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
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

const StyledInnholdstittel = styled(Innholdstittel)`
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
    }
    width: 45rem;
    min-height: 35rem;
    @media all and ${device.mobile} {
        width: 95%;
    }
`;

const StyledInput = styled(Input)`
    @media all and ${device.tablet} {
        max-width: 30rem;
    }
`;

const StyledLenke = styled(Lenke)`
    display: block;
    margin-top: 1rem;
`;

export const NyttBarnKort: React.FC = () => {
    const [modalÅpen, settModalÅpen] = useState<boolean>(false);
    const { skjema, nullstillSkjema, valideringErOk, submit } = useLeggTilBarn();
    const { navn, navnetErUbestemt } = skjema.felter;
    const intl = useIntl();

    useEffect(() => {
        navn.validerOgSettFelt('');
    }, [navnetErUbestemt.verdi]);

    const submitOgLukk = () => {
        submit() && settModalÅpen(false);
    };

    return (
        <>
            <StyledModal
                isOpen={modalÅpen}
                contentLabel={intl.formatMessage({ id: 'leggtilbarn.popup.label' })}
                onRequestClose={() => {
                    settModalÅpen(!modalÅpen);
                    nullstillSkjema();
                }}
            >
                <StyledInnholdstittel>
                    <SpråkTekst id={'leggtilbarn.tittel'} />
                </StyledInnholdstittel>
                <SkjemaGruppe>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.erFødt}
                        spørsmålTekstId={'leggtilbarn.er-barnet-født'}
                    />
                    {skjema.felter.erFødt.verdi === ESvar.NEI && (
                        <AlertStripe type={'advarsel'} form={'inline'}>
                            <SpråkTekst id={'leggtilbarn.feil.må-være-født'} />
                        </AlertStripe>
                    )}
                </SkjemaGruppe>

                <SkjemaGruppe>
                    {skjema.felter.navn.erSynlig && (
                        <Input
                            {...skjema.felter.navn.hentNavInputProps(skjema.visFeilmeldinger)}
                            label={<SpråkTekst id={'leggtilbarn.barnets-navn'} />}
                            disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                        />
                    )}

                    {skjema.felter.navnetErUbestemt.erSynlig && (
                        <Checkbox
                            {...skjema.felter.navnetErUbestemt.hentNavInputProps(
                                skjema.visFeilmeldinger
                            )}
                            label={<SpråkTekst id={'leggtilbarn.navn-ubestemt.label'} />}
                            onChange={event => {
                                const {
                                    onChange,
                                } = skjema.felter.navnetErUbestemt.hentNavInputProps(false);
                                onChange(event.target.checked ? ESvar.JA : ESvar.NEI);
                            }}
                        />
                    )}
                </SkjemaGruppe>

                <SkjemaGruppe>
                    {skjema.felter.ident.erSynlig && (
                        <StyledInput
                            {...skjema.felter.ident.hentNavInputProps(skjema.visFeilmeldinger)}
                            label={<SpråkTekst id={'leggtilbarn.fødselsnummer'} />}
                            disabled={skjema.felter.harBarnetFåttIdNummer.verdi === ESvar.NEI}
                        />
                    )}

                    {skjema.felter.harBarnetFåttIdNummer.erSynlig && (
                        <Checkbox
                            {...skjema.felter.harBarnetFåttIdNummer.hentNavInputProps(false)}
                            label={<SpråkTekst id={'leggtilbarn.ingen-ident.label'} />}
                            onChange={event => {
                                const {
                                    onChange,
                                } = skjema.felter.harBarnetFåttIdNummer.hentNavInputProps(false);
                                onChange(event.target.checked ? ESvar.NEI : ESvar.JA);
                            }}
                        />
                    )}
                    {skjema.felter.harBarnetFåttIdNummer.verdi === ESvar.NEI && (
                        <>
                            <AlertStripe type={'advarsel'} form={'inline'}>
                                <SpråkTekst id={'leggtilbarn.feil.må-ha-idnr'} />
                            </AlertStripe>

                            <StyledLenke
                                href={intl.formatMessage({
                                    id: 'personopplysninger.lenke.pdfskjema',
                                })}
                            >
                                <SpråkTekst id={'leggtilbarn.pdfskjema.lenke.tekst'} />
                            </StyledLenke>
                        </>
                    )}
                </SkjemaGruppe>

                <StyledKnappIModal
                    onClick={submitOgLukk}
                    type={valideringErOk() ? 'hoved' : 'standard'}
                >
                    <SpråkTekst id={'leggtilbarn.tittel'} />
                </StyledKnappIModal>
            </StyledModal>
            <LeggTilBarnKortWrapper>
                <Informasjonsboks>
                    <StyledIngress>
                        <SpråkTekst id={'leggtilbarn.kort.info'} />
                    </StyledIngress>
                    <StyledKnapp htmlType={'button'} onClick={() => settModalÅpen(!modalÅpen)}>
                        <SpråkTekst id={'leggtilbarn.tittel'} />
                    </StyledKnapp>
                </Informasjonsboks>
            </LeggTilBarnKortWrapper>
        </>
    );
};

import React, { useEffect, useState } from 'react';

import styled from 'styled-components/macro';

import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import Modal from 'nav-frontend-modal';
import { Checkbox, Input, SkjemaGruppe } from 'nav-frontend-skjema';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { device } from '../../../../Theme';
import JaNeiSpm from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { StyledBarnekort } from '../Barnekort/Barnekort';
import { useLeggTilBarn } from './useLeggTilBarn';

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
    width: 100%;
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
    const { fornavn, etternavn, navnetErUbestemt, harBarnetFåttIdNummer } = skjema.felter;

    useEffect(() => {
        fornavn.validerOgSettFelt('');
        etternavn.validerOgSettFelt('');
    }, [navnetErUbestemt.verdi]);

    /**
     * Søker vil ikke nødvendigvis interacte med disse feltene siden de er valgfrie
     * checkboxer, derfor må vi sørge for at de får valideringsstatus satt med en gang.
     *
     * Feltene har erFødt som avhengighet, og siden feltavhengigheter er med i avhengighetene
     * til useMemo i useFelt-hooken vil useFelt reinitialisere feltene når søker velger
     * ja eller nei på spørsmål om barnet er født eller ikke. Dermed må vi tvinge
     * valideringsstatus hver gang erFødt endrer verdi. I tillegg er det en intern useEffect
     * i useFelt-hooken som nullstiller felter når de endrer synlighet. Altså:
     *
     * erFødt endrer seg fra undefined til ja
     *  -> useMemo får nytt kall inni useFelt med nye inputs, regenererer feltet
     *      -> harBarnetFåttIdNummer/navnetErUbestemt nullstilles og settes til synlig
     *          -> Disse effektene tvinger valideringsstatus til å settes
     *
     * Det er fristende å sette erFødt som dependency for disse effektene, men det går ikke
     * siden den interne useEffecten nullstiller til initiell FeltState, som innebærer
     * valideringsstatus satt til IKKE_VALIDERT.
     */
    useEffect(() => {
        harBarnetFåttIdNummer.validerOgSettFelt(ESvar.JA);
    }, [harBarnetFåttIdNummer.erSynlig]);

    useEffect(() => {
        navnetErUbestemt.validerOgSettFelt(ESvar.NEI);
    }, [navnetErUbestemt.erSynlig]);

    const submitOgLukk = () => {
        submit() && settModalÅpen(false);
    };

    const skalViseIdentFeil =
        skjema.visFeilmeldinger && skjema.felter.harBarnetFåttIdNummer.verdi !== ESvar.NEI;

    return (
        <>
            <StyledModal
                isOpen={modalÅpen}
                contentLabel={'hvilkebarn.leggtilbarn.modal.tittel'}
                onRequestClose={() => {
                    settModalÅpen(!modalÅpen);
                    nullstillSkjema();
                }}
            >
                <StyledInnholdstittel>
                    <SpråkTekst id={'hvilkebarn.leggtilbarn.modal.tittel'} />
                </StyledInnholdstittel>
                <SkjemaGruppe>
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.erFødt}
                        spørsmålTekstId={'hvilkebarn.leggtilbarn.barnfødt.spm'}
                    />
                    {skjema.felter.erFødt.verdi === ESvar.NEI && (
                        <AlertStripe type={'advarsel'} form={'inline'}>
                            <SpråkTekst id={'hvilkebarn.leggtilbarn.barndfødt.ikke-født.alert'} />
                        </AlertStripe>
                    )}
                </SkjemaGruppe>

                <SkjemaGruppe>
                    {fornavn.erSynlig && (
                        <Input
                            {...skjema.felter.fornavn.hentNavInputProps(skjema.visFeilmeldinger)}
                            label={<SpråkTekst id={'hvilkebarn.leggtilbarn.fornavn'} />}
                            disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                        />
                    )}

                    {etternavn.erSynlig && (
                        <Input
                            {...skjema.felter.etternavn.hentNavInputProps(skjema.visFeilmeldinger)}
                            label={<SpråkTekst id={'hvilkebarn.leggtilbarn.etternavn'} />}
                            disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                        />
                    )}

                    {navnetErUbestemt.erSynlig && (
                        <Checkbox
                            {...skjema.felter.navnetErUbestemt.hentNavInputProps(
                                skjema.visFeilmeldinger
                            )}
                            label={
                                <SpråkTekst id={'hvilkebarn.leggtilbarn.navn-ikke-bestemt.spm'} />
                            }
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
                            {...skjema.felter.ident.hentNavInputProps(skalViseIdentFeil)}
                            label={<SpråkTekst id={'hvilkebarn.leggtilbarn.fnr.spm'} />}
                            disabled={skjema.felter.harBarnetFåttIdNummer.verdi === ESvar.NEI}
                        />
                    )}

                    {skjema.felter.harBarnetFåttIdNummer.erSynlig && (
                        <Checkbox
                            {...skjema.felter.harBarnetFåttIdNummer.hentNavInputProps(false)}
                            label={<SpråkTekst id={'hvilkebarn.leggtilbarn.ikke-fått-fnr.spm'} />}
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
                                <SpråkTekst id={'hvilkebarn.leggtilbarn.ikke-fått-fnr.alert'} />
                            </AlertStripe>

                            <StyledLenke href={'#'}>
                                <SpråkTekst id={'felles.bruk-pdfskjema.lenketekst'} />
                            </StyledLenke>
                        </>
                    )}
                </SkjemaGruppe>

                <StyledKnappIModal
                    onClick={submitOgLukk}
                    type={valideringErOk() ? 'hoved' : 'standard'}
                >
                    <SpråkTekst id={'hvilkebarn.leggtilbarn.kort.knapp'} />
                </StyledKnappIModal>
            </StyledModal>
            <StyledBarnekort>
                <StyledIngress>
                    <SpråkTekst id={'hvilkebarn.leggtilbarn.kort'} />
                </StyledIngress>
                <StyledKnapp htmlType={'button'} onClick={() => settModalÅpen(!modalÅpen)}>
                    <SpråkTekst id={'hvilkebarn.leggtilbarn.kort.knapp'} />
                </StyledKnapp>
            </StyledBarnekort>
        </>
    );
};

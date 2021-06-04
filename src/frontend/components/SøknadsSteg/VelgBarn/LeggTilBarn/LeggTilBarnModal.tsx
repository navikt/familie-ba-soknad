import React, { useEffect, useState } from 'react';

import styled from 'styled-components/macro';

import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Checkbox, Input, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element, Feilmelding, Innholdstittel } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { device } from '../../../../Theme';
import JaNeiSpm from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { SøkerMåBrukePDF } from '../../../Felleskomponenter/SøkerMåBrukePDF';
import { useLeggTilBarn } from './useLeggTilBarn';

const StyledInnholdstittel = styled(Innholdstittel)`
    text-align: center;
    padding: 2rem;
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

const LeggTilBarnModal: React.FC<{
    modalÅpen: boolean;
    settModalÅpen: (åpen: boolean) => void;
}> = ({ modalÅpen, settModalÅpen }) => {
    const {
        skjema,
        nullstillSkjema,
        valideringErOk,
        submit,
        forsøkerBarnMedAdressebeskyttelse,
    } = useLeggTilBarn();
    const { fornavn, etternavn, navnetErUbestemt, harBarnetFåttIdNummer } = skjema.felter;
    const [venterPåLeggTil, settVenterPåLeggTil] = useState(false);

    const submitOgLukk = async event => {
        event.preventDefault();
        settVenterPåLeggTil(true);
        const success = await submit();
        settVenterPåLeggTil(false);
        success && settModalÅpen(false);
    };

    const skalViseIdentFeil =
        skjema.visFeilmeldinger && skjema.felter.harBarnetFåttIdNummer.verdi !== ESvar.NEI;

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

    return (
        <StyledModal
            isOpen={modalÅpen}
            contentLabel={'hvilkebarn.leggtilbarn.modal.tittel'}
            onRequestClose={() => {
                settModalÅpen(!modalÅpen);
                nullstillSkjema();
            }}
        >
            <form onSubmit={event => submitOgLukk(event)} autoComplete="off">
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
                {skjema.felter.erFødt.valideringsstatus === Valideringsstatus.OK && (
                    <span aria-live={'polite'}>
                        <SkjemaGruppe
                            legend={
                                <Element>
                                    <SpråkTekst id={'hvilkebarn.leggtilbarn.barnets-navn'} />
                                </Element>
                            }
                        >
                            <Input
                                {...skjema.felter.fornavn.hentNavInputProps(
                                    skjema.visFeilmeldinger
                                )}
                                label={<SpråkTekst id={'hvilkebarn.leggtilbarn.fornavn.spm'} />}
                                disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                                autoComplete={'none'}
                                maxLength={500}
                            />

                            <Input
                                {...skjema.felter.etternavn.hentNavInputProps(
                                    skjema.visFeilmeldinger
                                )}
                                label={<SpråkTekst id={'hvilkebarn.leggtilbarn.etternavn.spm'} />}
                                disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                                autoComplete={'none'}
                                maxLength={500}
                            />

                            <Checkbox
                                {...skjema.felter.navnetErUbestemt.hentNavInputProps(
                                    skjema.visFeilmeldinger
                                )}
                                label={
                                    <SpråkTekst
                                        id={'hvilkebarn.leggtilbarn.navn-ikke-bestemt.spm'}
                                    />
                                }
                                onChange={event => {
                                    const {
                                        onChange,
                                    } = skjema.felter.navnetErUbestemt.hentNavInputProps(false);
                                    onChange(event.target.checked ? ESvar.JA : ESvar.NEI);
                                }}
                            />
                        </SkjemaGruppe>

                        <SkjemaGruppe>
                            {skjema.felter.ident.erSynlig && (
                                <StyledInput
                                    {...skjema.felter.ident.hentNavInputProps(skalViseIdentFeil)}
                                    feil={
                                        forsøkerBarnMedAdressebeskyttelse ? (
                                            <Feilmelding>
                                                <SpråkTekst
                                                    id={'hvilkebarn.adressesperreinformasjon'}
                                                />
                                            </Feilmelding>
                                        ) : (
                                            skjema.felter.ident.hentNavInputProps(skalViseIdentFeil)
                                                .feil
                                        )
                                    }
                                    label={<SpråkTekst id={'felles.fødsels-eller-dnummer.label'} />}
                                    disabled={
                                        skjema.felter.harBarnetFåttIdNummer.verdi === ESvar.NEI
                                    }
                                    autoComplete={'none'}
                                />
                            )}

                            {skjema.felter.harBarnetFåttIdNummer.erSynlig && (
                                <Checkbox
                                    {...skjema.felter.harBarnetFåttIdNummer.hentNavInputProps(
                                        false
                                    )}
                                    label={
                                        <SpråkTekst
                                            id={'hvilkebarn.leggtilbarn.ikke-fått-fnr.spm'}
                                        />
                                    }
                                    onChange={event => {
                                        const {
                                            onChange,
                                        } = skjema.felter.harBarnetFåttIdNummer.hentNavInputProps(
                                            false
                                        );
                                        onChange(event.target.checked ? ESvar.NEI : ESvar.JA);
                                    }}
                                />
                            )}
                            {skjema.felter.harBarnetFåttIdNummer.verdi === ESvar.NEI && (
                                <SøkerMåBrukePDF
                                    advarselTekstId={'hvilkebarn.leggtilbarn.ikke-fått-fnr.alert'}
                                />
                            )}
                        </SkjemaGruppe>
                    </span>
                )}

                <StyledKnappIModal
                    type={valideringErOk() ? 'hoved' : 'standard'}
                    htmlType={'submit'}
                    spinner={venterPåLeggTil}
                    autoDisableVedSpinner={true}
                >
                    <SpråkTekst id={'hvilkebarn.leggtilbarn.kort.knapp'} />
                </StyledKnappIModal>
            </form>
        </StyledModal>
    );
};

export default LeggTilBarnModal;

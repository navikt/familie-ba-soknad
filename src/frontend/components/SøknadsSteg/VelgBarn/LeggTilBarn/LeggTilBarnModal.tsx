import React, { useEffect, useState } from 'react';

import styled from 'styled-components/macro';

import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Input, SkjemaGruppe } from 'nav-frontend-skjema';
import { Element, Feilmelding, Innholdstittel } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { device } from '../../../../Theme';
import JaNeiSpm from '../../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import { SkjemaCheckbox } from '../../../Felleskomponenter/SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeltInput } from '../../../Felleskomponenter/SkjemaFeltInput/SkjemaFeltInput';
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
    @media all and ${device.mobile} {
        width: 95%;
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

    const identInputProps = skjema.felter.ident.hentNavInputProps(skalViseIdentFeil);

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
            /* aria-modal blir satt til true så vi trenger ikke å gjøre aria-hidden på appen */
            ariaHideApp={false}
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
                            <SkjemaFeltInput
                                felt={skjema.felter.fornavn}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                labelSpråkTekstId={'hvilkebarn.leggtilbarn.fornavn.spm'}
                                disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                            />

                            <SkjemaFeltInput
                                felt={skjema.felter.etternavn}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                labelSpråkTekstId={'hvilkebarn.leggtilbarn.etternavn.spm'}
                                disabled={skjema.felter.navnetErUbestemt.verdi === ESvar.JA}
                            />

                            <SkjemaCheckbox
                                felt={skjema.felter.navnetErUbestemt}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                labelSpråkTekstId={'hvilkebarn.leggtilbarn.navn-ikke-bestemt.spm'}
                            />
                        </SkjemaGruppe>

                        <SkjemaGruppe>
                            {skjema.felter.ident.erSynlig && (
                                <Input
                                    {...identInputProps}
                                    feil={
                                        forsøkerBarnMedAdressebeskyttelse ? (
                                            <Feilmelding>
                                                <SpråkTekst
                                                    id={'hvilkebarn.adressesperreinformasjon'}
                                                />
                                            </Feilmelding>
                                        ) : (
                                            identInputProps.feil
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
                                <SkjemaCheckbox
                                    felt={skjema.felter.harBarnetFåttIdNummer}
                                    visFeilmeldinger={false}
                                    labelSpråkTekstId={'hvilkebarn.leggtilbarn.ikke-fått-fnr.spm'}
                                    invers={true}
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

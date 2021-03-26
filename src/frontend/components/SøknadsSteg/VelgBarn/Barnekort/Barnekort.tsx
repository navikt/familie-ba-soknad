import React, { ReactNode } from 'react';

import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { Checkbox } from 'nav-frontend-skjema';
import { Ingress, Normaltekst, Undertittel } from 'nav-frontend-typografi';

import barn1 from '../../../../assets/barn1.svg';
import barn2 from '../../../../assets/barn2.svg';
import barn3 from '../../../../assets/barn3.svg';
import { useApp } from '../../../../context/AppContext';
import { device } from '../../../../Theme';
import { IBarnFraPdl } from '../../../../typer/person';
import { hentTilfeldigElement } from '../../../../utils/hjelpefunksjoner';
import { hentAlder } from '../../../../utils/person';
import { formaterFnr } from '../../../../utils/visning';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface IBarnekortProps {
    settMedISøknad: (ident: string, skalVæreMed: boolean) => void;
    barnFraPdl: IBarnFraPdl;
}

export const StyledBarnekort = styled.div`
    position: relative;
    border-radius: 0.3rem;
    max-width: calc(16.3rem - 0.3rem * 2);
    padding: 2rem;
    background-color: ${navFarger.navLysGra};
    margin: 0.3rem;
    @media all and ${device.mobile} {
        width: 100%;
    }
`;

const LeggTilBarnCheckbox = styled(Checkbox)`
    margin-top: 2.75rem;
`;

const InformasjonsboksInnhold = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 8rem;
`;

const BarnekortHeader = styled.div`
    height: 8rem;
    background-color: ${navFarger.navLillaDarken60};
    border-bottom: 0.25rem solid ${navFarger.navLillaLighten20};
    border-radius: 0.3rem 0.3rem 0 0;
    display: flex;
    align-items: flex-end;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    > img {
        display: block;
        margin: 0 auto;
    }
`;

const StyledUndertittel = styled(Undertittel)`
    text-transform: uppercase;
    && {
        font-weight: 700;
    }
`;

const StyledIngress = styled(Ingress)`
    && {
        font-size: 1rem;
        margin-top: 1rem;
        font-weight: 600;
    }
`;

const Barnekort: React.FC<IBarnekortProps> = ({ barnFraPdl, settMedISøknad }) => {
    const { søknad } = useApp();
    const ikoner = [barn1, barn2, barn3];

    const medISøknad = !!søknad.barnInkludertISøknaden.find(
        barn => barn.ident === barnFraPdl.ident
    );

    return (
        <StyledBarnekort>
            <BarnekortHeader>
                <img alt="barn" src={hentTilfeldigElement(ikoner)} />
            </BarnekortHeader>
            <InformasjonsboksInnhold>
                <StyledUndertittel>{barnFraPdl.navn}</StyledUndertittel>
                <BarneKortInfo
                    labelId={'velgbarn.fødselsnummer.label'}
                    verdi={formaterFnr(barnFraPdl.ident)}
                />
                <BarneKortInfo
                    labelId={'velgbarn.alder.label'}
                    verdi={hentAlder(barnFraPdl.fødselsdato)}
                />
                {barnFraPdl.borMedSøker !== undefined && (
                    <BarneKortInfo
                        labelId={'velgbarn.bosted.label'}
                        verdi={
                            <SpråkTekst
                                id={
                                    barnFraPdl.borMedSøker
                                        ? 'velgbarn.bosted.registrert-på-adressen-din'
                                        : 'velgbarn.bosted.annen-adresse'
                                }
                            />
                        }
                    />
                )}
                <LeggTilBarnCheckbox
                    label={<SpråkTekst id={'velgbarn.checkboxtekst'} />}
                    onClick={() => settMedISøknad(barnFraPdl.ident, !medISøknad)}
                />
            </InformasjonsboksInnhold>
        </StyledBarnekort>
    );
};

const BarneKortInfo: React.FC<{ labelId: string; verdi: ReactNode }> = ({ labelId, verdi }) => {
    return (
        <div>
            <StyledIngress>
                <SpråkTekst id={labelId} />
            </StyledIngress>
            <Normaltekst>{verdi}</Normaltekst>
        </div>
    );
};

export default Barnekort;

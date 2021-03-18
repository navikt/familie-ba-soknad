import React, { ReactNode } from 'react';

import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { Checkbox } from 'nav-frontend-skjema';
import { Ingress, Normaltekst, Undertittel } from 'nav-frontend-typografi';

import barn1 from '../../../../assets/barn1.svg';
import barn2 from '../../../../assets/barn2.svg';
import barn3 from '../../../../assets/barn3.svg';
import { useApp } from '../../../../context/AppContext';
import { IBarnNy } from '../../../../typer/person';
import { hentTilfeldigElement } from '../../../../utils/hjelpefunksjoner';
import { formaterFnr } from '../../../../utils/visning';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledBarnekort = styled.div`
    padding: 0.625rem;
    width: 17.25rem;
`;

const LeggTilBarnCheckbox = styled(Checkbox)`
    margin-top: 2.75rem;
`;

const InformasjonsboksInnhold = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;

const Informasjonsboks = styled.div`
    padding: 2rem;
    border-bottom-left-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
    background-color: ${navFarger.navLysGra};
`;

const BarnekortHeader = styled.div`
    box-sizing: border-box;
    height: 8rem;
    background-color: ${navFarger.navLillaDarken60};
    border-top-right-radius: 0.3rem;
    border-top-left-radius: 0.3rem;
    border-bottom: 0.25rem solid ${navFarger.navLillaLighten20};
    display: flex;
    align-items: flex-end;
    > img {
        display: block;
        margin: 0 auto;
    }
`;

interface IBarnekortProps extends IBarnNy {
    settMedISøknad: (ident: string, skalVæreMed: boolean) => void;
}

const StyledUndertittel = styled(Undertittel)`
    text-transform: uppercase;
    && {
        font-weight: 700;
    }
`;

const StyledIngress = styled(Ingress)`
    && {
        font-size: 1.125rem; // Overstyr mixin som mener den skal være samme som undertittel på stor skjerm
        margin-top: 1rem;
        font-weight: 600;
    }
`;

const Barnekort: React.FC<IBarnekortProps> = props => {
    const { søknad } = useApp();
    const ikoner = [barn1, barn2, barn3];
    const { ident, borMedSøker, alder, navn, settMedISøknad } = props;

    const medISøknad = !!søknad.barn.find(barn => barn.ident === ident);

    return (
        <StyledBarnekort>
            <BarnekortHeader>
                <img alt="barn" src={hentTilfeldigElement(ikoner)} />
            </BarnekortHeader>
            <Informasjonsboks>
                <InformasjonsboksInnhold>
                    <StyledUndertittel>{navn}</StyledUndertittel>
                    <BarneKortInfo
                        labelId={'velgbarn.fødselsnummer.label'}
                        verdi={formaterFnr(ident)}
                    />
                    <BarneKortInfo labelId={'velgbarn.alder.label'} verdi={alder} />
                    <BarneKortInfo
                        labelId={'velgbarn.bosted.label'}
                        verdi={
                            <SpråkTekst
                                id={
                                    borMedSøker
                                        ? 'velgbarn.bosted.registrert-på-adressen-din'
                                        : 'velgbarn.bosted.annen-adresse'
                                }
                            />
                        }
                    />
                    <LeggTilBarnCheckbox
                        label={<SpråkTekst id={'velgbarn.checkboxtekst'} />}
                        onClick={() => settMedISøknad(ident, !medISøknad)}
                    />
                </InformasjonsboksInnhold>
            </Informasjonsboks>
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

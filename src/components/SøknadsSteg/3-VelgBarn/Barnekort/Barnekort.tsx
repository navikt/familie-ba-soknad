import React from 'react';

import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { EtikettSuksess } from 'nav-frontend-etiketter';
import { Knapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import barn1 from '../../../../assets/barn1.svg';
import barn2 from '../../../../assets/barn2.svg';
import barn3 from '../../../../assets/barn3.svg';
import { useApp } from '../../../../context/AppContext';
import { IBarn, ISøknadsfelt } from '../../../../typer/søknad';
import { hentTilfeldigElement } from '../../../../utils/hjelpefunksjoner';

const StyledBarnekort = styled.div`
    padding: 0.625rem;
    height: 27.5rem;
    width: 17.25rem;
`;

const LeggTilBarnKnapp = styled(Knapp)`
    margin-top: 2.75rem;
`;

const KnappeContainer = styled.div`
    margin-top: 1rem;
    height: 5rem;
`;

const FjernBarnLenke = styled(Lenke)`
    margin-top: 1rem;
    margin-left: 3rem;
    margin-right: 3rem;
    display: block;
`;

const InformasjonsboksInnhold = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;

const Informasjonsboks = styled.div`
    text-align: center;
    height: 70%;
    border-bottom-left-radius: 0.3rem;
    border-bottom-right-radius: 0.3rem;
    background-color: ${navFarger.navLysGra};
`;

const BarnekortHeader = styled.div`
    box-sizing: border-box;
    height: 30%;
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

const Barnekort: React.FC<IBarn> = ({ navn, ident, alder, borMedSøker, medISøknad }) => {
    const { søknad, settSøknad } = useApp();
    const ikoner = [barn1, barn2, barn3];

    function settMedISøknad(erMed: boolean) {
        settSøknad({
            ...søknad,
            barn: {
                label: søknad.barn.label,
                verdi: søknad.barn.verdi.map(barn =>
                    barn.verdi.ident === ident
                        ? {
                              ...barn,
                              verdi: {
                                  ...barn.verdi,
                                  medISøknad: { ...barn.verdi.medISøknad, verdi: erMed },
                              },
                          }
                        : barn
                ),
            },
        });
    }

    function fjernBarnFraSøknad() {
        settMedISøknad(false);
    }

    function leggTilBarnISøknad() {
        settMedISøknad(true);
    }

    return (
        <StyledBarnekort>
            <BarnekortHeader>
                <img alt="barn" src={hentTilfeldigElement(ikoner)} />
            </BarnekortHeader>
            <Informasjonsboks>
                <InformasjonsboksInnhold>
                    <Element>{navn.verdi}</Element>
                    <BarneKortInfo {...ident} />
                    <BarneKortInfo {...alder} />
                    <BarneKortInfo {...borMedSøker} />
                    <KnappeContainer>
                        {!medISøknad.verdi && (
                            <LeggTilBarnKnapp mini onClick={leggTilBarnISøknad}>
                                Legg til i søknad
                            </LeggTilBarnKnapp>
                        )}
                        {medISøknad.verdi && (
                            <>
                                <EtikettSuksess>Med i søknaden</EtikettSuksess>
                                <FjernBarnLenke href={'#'} onClick={fjernBarnFraSøknad}>
                                    <Normaltekst>Fjern fra søknad</Normaltekst>
                                </FjernBarnLenke>
                            </>
                        )}
                    </KnappeContainer>
                </InformasjonsboksInnhold>
            </Informasjonsboks>
        </StyledBarnekort>
    );
};

// eslint-disable-next-line
const BarneKortInfo: React.FC<ISøknadsfelt<any>> = ({ label, verdi }) => {
    return (
        <div>
            <Normaltekst>{label.toLocaleUpperCase()}</Normaltekst>
            <Normaltekst>{verdi}</Normaltekst>
        </div>
    );
};

export default Barnekort;

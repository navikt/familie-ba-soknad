import React, { ReactNode } from 'react';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { Checkbox } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import barn1 from '../../../../assets/barn1.svg';
import barn2 from '../../../../assets/barn2.svg';
import barn3 from '../../../../assets/barn3.svg';
import { useApp } from '../../../../context/AppContext';
import { IBarnNy } from '../../../../typer/person';
import { hentTilfeldigElement } from '../../../../utils/hjelpefunksjoner';
import { formaterFnr } from '../../../../utils/visning';

const StyledBarnekort = styled.div`
    padding: 0.625rem;
    height: 27.5rem;
    width: 17.25rem;
`;

const LeggTilBarnCheckbox = styled(Checkbox)`
    margin-top: 2.75rem;
`;

const KnappeContainer = styled.div`
    margin-top: 1rem;
    height: 5rem;
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

interface IBarnekortProps extends IBarnNy {
    settMedISøknad: (ident: string, skalVæreMed: boolean) => void;
}

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
                    <Element>{navn}</Element>
                    <BarneKortInfo
                        label={<FormattedMessage id={'velgbarn.fødselsnummer.label'} />}
                        verdi={formaterFnr(ident)}
                    />
                    <BarneKortInfo
                        label={<FormattedMessage id={'velgbarn.alder.label'} />}
                        verdi={alder}
                    />
                    <BarneKortInfo
                        label={'Bor med søker'}
                        verdi={<FormattedMessage id={borMedSøker ? 'ja' : 'nei'} />}
                    />
                    <KnappeContainer>
                        <LeggTilBarnCheckbox
                            label={<FormattedMessage id={'velgbarn.checkboxtekst'} />}
                            onClick={() => settMedISøknad(ident, !medISøknad)}
                        />
                    </KnappeContainer>
                </InformasjonsboksInnhold>
            </Informasjonsboks>
        </StyledBarnekort>
    );
};

const BarneKortInfo: React.FC<{ label: ReactNode; verdi: ReactNode }> = ({ label, verdi }) => {
    return (
        <div>
            <Normaltekst>{label}</Normaltekst>
            <Normaltekst>{verdi}</Normaltekst>
        </div>
    );
};

export default Barnekort;

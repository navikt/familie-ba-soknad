import React, { ReactNode } from 'react';

import styled from 'styled-components/macro';

import { Flatknapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { DeleteFilled } from '@navikt/ds-icons';

import { AlternativtSvarForInput, ITidligereSamboer } from '../../../typer/person';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { samboerSpråkIder } from './spørsmål';

const StyledElement = styled(Element)`
    && {
        margin-bottom: 0.5rem;
    }
`;

const Spørsmål: React.FC<{ språkId: string }> = ({ språkId }) => (
    <StyledElement>
        <SpråkTekst id={språkId} />
    </StyledElement>
);

const SamboerContainer = styled.div`
    margin: 2rem 0;
    border-bottom: 1px solid #78706a; ;
`;

const SlettKnapp = styled(Flatknapp)`
    margin-top: 1rem;
    margin-bottom: 1.5rem;
`;

const SamboerOpplysninger: React.FC<{
    samboer: ITidligereSamboer;
    fjernTidligereSamboer: (samboer: ITidligereSamboer) => void;
}> = ({ samboer, fjernTidligereSamboer }) => {
    const svarSomKanVæreUkjent = (svar: string, språkIdForUkjent: string): ReactNode =>
        svar === AlternativtSvarForInput.UKJENT ? <SpråkTekst id={språkIdForUkjent} /> : svar;

    return (
        <SamboerContainer>
            <Element>{samboer.navn.svar.toUpperCase()}</Element>
            <Informasjonsbolk>
                <Spørsmål språkId={samboerSpråkIder.fnr} />
                <Normaltekst>
                    {svarSomKanVæreUkjent(samboer.ident.svar, samboerSpråkIder.fnrUkjent)}
                </Normaltekst>
            </Informasjonsbolk>
            {samboer.fødselsdato.svar && (
                <Informasjonsbolk>
                    <Spørsmål språkId={samboerSpråkIder.fødselsdato} />
                    <Normaltekst>
                        {svarSomKanVæreUkjent(
                            samboer.fødselsdato.svar,
                            samboerSpråkIder.fødselsdatoUkjent
                        )}
                    </Normaltekst>
                </Informasjonsbolk>
            )}
            <Informasjonsbolk>
                <Spørsmål språkId={samboerSpråkIder.samboerFraDato} />
                <Normaltekst>{samboer.samboerFraDato.svar}</Normaltekst>
            </Informasjonsbolk>
            <Informasjonsbolk>
                <Spørsmål språkId={samboerSpråkIder.samboerTilDato} />
                <Normaltekst>{samboer.samboerTilDato.svar}</Normaltekst>
            </Informasjonsbolk>
            <SlettKnapp htmlType={'button'} kompakt onClick={() => fjernTidligereSamboer(samboer)}>
                <DeleteFilled />
                <span>
                    <SpråkTekst id={'omdeg.fjernsamboer.knapp'} />
                </span>
            </SlettKnapp>
        </SamboerContainer>
    );
};

export default SamboerOpplysninger;

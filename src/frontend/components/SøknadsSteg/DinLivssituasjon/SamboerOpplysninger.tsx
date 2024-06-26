import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label } from '@navikt/ds-react';

import { AlternativtSvarForInput } from '../../../typer/common';
import { ITidligereSamboer } from '../../../typer/person';
import { formaterDato } from '../../../utils/dato';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import { samboerSpråkIder } from './spørsmål';

const Spørsmål: React.FC<{ språkId: string }> = ({ språkId }) => (
    <Label as="p">
        <SpråkTekst id={språkId} />
    </Label>
);

const SamboerContainer = styled.div`
    margin-bottom: 2rem;
    border-bottom: 1px solid #78706a;
`;

const StyledButton = styled(Button)`
    && {
        margin-top: 1rem;
        margin-bottom: 1.5rem;
    }
`;

const SamboerOpplysninger: React.FC<{
    samboer: ITidligereSamboer;
    fjernTidligereSamboer: (samboer: ITidligereSamboer) => void;
}> = ({ samboer, fjernTidligereSamboer }) => {
    const svarSomKanVæreUkjent = (svar: string, språkIdForUkjent: string): ReactNode =>
        svar === AlternativtSvarForInput.UKJENT ? <SpråkTekst id={språkIdForUkjent} /> : svar;

    return (
        <SamboerContainer>
            <Label as="p">{samboer.navn.svar.toUpperCase()}</Label>
            <Informasjonsbolk>
                <Spørsmål språkId={samboerSpråkIder.fnr} />
                <BodyShort>
                    {svarSomKanVæreUkjent(samboer.ident.svar, samboerSpråkIder.fnrUkjent)}
                </BodyShort>
            </Informasjonsbolk>
            {samboer.fødselsdato.svar && (
                <Informasjonsbolk>
                    <Spørsmål språkId={samboerSpråkIder.fødselsdato} />
                    <BodyShort>
                        {samboer.fødselsdato.svar === AlternativtSvarForInput.UKJENT ? (
                            <SpråkTekst id={samboerSpråkIder.fødselsdatoUkjent} />
                        ) : (
                            formaterDato(samboer.fødselsdato.svar)
                        )}
                    </BodyShort>
                </Informasjonsbolk>
            )}
            <Informasjonsbolk>
                <Spørsmål språkId={samboerSpråkIder.samboerFraDato} />
                <BodyShort>{formaterDato(samboer.samboerFraDato.svar)}</BodyShort>
            </Informasjonsbolk>
            <Informasjonsbolk>
                <Spørsmål språkId={samboerSpråkIder.samboerTilDato} />
                <BodyShort>{formaterDato(samboer.samboerTilDato.svar)}</BodyShort>
            </Informasjonsbolk>
            <StyledButton
                type={'button'}
                variant={'tertiary'}
                onClick={() => fjernTidligereSamboer(samboer)}
                icon={<TrashFillIcon aria-hidden />}
            >
                <SpråkTekst id={'omdeg.fjernsamboer.knapp'} />
            </StyledButton>
        </SamboerContainer>
    );
};

export default SamboerOpplysninger;

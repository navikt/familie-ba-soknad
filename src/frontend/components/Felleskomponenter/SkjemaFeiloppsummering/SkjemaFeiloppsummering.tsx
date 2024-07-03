import React from 'react';

import styled from 'styled-components';

import { ErrorSummary } from '@navikt/ds-react';
import { ISkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { ISteg } from '../../../typer/routes';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { AppLenke } from '../AppLenke/AppLenke';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    skjema: ISkjema<SkjemaFeltTyper, string>;
    routeForFeilmeldinger?: ISteg;
    id?: string;
}

const Container = styled.div`
    margin-top: 2rem;
`;

export const SkjemaFeiloppsummering: React.FC<Props> = ({ skjema, routeForFeilmeldinger, id }) => {
    return (
        <Container role={'alert'}>
            <ErrorSummary
                id={id}
                heading={<SpråkTekst id={'felles.feiloppsummering.tittel'} />}
                headingTag="h3"
            >
                {Object.values(skjema.felter)
                    .filter(felt => {
                        return felt.erSynlig && felt.valideringsstatus === Valideringsstatus.FEIL;
                    })
                    .map((felt, key) => (
                        <ErrorSummary.Item href={`#${felt.id}`} key={key}>
                            {routeForFeilmeldinger ? (
                                <AppLenke steg={routeForFeilmeldinger} hash={felt.id}>
                                    {felt.feilmelding}
                                </AppLenke>
                            ) : (
                                felt.feilmelding
                            )}
                        </ErrorSummary.Item>
                    ))}
            </ErrorSummary>
        </Container>
    );
};

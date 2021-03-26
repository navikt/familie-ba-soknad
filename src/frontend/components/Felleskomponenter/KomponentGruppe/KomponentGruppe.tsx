import React from 'react';

import styled from 'styled-components/macro';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, Valideringsstatus } from '@navikt/familie-skjema';

const Container = styled.div`
    && {
        margin-bottom: 4rem;
    }

    > div :not(:last-child) {
        margin-bottom: 2rem;
    }
`;

const avhengigeFelterErValidertOK = (felter: Felt<ESvar | undefined>[]) => {
    return !felter.find(
        (jaNeiSpørsmål: Felt<ESvar | undefined>) =>
            jaNeiSpørsmål.valideringsstatus !== Valideringsstatus.OK
    );
};

const KomponentGruppe: React.FC<{
    className?: string;
    avhengigheter?: Felt<ESvar | undefined>[];
}> = ({ className, avhengigheter, children }) => {
    const erSynlig =
        !avhengigheter || (avhengigheter && avhengigeFelterErValidertOK(avhengigheter));

    return erSynlig ? (
        <Container className={className}>
            {React.Children.map(children, child => {
                return child && <div>{child}</div>;
            })}
        </Container>
    ) : null;
};

export default KomponentGruppe;

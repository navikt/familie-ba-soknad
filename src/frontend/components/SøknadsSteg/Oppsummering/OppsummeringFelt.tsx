import React, { ReactNode } from 'react';

import styled from 'styled-components/macro';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';

import { ESivilstand } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const StyledOppsummeringsFelt = styled.div`
    padding: 0.25rem 0 0.25rem 0;
`;

interface IOppsummeringsFeltProps {
    tittel?: ReactNode;
    søknadsvar?: string | null;
}
export const OppsummeringFelt: React.FC<IOppsummeringsFeltProps> = ({
    tittel,
    søknadsvar,
    children,
}) => {
    let språktekstid: boolean | string = false;
    if (søknadsvar && søknadsvar in ESvar) {
        switch (søknadsvar) {
            case ESvar.NEI:
            case ESvar.JA:
                språktekstid = 'felles.svaralternativ.' + søknadsvar.toLowerCase();
                break;
            default:
                språktekstid = 'felles.svaralternativ.vetikke';
        }
    } else if (søknadsvar && søknadsvar in ESivilstand) {
        språktekstid = 'felles.sivilstatus.kode.' + søknadsvar;
    }

    return (
        <StyledOppsummeringsFelt>
            {tittel && <Element>{tittel}</Element>}
            {søknadsvar ? (
                <Normaltekst>
                    {språktekstid ? <SpråkTekst id={språktekstid} /> : søknadsvar}
                </Normaltekst>
            ) : (
                children
            )}
        </StyledOppsummeringsFelt>
    );
};

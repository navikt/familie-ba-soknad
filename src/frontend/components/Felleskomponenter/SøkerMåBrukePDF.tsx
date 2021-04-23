import React, { FC } from 'react';

import styled from 'styled-components/macro';

import Lenke from 'nav-frontend-lenker';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import AlertStripe from './AlertStripe/AlertStripe';
import Informasjonsbolk from './Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from './SpråkTekst/SpråkTekst';

interface Props {
    advarselTekstId: string;
    utfyllendeAdvarselInfoId?: string;
}

const LenkeContainer = styled.div`
    margin: 1.75rem 0;
`;

export const SøkerMåBrukePDF: FC<Props> = ({ advarselTekstId, utfyllendeAdvarselInfoId }) => {
    return (
        <Informasjonsbolk>
            <AlertStripe type={'advarsel'}>
                <SpråkTekst id={advarselTekstId} />
            </AlertStripe>
            {utfyllendeAdvarselInfoId && (
                <Informasjonsbolk>
                    <Element>
                        <SpråkTekst id={utfyllendeAdvarselInfoId} />
                    </Element>
                </Informasjonsbolk>
            )}
            <LenkeContainer>
                <Normaltekst>
                    <Lenke href={'#'}>
                        <SpråkTekst id={'felles.bruk-pdfskjema.lenketekst'} />
                    </Lenke>
                </Normaltekst>
            </LenkeContainer>
            <Normaltekst>
                <SpråkTekst id={'felles.sende-skjema.info'} />
            </Normaltekst>
        </Informasjonsbolk>
    );
};

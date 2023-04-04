import React, { FC } from 'react';

import styled from 'styled-components';

import { Element } from 'nav-frontend-typografi';

import { BodyShort } from '@navikt/ds-react';

import AlertStripe from './AlertStripe/AlertStripe';
import EksternLenke from './EksternLenke/EksternLenke';
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
        <Informasjonsbolk aria-live={'polite'}>
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
                <EksternLenke
                    lenkeSpråkId={'felles.bruk-pdfskjema.lenke'}
                    lenkeTekstSpråkId={'felles.bruk-pdfskjema.lenketekst'}
                />
            </LenkeContainer>
            <BodyShort>
                <SpråkTekst id={'felles.sende-skjema.info'} />
            </BodyShort>
        </Informasjonsbolk>
    );
};

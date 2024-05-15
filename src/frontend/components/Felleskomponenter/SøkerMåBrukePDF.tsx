import React, { FC } from 'react';

import styled from 'styled-components';

import { BodyShort, Label } from '@navikt/ds-react';

import EksternLenke from './EksternLenke/EksternLenke';
import FamilieAlert from './FamilieAlert/FamilieAlert';
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
            <FamilieAlert variant={'warning'}>
                <SpråkTekst id={advarselTekstId} />
            </FamilieAlert>
            {utfyllendeAdvarselInfoId && (
                <Informasjonsbolk>
                    <Label as="p">
                        <SpråkTekst id={utfyllendeAdvarselInfoId} />
                    </Label>
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

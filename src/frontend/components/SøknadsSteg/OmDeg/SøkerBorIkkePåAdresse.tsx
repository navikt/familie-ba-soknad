import React, { FC } from 'react';

import Lenke from 'nav-frontend-lenker';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface Props {
    advarselTekstId: string;
    utfyllendeAdvarselInfoId?: string;
}

export const SøkerBorIkkePåAdresse: FC<Props> = ({ advarselTekstId, utfyllendeAdvarselInfoId }) => {
    return (
        <>
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
            <Informasjonsbolk>
                <Normaltekst>
                    <Lenke href={'#'}>
                        <SpråkTekst id={'felles.bruk-pdfskjema.lenketekst'} />
                    </Lenke>
                </Normaltekst>
            </Informasjonsbolk>
            <Normaltekst>
                <SpråkTekst id={'felles.sende-skjema.info'} />
            </Normaltekst>
        </>
    );
};

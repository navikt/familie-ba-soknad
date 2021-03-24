import React, { FC } from 'react';

import { useIntl } from 'react-intl';

import Lenke from 'nav-frontend-lenker';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface Props {
    advarselTekstId: string;
    utfyllendeAdvarselInfoId: string;
}

export const SøkerBorIkkePåAdresse: FC<Props> = ({ advarselTekstId, utfyllendeAdvarselInfoId }) => {
    const intl = useIntl();
    return (
        <>
            <AlertStripe type={'advarsel'}>
                <SpråkTekst id={advarselTekstId} />
            </AlertStripe>
            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={utfyllendeAdvarselInfoId} />
                </Element>
            </Informasjonsbolk>
            <Informasjonsbolk>
                <Normaltekst>
                    <Lenke href={intl.formatMessage({ id: 'personopplysninger.lenke.pdfskjema' })}>
                        <SpråkTekst id={'personopplysninger.lenketekst.pdfskjema'} />
                    </Lenke>
                </Normaltekst>
            </Informasjonsbolk>
            <Normaltekst>
                <SpråkTekst id={'personopplysninger.info.pdfskjema'} />
            </Normaltekst>
        </>
    );
};

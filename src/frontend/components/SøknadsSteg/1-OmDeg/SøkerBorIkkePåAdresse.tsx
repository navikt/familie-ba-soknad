import React, { FC } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import Lenke from 'nav-frontend-lenker';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { StyledAlertStripe, FeltGruppe, KomponentGruppe } from './layoutKomponenter';

interface Props {
    advarselTekstId: string;
    utfyllendeAdvarselInfoId: string;
    className?: string;
}

export const SøkerBorIkkePåAdresse: FC<Props> = ({
    advarselTekstId,
    utfyllendeAdvarselInfoId,
    className,
}) => {
    const intl = useIntl();
    return (
        <div className={className}>
            <KomponentGruppe>
                <StyledAlertStripe type={'advarsel'} form={'inline'} className={'avstand-øverst'}>
                    <FormattedMessage id={advarselTekstId} />
                </StyledAlertStripe>
            </KomponentGruppe>
            <KomponentGruppe>
                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={utfyllendeAdvarselInfoId} />
                    </Element>
                </FeltGruppe>
                <FeltGruppe>
                    <Normaltekst>
                        <Lenke
                            href={intl.formatMessage({ id: 'personopplysninger.lenke.pdfskjema' })}
                        >
                            <FormattedMessage id={'personopplysninger.lenketekst.pdfskjema'} />
                        </Lenke>
                    </Normaltekst>
                </FeltGruppe>
                <Normaltekst>
                    <FormattedMessage id={'personopplysninger.info.pdfskjema'} />
                </Normaltekst>
            </KomponentGruppe>
        </div>
    );
};

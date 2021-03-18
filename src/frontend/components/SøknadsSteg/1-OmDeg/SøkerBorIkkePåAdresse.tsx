import React, { FC } from 'react';

import { useIntl } from 'react-intl';

import Lenke from 'nav-frontend-lenker';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
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
                    <SpråkTekst id={advarselTekstId} />
                </StyledAlertStripe>
            </KomponentGruppe>
            <KomponentGruppe>
                <FeltGruppe>
                    <Element>
                        <SpråkTekst id={utfyllendeAdvarselInfoId} />
                    </Element>
                </FeltGruppe>
                <FeltGruppe>
                    <Normaltekst>
                        <Lenke
                            href={intl.formatMessage({ id: 'personopplysninger.lenke.pdfskjema' })}
                        >
                            <SpråkTekst id={'personopplysninger.lenketekst.pdfskjema'} />
                        </Lenke>
                    </Normaltekst>
                </FeltGruppe>
                <Normaltekst>
                    <SpråkTekst id={'personopplysninger.info.pdfskjema'} />
                </Normaltekst>
            </KomponentGruppe>
        </div>
    );
};

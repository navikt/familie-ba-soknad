import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { hentAdressefelterSortert } from '../../../utils/person';
import { FeltGruppe, KomponentGruppe, StyledAlertStripe } from './layoutKomponenter';
import { hentSivilstatus, landkodeTilSpråk } from './utils';

const PersonopplysningerSection = styled.section`
    text-align: left;

    p {
        font-size: 1.125rem;
    }
`;

export const Personopplysninger: React.FC = () => {
    const intl = useIntl();

    const { søknad } = useApp();
    const søker = søknad.søker;

    return (
        <PersonopplysningerSection aria-live={'polite'}>
            <KomponentGruppe>
                <FeltGruppe>
                    <StyledAlertStripe type={'info'} form={'inline'}>
                        <p>
                            <FormattedMessage id={'personopplysninger.alert.infohentet'} />
                        </p>
                    </StyledAlertStripe>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'person.ident.visning'} />
                    </Element>
                    <Normaltekst>{søker.ident}</Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'person.statsborgerskap'} />
                    </Element>
                    <Normaltekst>
                        {søker.statsborgerskap
                            .map((statsborgerskap: { landkode: Alpha3Code }) =>
                                landkodeTilSpråk(statsborgerskap.landkode, intl.locale)
                            )
                            .join(', ')}
                    </Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'sivilstatus.tittel'} />
                    </Element>
                    <Normaltekst>
                        <FormattedMessage id={hentSivilstatus(søker.sivilstand?.type)} />
                    </Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'personopplysninger.adresse'} />
                    </Element>
                    {søker.adresse ? (
                        hentAdressefelterSortert(søker.adresse).map(adresseFelt => (
                            <Normaltekst>{adresseFelt}</Normaltekst>
                        ))
                    ) : (
                        <Normaltekst>
                            <FormattedMessage
                                id={'personopplysninger.har-ikke-registrert-adresse'}
                            />
                        </Normaltekst>
                    )}
                </FeltGruppe>
            </KomponentGruppe>
        </PersonopplysningerSection>
    );
};

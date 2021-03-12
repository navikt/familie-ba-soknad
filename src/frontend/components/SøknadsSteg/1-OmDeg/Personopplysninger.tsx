import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { ESivilstand } from '../../../typer/person';
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
                    <Normaltekst>TODO: Søkers ident</Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'person.statsborgerskap'} />
                    </Element>
                    <Normaltekst>
                        {søker.statsborgerskap
                            .map((landkode: string) => landkodeTilSpråk(landkode, intl.locale))
                            .join(', ')}
                    </Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'sivilstatus.tittel'} />
                    </Element>
                    <Normaltekst>
                        <FormattedMessage id={hentSivilstatus(ESivilstand.ENKE_ELLER_ENKEMANN)} />{' '}
                        {/* TODO */}
                    </Normaltekst>
                </FeltGruppe>

                <FeltGruppe>
                    <Element>
                        <FormattedMessage id={'person.adresse'} />
                    </Element>
                    <Normaltekst>TODO: Søkers adresse</Normaltekst>
                    <Normaltekst>TODO: postnummer og poststed</Normaltekst>
                </FeltGruppe>
            </KomponentGruppe>
        </PersonopplysningerSection>
    );
};

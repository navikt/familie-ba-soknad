import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { hentAdressefelterSortert } from '../../../utils/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { FeltGruppe, StyledAlertStripe } from './layoutKomponenter';
import { hentSivilstatus, landkodeTilSpråk } from './utils';

export const Personopplysninger: React.FC = () => {
    const intl = useIntl();

    const { søknad } = useApp();
    const søker = søknad.søker;

    return (
        <>
            <FeltGruppe>
                <StyledAlertStripe type={'info'} form={'inline'}>
                    <p>
                        <SpråkTekst id={'personopplysninger.alert.infohentet'} />
                    </p>
                </StyledAlertStripe>
            </FeltGruppe>

            <FeltGruppe>
                <Element>
                    <SpråkTekst id={'person.ident.visning'} />
                </Element>
                <Normaltekst>{søker.ident}</Normaltekst>
            </FeltGruppe>

            <FeltGruppe>
                <Element>
                    <SpråkTekst id={'person.statsborgerskap'} />
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
                    <SpråkTekst id={'sivilstatus.tittel'} />
                </Element>
                <Normaltekst>
                    <SpråkTekst id={hentSivilstatus(søker.sivilstand?.type)} />
                </Normaltekst>
            </FeltGruppe>

            <FeltGruppe>
                <Element>
                    <SpråkTekst id={'personopplysninger.adresse'} />
                </Element>
                {søker.adresse ? (
                    hentAdressefelterSortert(søker.adresse).map((adresseFelt, index) => (
                        <Normaltekst key={index}>{adresseFelt}</Normaltekst>
                    ))
                ) : (
                    <Normaltekst>
                        <SpråkTekst id={'personopplysninger.har-ikke-registrert-adresse'} />
                    </Normaltekst>
                )}
            </FeltGruppe>
        </>
    );
};

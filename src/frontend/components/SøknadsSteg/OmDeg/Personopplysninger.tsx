import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { hentAdressefelterSortert, hentSivilstatus, landkodeTilSpråk } from '../../../utils/person';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

export const Personopplysninger: React.FC = () => {
    const intl = useIntl();

    const { søknad } = useApp();
    const søker = søknad.søker;

    return (
        <>
            <AlertStripe>
                <SpråkTekst id={'omdeg.personopplysninger.info.alert'} />
            </AlertStripe>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={'omdeg.personopplysninger.fødselsnummer'} />
                </Element>
                <Normaltekst>{søker.ident}</Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={'omdeg.personopplysninger.statsborgerskap'} />
                </Element>
                <Normaltekst>
                    {søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, intl.locale)
                        )
                        .join(', ')}
                </Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={'omdeg.personopplysninger.sivilstatus'} />
                </Element>
                <Normaltekst>
                    <SpråkTekst id={hentSivilstatus(søker.sivilstand.type)} />
                </Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={'omdeg.personopplysninger.adresse'} />
                </Element>
                {søker.adresse ? (
                    hentAdressefelterSortert(søker.adresse).map((adresseFelt, index) => (
                        <Normaltekst key={index}>{adresseFelt}</Normaltekst>
                    ))
                ) : (
                    <Normaltekst>
                        <SpråkTekst id={'omdeg.personopplysninger.adresse-ukjent'} />
                    </Normaltekst>
                )}
            </Informasjonsbolk>
        </>
    );
};

import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { hentSivilstatus, landkodeTilSpråk } from '../../../utils/person';
import { genererAdresseVisning } from '../../../utils/visning';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

export const Personopplysninger: React.FC = () => {
    const [valgtLocale] = useSprakContext();

    const { søknad } = useApp();
    const søker = søknad.søker;

    return (
        <>
            <AlertStripe>
                <SpråkTekst id={'omdeg.personopplysninger.info.alert'} />
                <EksternLenke
                    lenkeTekstSpråkId={'omdeg.endre-opplysninger.lenketekst'}
                    lenkeSpråkId={'omdeg.endre-opplysninger.lenke'}
                    target="_blank"
                />
            </AlertStripe>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={'felles.fødsels-eller-dnummer.label'} />
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
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
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
                    genererAdresseVisning(søker.adresse)
                ) : (
                    <Normaltekst>
                        <SpråkTekst
                            id={
                                søker.adressebeskyttelse
                                    ? 'omdeg.personopplysninger.adresse-sperret'
                                    : 'omdeg.personopplysninger.adresse-ukjent'
                            }
                        />
                    </Normaltekst>
                )}
            </Informasjonsbolk>
        </>
    );
};

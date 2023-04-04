import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { Element } from 'nav-frontend-typografi';

import { BodyShort } from '@navikt/ds-react';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { genererAdresseVisning } from '../../../utils/adresse';
import { hentSivilstatusSpråkId, landkodeTilSpråk } from '../../../utils/språk';
import AlertStripe from '../../Felleskomponenter/AlertStripe/AlertStripe';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { omDegPersonopplysningerSpråkId } from './spørsmål';

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
                <BodyShort>{søker.ident}</BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerStatsborgerskap} />
                </Element>
                <BodyShort>
                    {søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                        )
                        .join(', ')}
                </BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerSivilstatus} />
                </Element>
                <BodyShort>
                    <SpråkTekst id={hentSivilstatusSpråkId(søker.sivilstand.type)} />
                </BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Element>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerAdresse} />
                </Element>
                {genererAdresseVisning(søker)}
            </Informasjonsbolk>
        </>
    );
};

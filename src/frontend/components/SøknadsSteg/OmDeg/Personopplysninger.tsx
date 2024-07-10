import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { Alert, BodyShort, Label } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { useSpråk } from '../../../context/SpråkContext';
import { genererAdresseVisning } from '../../../utils/adresse';
import { hentSivilstatusSpråkId, landkodeTilSpråk } from '../../../utils/språk';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import { omDegPersonopplysningerSpråkId } from './spørsmål';

export const Personopplysninger: React.FC = () => {
    const { valgtLocale } = useSpråk();
    const { søknad } = useApp();
    const { toggles } = useFeatureToggles();

    const søker = søknad.søker;

    return (
        <>
            {!toggles.VIS_GUIDE_I_STEG && (
                <Alert variant={'info'} inline>
                    <SpråkTekst id={'omdeg.personopplysninger.info.alert'} />
                    <EksternLenke
                        lenkeTekstSpråkId={'omdeg.endre-opplysninger.lenketekst'}
                        lenkeSpråkId={'omdeg.endre-opplysninger.lenke'}
                        target="_blank"
                    />
                </Alert>
            )}

            <Informasjonsbolk>
                <Label as="p">
                    <SpråkTekst id={'felles.fødsels-eller-dnummer.label'} />
                </Label>
                <BodyShort>{søker.ident}</BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Label as="p">
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerStatsborgerskap} />
                </Label>
                <BodyShort>
                    {søker.statsborgerskap
                        .map((statsborgerskap: { landkode: Alpha3Code }) =>
                            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
                        )
                        .join(', ')}
                </BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Label as="p">
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerSivilstatus} />
                </Label>
                <BodyShort>
                    <SpråkTekst id={hentSivilstatusSpråkId(søker.sivilstand.type)} />
                </BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Label as="p">
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerAdresse} />
                </Label>
                {genererAdresseVisning(søker)}
            </Informasjonsbolk>
        </>
    );
};

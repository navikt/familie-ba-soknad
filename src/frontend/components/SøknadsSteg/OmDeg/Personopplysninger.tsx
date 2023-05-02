import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { BodyShort, Label } from '@navikt/ds-react';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { genererAdresseVisning } from '../../../utils/adresse';
import { hentSivilstatusSpråkId, landkodeTilSpråk } from '../../../utils/språk';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import FamilieAlert from '../../Felleskomponenter/FamilieAlert/FamilieAlert';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { omDegPersonopplysningerSpråkId } from './spørsmål';

export const Personopplysninger: React.FC = () => {
    const [valgtLocale] = useSprakContext();

    const { søknad } = useApp();
    const søker = søknad.søker;

    return (
        <>
            <FamilieAlert variant={'info'}>
                <SpråkTekst id={'omdeg.personopplysninger.info.alert'} />
                <EksternLenke
                    lenkeTekstSpråkId={'omdeg.endre-opplysninger.lenketekst'}
                    lenkeSpråkId={'omdeg.endre-opplysninger.lenke'}
                    target="_blank"
                />
            </FamilieAlert>

            <Informasjonsbolk>
                <Label>
                    <SpråkTekst id={'felles.fødsels-eller-dnummer.label'} />
                </Label>
                <BodyShort>{søker.ident}</BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Label>
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
                <Label>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerSivilstatus} />
                </Label>
                <BodyShort>
                    <SpråkTekst id={hentSivilstatusSpråkId(søker.sivilstand.type)} />
                </BodyShort>
            </Informasjonsbolk>

            <Informasjonsbolk>
                <Label>
                    <SpråkTekst id={omDegPersonopplysningerSpråkId.søkerAdresse} />
                </Label>
                {genererAdresseVisning(søker)}
            </Informasjonsbolk>
        </>
    );
};

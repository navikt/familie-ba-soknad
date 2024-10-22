import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { BodyShort, Label } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useSpråk } from '../../../context/SpråkContext';
import { genererAdresseVisning } from '../../../utils/adresse';
import { hentSivilstatusLocalRecordString, landkodeTilSpråk } from '../../../utils/språk';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';

export const Personopplysninger: React.FC = () => {
    const { valgtLocale } = useSpråk();
    const { søknad, tekster, plainTekst } = useApp();

    const {
        personopplysningerFoedselsEllerDNummer,
        personopplysningerStatsborgerskap,
        personopplysningerSivilstatus,
        personopplysningerAdresse,
    } = tekster().OM_DEG;

    const søker = søknad.søker;

    const statsborgerskapTekst = søker.statsborgerskap
        .map((statsborgerskap: { landkode: Alpha3Code }) =>
            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
        )
        .join(', ');

    const sivilStatusTekst = plainTekst(
        hentSivilstatusLocalRecordString(tekster(), søker.sivilstand.type)
    );

    return (
        <>
            <div>
                <Label as="p">
                    <TekstBlock block={personopplysningerFoedselsEllerDNummer} />
                </Label>
                <BodyShort>{søker.ident}</BodyShort>
            </div>
            <div>
                <Label as="p">
                    <TekstBlock block={personopplysningerStatsborgerskap} />
                </Label>
                <BodyShort>{statsborgerskapTekst}</BodyShort>
            </div>
            <div>
                <Label as="p">
                    <TekstBlock block={personopplysningerSivilstatus} />
                </Label>
                <BodyShort>{sivilStatusTekst}</BodyShort>
            </div>
            <div>
                <Label as="p">
                    <TekstBlock block={personopplysningerAdresse} />
                </Label>
                {genererAdresseVisning(søker)}
            </div>
        </>
    );
};

import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { BodyShort, Label } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useSpråk } from '../../../context/SpråkContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { genererAdresseVisning } from '../../../utils/adresse';
import { landkodeTilSpråk, sivilstandTilSanitySivilstandApiKey } from '../../../utils/språk';

export const Personopplysninger: React.FC = () => {
    const { valgtLocale } = useSpråk();
    const { søknad, tekster, plainTekst } = useApp();

    const {
        [ESanitySteg.OM_DEG]: { ident, statsborgerskap, sivilstatus, adresse },
        [ESanitySteg.FELLES]: { frittståendeOrd },
    } = tekster();

    const søker = søknad.søker;

    const statsborgerskapTekst = søker.statsborgerskap
        .map((statsborgerskap: { landkode: Alpha3Code }) =>
            landkodeTilSpråk(statsborgerskap.landkode, valgtLocale)
        )
        .join(', ');

    const sivilStatusTekst = plainTekst(
        frittståendeOrd[sivilstandTilSanitySivilstandApiKey(søker.sivilstand.type)]
    );

    return (
        <>
            <div>
                <Label>{plainTekst(ident)}</Label>
                <BodyShort>{søker.ident}</BodyShort>
            </div>
            <div>
                <Label>{plainTekst(statsborgerskap)}</Label>
                <BodyShort>{statsborgerskapTekst}</BodyShort>
            </div>
            <div>
                <Label>{plainTekst(sivilstatus)}</Label>
                <BodyShort>{sivilStatusTekst}</BodyShort>
            </div>
            <div>
                <Label>{plainTekst(adresse)}</Label>
                {genererAdresseVisning(søker)}
            </div>
        </>
    );
};

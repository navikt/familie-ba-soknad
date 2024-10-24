import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { BodyShort } from '@navikt/ds-react';

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
                <BodyShort weight="semibold">{plainTekst(ident)}</BodyShort>
                <BodyShort>{søker.ident}</BodyShort>
            </div>
            <div>
                <BodyShort weight="semibold">{plainTekst(statsborgerskap)}</BodyShort>
                <BodyShort>{statsborgerskapTekst}</BodyShort>
            </div>
            <div>
                <BodyShort weight="semibold">{plainTekst(sivilstatus)}</BodyShort>
                <BodyShort>{sivilStatusTekst}</BodyShort>
            </div>
            <div>
                <BodyShort weight="semibold">{plainTekst(adresse)}</BodyShort>
                {genererAdresseVisning(søker, tekster().OM_DEG, plainTekst)}
            </div>
        </>
    );
};

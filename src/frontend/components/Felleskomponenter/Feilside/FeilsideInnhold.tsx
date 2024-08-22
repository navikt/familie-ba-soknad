import React from 'react';

import { useNavigate } from 'react-router-dom';

import { BodyShort, Link, List } from '@navikt/ds-react';

// import { useSpråk } from '../../../context/SpråkContext';
// import { LocaleType } from '../../../typer/common';
import { useSteg } from '../../../context/StegContext';

export const FeilsideInnhold: React.FC = () => {
    const navigate = useNavigate();
    const { hentNåværendeSteg } = useSteg();
    const { hentForrigeSteg } = useSteg();
    // const { valgtLocale } = useSpråk();

    const nåværendeSteg = hentNåværendeSteg();
    const forrigeSteg = hentForrigeSteg();

    const håndterLastSidenPåNytt = () => {
        location.reload();
    };

    const håndterTilbake = () => {
        navigate(forrigeSteg.path);
    };

    return (
        <>
            <BodyShort spacing>
                En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke
                noe du gjorde.
            </BodyShort>
            <BodyShort>Du kan prøve å</BodyShort>
            <List>
                <List.Item>
                    vente noen minutter og{' '}
                    <Link
                        href={nåværendeSteg.path}
                        variant="action"
                        onClick={event => {
                            event.preventDefault();
                            håndterLastSidenPåNytt();
                        }}
                    >
                        laste siden på nytt
                    </Link>
                </List.Item>
                <List.Item>
                    <Link
                        href={forrigeSteg.path}
                        variant="action"
                        onClick={event => {
                            event.preventDefault();
                            håndterTilbake();
                        }}
                    >
                        gå tilbake til forrige side
                    </Link>
                </List.Item>
            </List>
            <BodyShort>
                Hvis problemet vedvarer, kan du{' '}
                <Link href="https://nav.no/kontaktoss" target="_blank">
                    kontakte oss (åpnes i ny fane)
                </Link>
                .
            </BodyShort>
        </>
    );
};

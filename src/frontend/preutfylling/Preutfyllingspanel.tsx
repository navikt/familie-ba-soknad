import { useAppContext } from '@context/AppContext';
import { Box, ExpansionCard, Page } from '@navikt/ds-react';
import { RouteEnum } from '@typer/routes';
import { useLocation } from 'react-router';
import { ROUTES } from '../routes';

import { PreutfyllingForm } from './form/PreutfyllingForm';

const TITTEL = 'Testverktøy: preutfyll søknaden';

export function Preutfyllingspanel() {
    const { systemetOK } = useAppContext();
    const { pathname } = useLocation();

    if (pathname !== ROUTES[RouteEnum.Forside].path || !systemetOK()) {
        return null;
    }

    return (
        <Page.Block width="text" gutters>
            <Box marginBlock="space-24">
                <ExpansionCard aria-label={TITTEL} size="small" data-color="warning" lang="nb">
                    <ExpansionCard.Header>
                        <ExpansionCard.Title as="h2" size="small">
                            {TITTEL}
                        </ExpansionCard.Title>
                        <ExpansionCard.Description>
                            Vises bare i testmiljø. Fyller ut hele søknaden for den innloggede testpersonen og tar deg
                            til oppsummeringen, der du kan se over svarene før du sender inn. En søknad du har påbegynt,
                            blir erstattet.
                        </ExpansionCard.Description>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <PreutfyllingForm />
                    </ExpansionCard.Content>
                </ExpansionCard>
            </Box>
        </Page.Block>
    );
}

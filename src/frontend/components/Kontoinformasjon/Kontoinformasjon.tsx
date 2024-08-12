import React from 'react';

import { Alert, Heading, Label, Loader, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../context/AppContext';
import { ESanitySteg } from '../../typer/sanity/sanity';
import TekstBlock from '../Felleskomponenter/Sanity/TekstBlock';

const Kontoinformasjon: React.FC = () => {
    const { kontoinformasjon, tekster, plainTekst } = useApp();

    const kvitteringstekster = tekster()[ESanitySteg.KVITTERING];

    return (
        <VStack gap="4">
            {kontoinformasjon.status === RessursStatus.SUKSESS && (
                <>
                    <Heading level="3" size="xsmall">
                        {plainTekst(kvitteringstekster.kontonummerTittel)}
                    </Heading>
                    <Label as="p">{kontoinformasjon.data.kontonummer}</Label>
                    <TekstBlock block={kvitteringstekster.redigerKontonummerLenke} />
                </>
            )}

            {kontoinformasjon.status === RessursStatus.HENTER && (
                <>
                    <Heading level="3" size="xsmall">
                        {plainTekst(kvitteringstekster.kontonummerTittel)}
                    </Heading>
                    <Loader title={plainTekst(kvitteringstekster.henterKontonummer)} />
                </>
            )}

            {kontoinformasjon.status === RessursStatus.FEILET && (
                <>
                    <Alert variant="warning">
                        <TekstBlock block={kvitteringstekster.finnerIngenKontonummerAdvarsel} />
                    </Alert>
                    <Heading level="3" size="xsmall">
                        {plainTekst(kvitteringstekster.manglerKontonummerTittel)}
                    </Heading>
                    <TekstBlock block={kvitteringstekster.finnerIngenKontonummerBeskrivelse} />
                    <TekstBlock block={kvitteringstekster.registrerKontonummerLenke} />
                </>
            )}
        </VStack>
    );
};

export default Kontoinformasjon;

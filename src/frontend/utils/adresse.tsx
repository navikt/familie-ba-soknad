import React from 'react';

import { BodyShort } from '@navikt/ds-react';
import { feil, type FeltState, ok } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { IOmDegTekstinnhold } from '../components/SøknadsSteg/OmDeg/innholdTyper';
import { IAdresse } from '../typer/kontrakt/generelle';
import { ISøker } from '../typer/person';
import { PlainTekst } from '../typer/sanity/sanity';

import { trimWhiteSpace } from './hjelpefunksjoner';
import { uppercaseFørsteBokstav } from './visning';

export const erNorskPostnummer = (verdi: string) => !!(verdi?.length === 4 && Number.parseInt(verdi));

export const hentAdressefelterSortert = (adresse: IAdresse): string[] => {
    return [
        `${adresse.adressenavn ?? ''} ${adresse.husnummer ?? ''}${adresse.husbokstav ?? ''} ${
            adresse.bruksenhetsnummer ?? ''
        }`,
        `${adresse.postnummer ?? ''} ${adresse.poststed ? uppercaseFørsteBokstav(adresse.poststed) : ''}`,
    ]
        .map(linje => linje.replace(/\s{2+}/, ' ').trim())
        .filter(value => value);
};

export const genererAdresseVisning = (søker: ISøker, tekster: IOmDegTekstinnhold, plainTekst: PlainTekst) => {
    if (søker.adresse) {
        return hentAdressefelterSortert(søker.adresse).map((adresseFelt, index) => (
            <BodyShort key={index}>{adresseFelt}</BodyShort>
        ));
    }

    return (
        <BodyShort data-testid={`adressevisning-${søker.adressebeskyttelse ? 'sperre' : 'ikke-registrert'}`}>
            {plainTekst(søker.adressebeskyttelse ? tekster.soekerAdressesperre : tekster.ikkeRegistrertAdresse)}
        </BodyShort>
    );
};

export const valideringAdresse = (felt: FeltState<string>) => {
    const verdi = trimWhiteSpace(felt.verdi);
    return verdi.length < 100 ? ok(felt) : feil(felt, <SpråkTekst id={'felles.fulladresse.format.feilmelding'} />);
};

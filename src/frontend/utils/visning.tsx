import React from 'react';

import { Alpha3Code, alpha3ToAlpha2, getName } from 'i18n-iso-countries';
import { IntlShape } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';

import { AlternativtSvarForInput, IAdresse, IBarn } from '../typer/person';
import { hentAdressefelterSortert } from './person';

export const formaterFnr = (fødselsnummer: string) => {
    return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
};

export const genererAdresseVisning = (adresse: IAdresse) => {
    return hentAdressefelterSortert(adresse).map((adresseFelt, index) => (
        <Normaltekst key={index}>{adresseFelt}</Normaltekst>
    ));
};

export const barnetsNavnValue = (barn: IBarn, intl: IntlShape): string => {
    return barn.adressebeskyttelse
        ? (intl.formatMessage(
              { id: 'felles.anonym.barn.fnr' },
              { fødselsnummer: formaterFnr(barn.ident) }
          ) as string)
        : barn.navn.toUpperCase();
};

export const landkodeTilSpråk = (landkode: Alpha3Code | '', locale: string): string => {
    return landkode ? getName(alpha3ToAlpha2(landkode), locale) : AlternativtSvarForInput.UKJENT;
};

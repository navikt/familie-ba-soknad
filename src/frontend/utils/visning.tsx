import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { IAdresse } from '../typer/person';
import { hentAdressefelterSortert } from './person';

export const formaterFnr = (fødselsnummer: string) => {
    return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
};

export const genererAdresseVisning = (adresse: IAdresse) => {
    return hentAdressefelterSortert(adresse).map((adresseFelt, index) => (
        <Normaltekst key={index}>{adresseFelt}</Normaltekst>
    ));
};

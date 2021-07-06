import React, { ReactNode } from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { IAdresse, IBarnMedISøknad } from '../typer/person';
import { hentAdressefelterSortert } from './person';

export const formaterFnr = (fødselsnummer: string) => {
    return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
};

export const genererAdresseVisning = (adresse: IAdresse) => {
    return hentAdressefelterSortert(adresse).map((adresseFelt, index) => (
        <Normaltekst key={index}>{adresseFelt}</Normaltekst>
    ));
};

export const barnetsNavnValue = (barn: IBarnMedISøknad): ReactNode => {
    return barn.adressebeskyttelse ? (
        <SpråkTekst
            id={'felles.anonym.barn.fnr'}
            values={{ fødselsnummer: formaterFnr(barn.ident) }}
        />
    ) : (
        barn.navn.toUpperCase()
    );
};

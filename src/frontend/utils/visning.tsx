import React from 'react';

import styled from 'styled-components/macro';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ISøknadsfelt, ESøknadstype, søknadstyper } from '../typer/søknad';

export const LabelOgSvarContainer = styled.div<{ marginTop: string }>`
    text-align: left;
    margin-top: ${props => props.marginTop};
`;

export const visLabelOgSvar = (
    objekt: ISøknadsfelt<string | boolean | number | ESøknadstype> | undefined,
    marginTop: string
) => {
    return objekt ? (
        <LabelOgSvarContainer marginTop={marginTop} key={objekt.label}>
            <Element>{objekt.label}</Element>
            {verdiTilTekstsvar(objekt.verdi)}
        </LabelOgSvarContainer>
    ) : null;
};

export const verdiTilTekstsvar = (verdi: string | boolean | number | ESøknadstype) => {
    if (typeof verdi === 'string' && Object.keys(søknadstyper).includes(verdi)) {
        return <Normaltekst>{søknadstyper[verdi].navn}</Normaltekst>;
    } else if (typeof verdi === 'string' || typeof verdi === 'number') {
        return <Normaltekst>{verdi}</Normaltekst>;
    } else if (typeof verdi === 'boolean') {
        const jaTekst = 'Ja';
        const neiTekst = 'Nei';

        return verdi ? <Normaltekst>{jaTekst}</Normaltekst> : <Normaltekst>{neiTekst}</Normaltekst>;
    } else {
        return null;
    }
};

export const formaterFnr = (fødselsnummer: string) => {
    return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
};

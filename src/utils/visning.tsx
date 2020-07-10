import React from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ISøknadsfelt } from '../context/AppContext';

export const visLabelOgSvar = (objekt: ISøknadsfelt<string> | undefined) => {
    console.log(objekt, 'Halla');

    return objekt ? (
        <div className="spørsmål-og-svar">
            <Element>{objekt.label}</Element>
            {verdiTilTekstsvar(objekt.verdi)}
        </div>
    ) : null;
};

export const verdiTilTekstsvar = (verdi: string | boolean) => {
    if (typeof verdi === 'string') {
        return <Normaltekst>{verdi}</Normaltekst>;
    } else if (typeof verdi === 'boolean') {
        let jaTekst = 'Ja';
        let neiTekst = 'Nei';

        return verdi ? <Normaltekst>{jaTekst}</Normaltekst> : <Normaltekst>{neiTekst}</Normaltekst>;
    } else {
        return 'Halla dude';
    }
};

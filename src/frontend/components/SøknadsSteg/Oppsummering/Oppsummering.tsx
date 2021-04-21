import React, { ReactNode } from 'react';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Oppsummeringsbolk from './Oppsummeringsbolk';

interface IOppsummeringsFeltProps {
    tittel: ReactNode;
    søknadsvar: string;
}

const OppsummeringFelt: React.FC<IOppsummeringsFeltProps> = ({ tittel, søknadsvar }) => {
    return (
        <>
            <Element>{tittel}</Element>
            <Normaltekst>
                <SpråkTekst id={søknadsvar} />
            </Normaltekst>
        </>
    );
};

const Oppsummering: React.FC = () => {
    const { søknad } = useApp();
    console.log(søknad);

    return (
        <div>
            {/*TODO Åpen by default*/}
            {/*TODO skifte tittel til språktekst*/}
            <Oppsummeringsbolk tittel={'1. Om deg'}>
                <OppsummeringFelt
                    tittel={<SpråkTekst id={'person.ident.visning'} />}
                    søknadsvar={søknad.søker.ident}
                />
            </Oppsummeringsbolk>
        </div>
    );
};

export default Oppsummering;

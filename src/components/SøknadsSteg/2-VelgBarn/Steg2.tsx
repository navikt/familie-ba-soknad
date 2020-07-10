import React from 'react';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';

const Steg2: React.FC = () => {
    return (
        <Steg tittel={'Steg 2'}>
            Dette er Steg 2
            <Barnekort
                navn={'Barn Barnesen'}
                ident={'12345678901'}
                fødselsdato={'123456'}
                alder={'4'}
                harSammeAdresse={true}
                medISøknad={true}
                id={'1'}
            ></Barnekort>
            <Barnekort
                navn={'Barn2 Barnesen'}
                ident={'12345678901'}
                fødselsdato={'123456'}
                alder={'4'}
                harSammeAdresse={true}
                medISøknad={true}
                id={'1'}
            ></Barnekort>
        </Steg>
    );
};

export default Steg2;

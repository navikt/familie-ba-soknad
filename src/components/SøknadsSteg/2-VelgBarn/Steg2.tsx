import React from 'react';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';

const Steg2: React.FC = () => {
    return (
        <Steg tittel={'Steg 2'}>
            Dette er Steg 2
            <div className="barnekort-wrapper">
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
                    navn={'Bjarne Barnesen'}
                    ident={'12345678901'}
                    fødselsdato={'123456'}
                    alder={'4'}
                    harSammeAdresse={true}
                    medISøknad={true}
                    id={'2'}
                ></Barnekort>
                <Barnekort
                    navn={'Barn Tre Barnesen'}
                    ident={'12345678901'}
                    fødselsdato={'123456'}
                    alder={'4'}
                    harSammeAdresse={true}
                    medISøknad={true}
                    id={'3'}
                ></Barnekort>
            </div>
        </Steg>
    );
};

export default Steg2;

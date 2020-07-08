import NavFrontendSpinner from 'nav-frontend-spinner';
import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';

const SystemetLaster = () => {
    return (
        <div className={'systemet-laster'}>
            <div className={'systemet-laster__content'}>
                <Systemtittel
                    className={'systemet-laster__content--tekst'}
                    children={'Søknaden laster'}
                />
                <NavFrontendSpinner
                    className={'systemet-laster__content--spinner'}
                    transparent={true}
                />
            </div>
        </div>
    );
};

export default SystemetLaster;

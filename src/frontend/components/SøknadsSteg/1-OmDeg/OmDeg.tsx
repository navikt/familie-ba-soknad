import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import AlertStripe from 'nav-frontend-alertstriper';

import { Personopplysninger } from '@navikt/familie-soknadsdialog-personopplysninger';
import { ESivilstand } from '@navikt/familie-soknadsdialog-personopplysninger';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { useApp } from '../../../context/AppContext';
import { visLabelOgSvar } from '../../../utils/visning';
import Steg from '../Steg/Steg';

const StyledOmDeg = styled.div`
    text-align: left;
`;

const OmDeg: React.FC = () => {
    const { søknad } = useApp();

    return (
        <Steg tittel={'Om deg'} erSpørsmålBesvart={true}>
            <Personopplysninger
                personopplysninger={{
                    statsborgerskap: ['NOR'],
                    fnr: '12345678901',
                    adresse: {
                        adresse: 'Finsikkegata 1',
                        postnummer: '1234',
                        poststed: 'Oslo',
                    },
                    kontakttelefon: '40123456',
                    sivilstand: ESivilstand.ENKE_ELLER_ENKEMANN,
                }}
                lenkePDFSøknad={'http://example.com'}
                settTelefonnummerCallback={_telefonnr => {
                    // TODO: callback
                }}
                støttaSpråk={[LocaleType.nb, LocaleType.en]}
                intl={useIntl()}
            />
            <StyledOmDeg>
                <AlertStripe type="info" form="inline">
                    Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos
                    Folkeregisteret.
                </AlertStripe>
                {visLabelOgSvar(søknad.søker.verdi.navn, '2rem')}
            </StyledOmDeg>
        </Steg>
    );
};

export default OmDeg;

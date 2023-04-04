import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

export const KontonummerInfo: React.FC = () => {
    return (
        <Informasjonsbolk tittelId="kvittering.kontonummer">
            <BodyShort>
                <SpråkTekst
                    id={'kvittering.kontonummer.innhold'}
                    values={{
                        dineSiderLenke: (
                            <EksternLenke
                                lenkeTekstSpråkId={'kvittering.kontonummer.dinesiderlenketekst'}
                                lenkeSpråkId={'kvittering.kontonummer.dinesiderlenke'}
                            />
                        ),
                    }}
                />
            </BodyShort>
        </Informasjonsbolk>
    );
};

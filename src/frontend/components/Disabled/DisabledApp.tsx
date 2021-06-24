import React from 'react';

import Lenke from 'nav-frontend-lenker';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';

import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import InnholdContainer from '../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../Felleskomponenter/SpråkTekst/SpråkTekst';

export const DisabledApp: React.FC = () => {
    return (
        <main>
            <InnholdContainer>
                <VeilederSnakkeboble
                    tekst={<SpråkTekst id={'vedlikehold.veilederhilsen'} />}
                    posisjon={'høyre'}
                />
                <Sidetittel>
                    <SpråkTekst id={'vedlikehold.sidetittel'} />
                </Sidetittel>
                <Normaltekst>
                    <SpråkTekst id={'vedlikehold.brødtekst'} />
                </Normaltekst>
                <Lenke href={'felles.bruk-pdfskjema.lenke'}>
                    <SpråkTekst id={'felles.bruk-pdfskjema.lenketekst'} />
                </Lenke>
            </InnholdContainer>
        </main>
    );
};

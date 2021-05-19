import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Sidetittel } from 'nav-frontend-typografi';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import VeilederSnakkeboble from '../../../assets/VeilederSnakkeboble';
import { useApp } from '../../../context/AppContext';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';

const StyledSidetittel = styled(Sidetittel)`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

const Forside: React.FC = () => {
    const { formatMessage } = useIntl();

    const { sluttbruker } = useApp();

    const navn = sluttbruker.status === RessursStatus.SUKSESS ? sluttbruker.data.navn : '-';

    return (
        <InnholdContainer>
            <VeilederSnakkeboble
                tekst={formatMessage({ id: 'forside.veilederhilsen' }, { navn: navn })}
                posisjon={'høyre'}
            />

            <StyledSidetittel>
                <SpråkTekst id="forside.sidetittel" />
            </StyledSidetittel>

            <Sprakvelger støttedeSprak={[LocaleType.nn, LocaleType.nb]} />

            <Informasjonsbolk>
                <SpråkTekst id="forside.info.punktliste" values={{ b: msg => <b>{msg}</b> }} />
                <EksternLenke lenkeSpråkId={'#'} lenkeTekstSpråkId={'forside.plikter.lenketekst'} />
            </Informasjonsbolk>

            <BekreftelseOgStartSoknad navn={navn} />

            <Informasjonsbolk>
                <EksternLenke
                    lenkeTekstSpråkId={'forside.behandling-av-personopplysning.lenketekst'}
                    lenkeSpråkId={'#'}
                />
            </Informasjonsbolk>
        </InnholdContainer>
    );
};

export default Forside;

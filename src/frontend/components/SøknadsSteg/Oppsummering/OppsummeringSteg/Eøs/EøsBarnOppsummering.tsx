import React from 'react';

import { useIntl } from 'react-intl';

import { useSteg } from '../../../../../context/StegContext';
import { IBarnMedISøknad } from '../../../../../typer/barn';
import { barnetsNavnValue } from '../../../../../utils/barn';
import { toSlektsforholdSpråkId } from '../../../../../utils/språk';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../../EøsSteg/Barn/spørsmål';
import { useEøsForBarn } from '../../../EøsSteg/Barn/useEøsForBarn';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';
import EøsAndreForelderOppsummering from './EøsAndreForelderOppsummering';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    barn: IBarnMedISøknad;
    nummer: string;
}

const EøsBarnOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn }) => {
    const { hentStegObjektForBarnEøs } = useSteg();
    const eøsForBarnHook = useEøsForBarn(barn.id);

    const { formatMessage } = useIntl();
    const intl = useIntl();
    const barnetsNavn = barnetsNavnValue(barn, intl);

    return (
        <Oppsummeringsbolk
            tittel={'eøs-om-barn.oppsummering.tittel'}
            språkValues={{ nummer, barn: barnetsNavn }}
            steg={hentStegObjektForBarnEøs(barn)}
            skjemaHook={eøsForBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.søkersSlektsforhold]}
                            values={{ barn: barnetsNavnValue(barn, intl) }}
                        />
                    }
                    søknadsvar={formatMessage({
                        id:
                            barn.søkersSlektsforhold.svar &&
                            toSlektsforholdSpråkId(barn.søkersSlektsforhold.svar),
                    })}
                />
            </StyledOppsummeringsFeltGruppe>
            {barn.andreForelder && (
                <EøsAndreForelderOppsummering barn={barn} andreForelder={barn.andreForelder} />
            )}
        </Oppsummeringsbolk>
    );
};

export default EøsBarnOppsummering;

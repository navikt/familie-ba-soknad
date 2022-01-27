import React from 'react';

import { useIntl } from 'react-intl';

import { useSteg } from '../../../../context/StegContext';
import { andreForelderDataKeySpørsmål, IBarnMedISøknad } from '../../../../typer/barn';
import { barnetsNavnValue } from '../../../../utils/barn';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { eøsBarnSpørsmålSpråkId } from '../../EøsSteg/Barn/spørsmål';
import { useEøsForBarn } from '../../EøsSteg/Barn/useEøsForBarn';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../OppsummeringsFeltGruppe';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    barn: IBarnMedISøknad;
    nummer: string;
}

const EøsBarnOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn }) => {
    const { hentStegObjektForBarnEØS } = useSteg();

    const intl = useIntl();
    const barnetsNavn = barnetsNavnValue(barn, intl);

    return (
        <Oppsummeringsbolk
            tittel={'eøs-om-barn.oppsummering.tittel'}
            språkValues={{ nummer, barn: barnetsNavn }}
            steg={hentStegObjektForBarnEØS(barn)}
            skjemaHook={useEøsForBarn}
            barnId={barn.id}
            settFeilAnchors={settFeilAnchors}
        >
            {barn.andreForelder && (
                <>
                    <StyledOppsummeringsFeltGruppe>
                        <OppsummeringFelt
                            tittel={
                                <SpråkTekst
                                    id={
                                        eøsBarnSpørsmålSpråkId[
                                            barn.andreForelder[
                                                andreForelderDataKeySpørsmål.pensjonNorge
                                            ].id
                                        ]
                                    }
                                    values={{ barn: barnetsNavn }}
                                />
                            }
                            søknadsvar={
                                barn.andreForelder[andreForelderDataKeySpørsmål.pensjonNorge].svar
                            }
                        />
                    </StyledOppsummeringsFeltGruppe>
                </>
            )}
        </Oppsummeringsbolk>
    );
};

export default EøsBarnOppsummering;

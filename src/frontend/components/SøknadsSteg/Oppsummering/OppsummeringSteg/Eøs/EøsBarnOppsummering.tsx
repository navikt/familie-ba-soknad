import React from 'react';

import { useIntl } from 'react-intl';

import { useEøs } from '../../../../../context/EøsContext';
import { useSteg } from '../../../../../context/StegContext';
import { IBarnMedISøknad } from '../../../../../typer/barn';
import { barnetsNavnValue } from '../../../../../utils/barn';
import { toSlektsforholdSpråkId } from '../../../../../utils/språk';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { EøsBarnSpørsmålId, eøsBarnSpørsmålSpråkId } from '../../../EøsSteg/Barn/spørsmål';
import { useEøsForBarn } from '../../../EøsSteg/Barn/useEøsForBarn';
import { IdNummer } from '../../../EøsSteg/IdNummer';
import { idNummerLandMedPeriodeType } from '../../../EøsSteg/idnummerUtils';
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
    const { erEøsLand } = useEøs();

    const eøsForBarnHook = useEøsForBarn(barn.id);

    const { formatMessage } = useIntl();
    const intl = useIntl();
    const barnetsNavn = barnetsNavnValue(barn, intl);
    const { utenlandsperioder, eøsBarnetrygdsperioder } = barn;

    const tittelSpm = (spørsmålId: string) => (
        <SpråkTekst id={eøsBarnSpørsmålSpråkId[spørsmålId]} values={{ barn: barnetsNavn }} />
    );
    return (
        <Oppsummeringsbolk
            tittel={'eøs-om-barn.oppsummering.tittel'}
            språkValues={{ nummer, barn: barnetsNavn }}
            steg={hentStegObjektForBarnEøs(barn)}
            skjemaHook={eøsForBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                {idNummerLandMedPeriodeType(
                    {
                        utenlandsperioder,
                        eøsBarnetrygdsperioder,
                    },
                    erEøsLand
                ).map((landMedPeriodeType, index) => {
                    return (
                        !!landMedPeriodeType.land && (
                            <IdNummer
                                lesevisning={true}
                                spørsmålSpråkId={eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummer]}
                                spørsmålCheckboxSpråkId={
                                    eøsBarnSpørsmålSpråkId[EøsBarnSpørsmålId.idNummerUkjent]
                                }
                                feilmeldingSpråkId={'eøs-om-barn.barnidnummer.feilmelding'}
                                idNummerVerdiFraSøknad={
                                    barn.idNummer.find(
                                        verdi => verdi.land === landMedPeriodeType.land
                                    )?.idnummer
                                }
                                skjema={eøsForBarnHook.skjema}
                                key={index}
                                settIdNummerFelter={eøsForBarnHook.settIdNummerFelterForBarn}
                                landAlphaCode={landMedPeriodeType.land}
                                periodeType={landMedPeriodeType.periodeType}
                                barn={barn}
                            />
                        )
                    );
                })}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={tittelSpm(barn.søkersSlektsforhold.id)}
                    søknadsvar={formatMessage({
                        id:
                            barn.søkersSlektsforhold.svar &&
                            toSlektsforholdSpråkId(barn.søkersSlektsforhold.svar),
                    })}
                />
                {barn.søkersSlektsforholdSpesifisering.svar && (
                    <OppsummeringFelt
                        tittel={tittelSpm(barn.søkersSlektsforholdSpesifisering.id)}
                        søknadsvar={barn.søkersSlektsforholdSpesifisering.svar}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            {barn.andreForelder && (
                <EøsAndreForelderOppsummering barn={barn} andreForelder={barn.andreForelder} />
            )}
        </Oppsummeringsbolk>
    );
};

export default EøsBarnOppsummering;

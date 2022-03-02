import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../../../context/AppContext';
import { useEøs } from '../../../../../context/EøsContext';
import { useRoutes } from '../../../../../context/RoutesContext';
import { RouteEnum } from '../../../../../typer/routes';
import { ISøknadSpørsmål } from '../../../../../typer/spørsmål';
import { ArbeidsperiodeOppsummering } from '../../../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import { PensjonsperiodeOppsummering } from '../../../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import SpråkTekst from '../../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { UtbetalingsperiodeOppsummering } from '../../../../Felleskomponenter/UtbetalingerModal/UtbetalingsperiodeOppsummering';
import { IdNummer } from '../../../EøsSteg/IdNummer';
import { idNummerLandMedPeriodeType } from '../../../EøsSteg/idnummerUtils';
import { EøsSøkerSpørsmålId, eøsSøkerSpørsmålSpråkId } from '../../../EøsSteg/Søker/spørsmål';
import { useEøsForSøker } from '../../../EøsSteg/Søker/useEøsForSøker';
import { OppsummeringFelt } from '../../OppsummeringFelt';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';
import { StyledOppsummeringsFeltGruppe } from '../../OppsummeringsFeltGruppe';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const EøsSøkerOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { hentRouteObjektForRouteEnum } = useRoutes();
    const { søknad } = useApp();
    const søker = søknad.søker;
    const eøsForSøkerHook = useEøsForSøker();
    const { erEøsLand } = useEøs();

    const jaNeiSpmOppsummering = (søknadSpørsmål: ISøknadSpørsmål<ESvar | null>) => (
        <OppsummeringFelt
            tittel={<SpråkTekst id={eøsSøkerSpørsmålSpråkId[søknadSpørsmål.id]} />}
            søknadsvar={søknadSpørsmål.svar}
        />
    );

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.EøsForSøker)}
            tittel={'eøs-om-deg.sidetittel'}
            skjemaHook={eøsForSøkerHook}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                {idNummerLandMedPeriodeType(
                    søker.arbeidsperioderUtland,
                    søker.pensjonsperioderUtland,
                    søker.utenlandsperioder,
                    erEøsLand
                ).map((landMedPeriodeType, index) => {
                    return (
                        !!landMedPeriodeType.land && (
                            <IdNummer
                                lesevisning={true}
                                skjema={eøsForSøkerHook.skjema}
                                key={index}
                                settIdNummerFelter={eøsForSøkerHook.settIdNummerFelter}
                                landAlphaCode={landMedPeriodeType.land}
                                periodeType={landMedPeriodeType.periodeType}
                            />
                        )
                    );
                })}
                {søker.adresseISøkeperiode.svar && (
                    <OppsummeringFelt
                        tittel={
                            <SpråkTekst
                                id={eøsSøkerSpørsmålSpråkId[EøsSøkerSpørsmålId.adresseISøkeperiode]}
                            />
                        }
                        søknadsvar={søker.adresseISøkeperiode.svar}
                    />
                )}
            </StyledOppsummeringsFeltGruppe>
            <StyledOppsummeringsFeltGruppe>
                {jaNeiSpmOppsummering(søker.arbeidINorge)}
                {søker.arbeidsperioderNorge.map((arbeidsperiode, index) => (
                    <ArbeidsperiodeOppsummering
                        key={`arbeidsperiode-søker-norge-${index}`}
                        arbeidsperiode={arbeidsperiode}
                        nummer={index + 1}
                    />
                ))}

                {jaNeiSpmOppsummering(søker.pensjonNorge)}
                {søker.pensjonsperioderNorge.map((pensjonsperiode, index) => (
                    <PensjonsperiodeOppsummering
                        key={`pensjonsperiode-søker-norge-${index}`}
                        pensjonsperiode={pensjonsperiode}
                        nummer={index + 1}
                    />
                ))}

                {jaNeiSpmOppsummering(søker.andreUtbetalinger)}
                {søker.andreUtbetalingsperioder.map((utbetalingsperiode, index) => (
                    <UtbetalingsperiodeOppsummering
                        key={`utbetalingsperiode-søker-norge-${index}`}
                        utbetalingsperiode={utbetalingsperiode}
                        nummer={index + 1}
                    />
                ))}
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default EøsSøkerOppsummering;

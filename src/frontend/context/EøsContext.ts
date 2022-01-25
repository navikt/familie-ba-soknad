import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { andreForelderDataKeySpørsmål, barnDataKeySpørsmål, IBarnMedISøknad } from '../typer/barn';
import { BarnetsId } from '../typer/common';
import { Dokumentasjonsbehov, IDokumentasjon } from '../typer/dokumentasjon';
import { ISøker } from '../typer/person';
import { useApp } from './AppContext';
import { useFeatureToggles } from './FeatureToggleContext';
import { useLastRessurserContext } from './LastRessurserContext';

const [EøsProvider, useEøs] = createUseContext(() => {
    const { axiosRequest } = useLastRessurserContext();

    const skruddAvByDefault = true; //TODO denne må endres når EØS går live
    const [eøsSkruddAv, settEøsSkruddAv] = useState(skruddAvByDefault);

    const { søknad, settSøknad } = useApp();
    const [eøsLand, settEøsLand] = useState<Alpha3Code[]>();
    const [søkerTriggerEøs, settSøkerTriggerEøs] = useState(søknad.søker.triggetEøs);
    const [barnSomTriggerEøs, settBarnSomTriggerEøs] = useState<BarnetsId[]>(
        søknad.barnInkludertISøknaden.filter(barn => barn.triggetEøs).map(barn => barn.id)
    );
    const { toggles } = useFeatureToggles();

    const { soknadApi } = Miljø();

    useEffect(() => {
        if (!eøsSkruddAv) {
            const erEøs = søknad.erEøs;
            settSøknad({
                ...søknad,
                dokumentasjon: søknad.dokumentasjon.map((dok: IDokumentasjon) =>
                    dok.dokumentasjonsbehov === Dokumentasjonsbehov.EØS_SKJEMA
                        ? {
                              ...dok,
                              gjelderForSøker: erEøs,
                              opplastedeVedlegg: erEøs ? dok.opplastedeVedlegg : [],
                              harSendtInn: erEøs ? dok.harSendtInn : false,
                          }
                        : dok
                ),
            });
        }
    }, [søknad.erEøs]);

    useEffect(() => {
        (async () => {
            try {
                const eøsLandResponse = await axiosRequest<Map<Alpha3Code, string>, void>({
                    url: `${soknadApi}/kodeverk/eos-land`,
                    method: 'GET',
                    påvirkerSystemLaster: true,
                });

                if (eøsLandResponse.status === RessursStatus.SUKSESS) {
                    settEøsLand(Object.keys(eøsLandResponse.data) as Alpha3Code[]);
                    settEøsSkruddAv(false);
                } else {
                    settEøsSkruddAv(true);
                }
            } catch (_e) {
                settEøsSkruddAv(true);
            }
        })();
    }, []);

    const erEøsLand = (land: Alpha3Code | ''): boolean =>
        !eøsSkruddAv && !!land && !!eøsLand?.includes(land);

    const skalTriggeEøsForSøker = (søker: ISøker): boolean => {
        const landSvarSomKanTrigge = [
            søker.utenlandsperioder.map(periode => periode.oppholdsland.svar),
            ...(toggles.EØS_KOMPLETT
                ? [
                      søker.arbeidsperioderUtland.map(
                          periode => periode.arbeidsperiodeland?.svar ?? ''
                      ),
                      søker.pensjonsperioderUtland.map(periode => periode.pensjonsland.svar ?? ''),
                  ]
                : [søker.arbeidsland.svar, søker.pensjonsland.svar]),
        ].flat();

        return !!landSvarSomKanTrigge.find(land => erEøsLand(land));
    };

    const skalTriggeEøsForBarn = (barn: IBarnMedISøknad): boolean => {
        const landSvarSomKanTriggeEøs = [
            ...(barn.andreForelder
                ? [
                      ...(toggles.EØS_KOMPLETT
                          ? [
                                barn.andreForelder.arbeidsperioderUtland.map(
                                    periode => periode.arbeidsperiodeland?.svar ?? ''
                                ),
                            ]
                          : [
                                barn.andreForelder[
                                    andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand
                                ].svar,
                            ]),
                      barn.andreForelder[andreForelderDataKeySpørsmål.pensjonHvilketLand].svar,
                  ]
                : []),
            barn.utenlandsperioder.map(periode => periode.oppholdsland.svar),
        ].flat();

        const jaNeiSvarSomKanTriggeEøs =
            barn[barnDataKeySpørsmål.barnetrygdFraAnnetEøsland].svar === ESvar.JA;

        return !!landSvarSomKanTriggeEøs.find(land => erEøsLand(land)) || jaNeiSvarSomKanTriggeEøs;
    };

    useEffect(() => {
        const eøsTriggetForSøker = skalTriggeEøsForSøker(søknad.søker);

        const eøsTriggetForBarn = !!søknad.barnInkludertISøknaden.find(barn =>
            skalTriggeEøsForBarn(barn)
        );

        const erEøs = eøsTriggetForSøker || eøsTriggetForBarn;

        if (erEøs !== søknad.erEøs) {
            settSøknad({
                ...søknad,
                erEøs,
            });
        }
    }, [søknad.søker, søknad.barnInkludertISøknaden]);

    return {
        eøsSkruddAv,
        erEøsLand,
        skalTriggeEøsForSøker,
        skalTriggeEøsForBarn,
        settSøkerTriggerEøs,
        settBarnSomTriggerEøs,
        søkerTriggerEøs,
        barnSomTriggerEøs,
    };
});

export { EøsProvider, useEøs };

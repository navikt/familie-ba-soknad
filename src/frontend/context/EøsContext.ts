import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { RessursStatus } from '@navikt/familie-typer';

import Miljø, { basePath } from '../Miljø';
import { Dokumentasjonsbehov, IDokumentasjon } from '../typer/dokumentasjon';
import { EFeatureToggle } from '../typer/feature-toggles';
import { andreForelderDataKeySpørsmål, barnDataKeySpørsmål, ISøker } from '../typer/person';
import { IBarnMedISøknad } from '../typer/søknad';
import { useApp } from './AppContext';
import { useLastRessurserContext } from './LastRessurserContext';

const [EøsProvider, useEøs] = createUseContext(() => {
    const { axiosRequest } = useLastRessurserContext();

    const skruddAvByDefault = true; //TODO denne må endres når EØS går live
    const [eøsSkruddAv, settEøsSkruddAv] = useState(skruddAvByDefault);

    const [eøsLand, settEøsLand] = useState<Alpha3Code[]>();

    const { søknad, settSøknad, mellomlagre } = useApp();
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
                const toggleRespons = await axiosRequest<boolean, void>({
                    url: `${basePath}toggles/${EFeatureToggle.EØS}`,
                });
                const eøsLandResponse = await axiosRequest<Map<Alpha3Code, string>, void>({
                    url: `${soknadApi}/kodeverk/eos-land`,
                    method: 'GET',
                    påvirkerSystemLaster: true,
                });

                if (
                    toggleRespons.status === RessursStatus.SUKSESS &&
                    eøsLandResponse.status === RessursStatus.SUKSESS
                ) {
                    settEøsLand(Object.keys(eøsLandResponse.data) as Alpha3Code[]);
                    settEøsSkruddAv(toggleRespons.data);
                } else {
                    settEøsSkruddAv(true);
                }
            } catch (_e) {
                settEøsSkruddAv(true);
            }
        })();
    }, []);

    const erEøsLand = (land: Alpha3Code | '') => !eøsSkruddAv && !!land && eøsLand?.includes(land);

    const skalTriggeEøsForSøker = (søker: ISøker) => {
        const landSvarSomKanTrigge = [
            søker.arbeidsland.svar,
            søker.pensjonsland.svar,
            søker.utenlandsperioder.map(periode => periode.oppholdsland.svar),
        ].flat();

        return !!landSvarSomKanTrigge.find(land => erEøsLand(land));
    };

    const skalTriggeEøsForBarn = (barn: IBarnMedISøknad) => {
        const landSvarSomKanTriggeEøs = [
            ...(barn.andreForelder
                ? [
                      barn.andreForelder[andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]
                          .svar,
                      barn.andreForelder[andreForelderDataKeySpørsmål.pensjonHvilketLand].svar,
                  ]
                : []),
            barn.barnetrygdFraEøslandHvilketLand.svar,
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
            mellomlagre();
        }
    }, [søknad.søker, søknad.barnInkludertISøknaden]);

    return {
        eøsSkruddAv,
        erEøsLand,
        skalTriggeEøsForSøker,
        skalTriggeEøsForBarn,
    };
});

export { EøsProvider, useEøs };

import { useEffect, useState } from 'react';

import createUseContext from 'constate';
import { Alpha3Code } from 'i18n-iso-countries';

import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { Dokumentasjonsbehov, IDokumentasjon } from '../typer/dokumentasjon';
import { jaNeiSvarTriggerEøs, landSvarSomKanTriggeEøs } from '../utils/eøs';
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

    const erEøsLand = (land: Alpha3Code | '') => !eøsSkruddAv && !!land && eøsLand?.includes(land);

    useEffect(() => {
        const landSvarTriggerEøs = !!landSvarSomKanTriggeEøs(søknad).find(land => erEøsLand(land));
        const erEøs = landSvarTriggerEøs || jaNeiSvarTriggerEøs(søknad);

        if (erEøs !== søknad.erEøs) {
            settSøknad({ ...søknad, erEøs });
            mellomlagre();
        }
    }, [søknad.søker, søknad.barnInkludertISøknaden]);

    return {
        eøsSkruddAv,
        erEøsLand,
    };
});

export { EøsProvider, useEøs };

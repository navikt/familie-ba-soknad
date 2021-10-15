import { useEffect, useState } from 'react';

import createUseContext from 'constate';

import { useSprakContext } from '@navikt/familie-sprakvelger';
import { byggHenterRessurs, byggTomRessurs, RessursStatus } from '@navikt/familie-typer';

import Miljø from '../Miljø';
import { IKvittering } from '../typer/kvittering';
import { IMellomlagretBarnetrygd } from '../typer/mellomlager';
import { ISøkerRespons } from '../typer/person';
import { ESøknadstype, initialStateSøknad, ISøknad } from '../typer/søknad';
import { InnloggetStatus } from '../utils/autentisering';
import { mapBarnResponsTilBarn } from '../utils/barn';
import { preferredAxios } from './axios';
import { useInnloggetContext } from './InnloggetContext';
import { useLastRessurserContext } from './LastRessurserContext';
import { RouteEnum } from './RoutesContext';

const [AppProvider, useApp] = createUseContext(() => {
    const [valgtLocale] = useSprakContext();
    const { axiosRequest, lasterRessurser } = useLastRessurserContext();
    const { innloggetStatus } = useInnloggetContext();

    const [sluttbruker, settSluttbruker] = useState(byggTomRessurs<ISøkerRespons>()); // legacy
    const [søknad, settSøknad] = useState<ISøknad>(initialStateSøknad);
    const [innsendingStatus, settInnsendingStatus] = useState(byggTomRessurs<IKvittering>());
    const [sisteUtfylteStegIndex, settSisteUtfylteStegIndex] = useState<number>(-1);
    const [mellomlagretVerdi, settMellomlagretVerdi] = useState<IMellomlagretBarnetrygd>();
    const [fåttGyldigKvittering, settFåttGyldigKvittering] = useState(false);
    const [nåværendeRoute, settNåværendeRoute] = useState<RouteEnum | undefined>(undefined);
    const { soknadApi } = Miljø();

    useEffect(() => {
        if (innloggetStatus === InnloggetStatus.AUTENTISERT) {
            settSluttbruker(byggHenterRessurs());

            axiosRequest<ISøkerRespons, void>({
                url: `${soknadApi}/personopplysning`,
                method: 'POST',
                withCredentials: true,
                påvirkerSystemLaster: true,
            }).then(ressurs => {
                settSluttbruker(ressurs);

                hentOgSettMellomlagretData();
                ressurs.status === RessursStatus.SUKSESS &&
                    settSøknad({
                        ...søknad,
                        søker: {
                            ...søknad.søker,
                            navn: ressurs.data.navn,
                            statsborgerskap: ressurs.data.statsborgerskap,
                            barn: mapBarnResponsTilBarn(ressurs.data.barn),
                            ident: ressurs.data.ident,
                            adresse: ressurs.data.adresse,
                            sivilstand: ressurs.data.sivilstand,
                            adressebeskyttelse: ressurs.data.adressebeskyttelse,
                        },
                    });
            });
        }
    }, [innloggetStatus]);

    const mellomlagre = () => {
        const barnetrygd: IMellomlagretBarnetrygd = {
            søknad: søknad,
            modellVersjon: Miljø().modellVersjon,
            sisteUtfylteStegIndex: sisteUtfylteStegIndex,
            locale: valgtLocale,
        };
        axiosRequest<IMellomlagretBarnetrygd, IMellomlagretBarnetrygd>({
            url: Miljø().mellomlagerUrl,
            method: 'post',
            withCredentials: true,
            påvirkerSystemLaster: false,
            data: barnetrygd,
        }).catch(() => {
            // do nothing
        });
        settMellomlagretVerdi(barnetrygd);
    };

    useEffect(() => {
        if (sisteUtfylteStegIndex > 0) {
            mellomlagre();
        }
    }, [nåværendeRoute, søknad.dokumentasjon]);

    const hentOgSettMellomlagretData = () => {
        preferredAxios
            .get(Miljø().mellomlagerUrl, {
                withCredentials: true,
            })
            .then((response: { data?: IMellomlagretBarnetrygd }) => {
                if (response.data) {
                    settMellomlagretVerdi(response.data);
                }
            })
            .catch(() => {
                // Do nothing
            });
    };

    const brukMellomlagretVerdi = () => {
        if (mellomlagretVerdi) {
            settSøknad(mellomlagretVerdi.søknad);
            settSisteUtfylteStegIndex(mellomlagretVerdi.sisteUtfylteStegIndex);
        }
    };

    const nullstillMellomlagretVerdi = () => {
        axiosRequest<void, void>({
            url: Miljø().mellomlagerUrl,
            method: 'delete',
            withCredentials: true,
            påvirkerSystemLaster: false,
        });
        settMellomlagretVerdi(undefined);
    };

    const nullstillSøknadsobjekt = () => {
        settSøknad({
            ...initialStateSøknad,
            søknadstype: søknad.søknadstype,
            søker: {
                ...initialStateSøknad.søker,
                ident: søknad.søker.ident,
                navn: søknad.søker.navn,
                barn: søknad.søker.barn,
                statsborgerskap: søknad.søker.statsborgerskap,
                adresse: søknad.søker.adresse,
                sivilstand: søknad.søker.sivilstand,
                adressebeskyttelse: søknad.søker.adressebeskyttelse,
            },
        });
    };

    const erStegUtfyltFrafør = (nåværendeStegIndex: number) =>
        sisteUtfylteStegIndex >= nåværendeStegIndex;

    const avbrytOgSlettSøknad = () => {
        nullstillSøknadsobjekt();
        nullstillMellomlagretVerdi();
        settSisteUtfylteStegIndex(-1);
    };

    const gåTilbakeTilStart = () => {
        nullstillSøknadsobjekt();
        settSisteUtfylteStegIndex(-1);
    };

    const systemetFeiler = () => {
        return sluttbruker.status === RessursStatus.FEILET;
    };

    const systemetOK = () => {
        return (
            innloggetStatus === InnloggetStatus.AUTENTISERT &&
            sluttbruker.status === RessursStatus.SUKSESS
        );
    };

    const erUtvidet = søknad.søknadstype === ESøknadstype.UTVIDET;

    const systemetLaster = (): boolean => {
        return lasterRessurser() || innloggetStatus === InnloggetStatus.IKKE_VERIFISERT;
    };

    return {
        axiosRequest,
        sluttbruker,
        søknad,
        settSøknad,
        nullstillSøknadsobjekt,
        innsendingStatus,
        settInnsendingStatus,
        sisteUtfylteStegIndex,
        settSisteUtfylteStegIndex,
        erStegUtfyltFrafør,
        avbrytOgSlettSøknad,
        gåTilbakeTilStart,
        brukMellomlagretVerdi,
        mellomlagretVerdi,
        fåttGyldigKvittering,
        settFåttGyldigKvittering,
        erUtvidet,
        settNåværendeRoute,
        systemetFeiler,
        systemetOK,
        systemetLaster,
        mellomlagre,
    };
});

export { AppProvider, useApp };

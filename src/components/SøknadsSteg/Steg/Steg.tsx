import React, { useEffect, useState } from 'react';
import './Steg.less';
import KnappBase from 'nav-frontend-knapper';
import Stegindikator from 'nav-frontend-stegindikator';
import Panel from 'nav-frontend-paneler';
import { StegRoutes, RouteEnum } from '../../../routing/Routes';
import { Systemtittel, Ingress } from 'nav-frontend-typografi';
import { useLocation, useHistory } from 'react-router-dom';
import { IStegRoute, hentNesteRoute, hentForrigeRoute, hentPath } from '../../../routing/Routes';
import { Hovedknapp } from 'nav-frontend-knapper';
import { ILokasjon } from '../../../typer/lokasjon';
import Miljø from '../../../Miljø';
import { useApp } from '../../../context/AppContext';
import { ISøknad, ISøknadsfelt, IBarn } from '../../../typer/søknad';
import { byggHenterRessurs, RessursStatus, byggFeiletRessurs } from '@navikt/familie-typer';
import { IKvittering } from '../../../typer/kvittering';
import classNames from 'classnames';

interface ISteg {
    tittel: string;
    erSpørsmålBesvart: boolean;
    klassenavn?: string;
}

const Steg: React.FC<ISteg> = ({ tittel, children, erSpørsmålBesvart, klassenavn }) => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const {
        søknad,
        axiosRequest,
        innsendingStatus,
        settInnsendingStatus,
        utfyltSteg,
        settUtfyltSteg,
    } = useApp();
    const [aktivtSteg, settAktivtSteg] = useState<number>(0);

    const kommerFraOppsummering = location.state?.kommerFraOppsummering;

    useEffect(() => {
        const detteSteget = stegobjekter.findIndex(steg => steg.path === location.pathname);
        settAktivtSteg(detteSteget);

        if ((utfyltSteg === -1 ? 0 : utfyltSteg + 1) < detteSteget && !kommerFraOppsummering) {
            history.push('/');
        } else if (detteSteget > utfyltSteg) {
            settUtfyltSteg(detteSteget);
        }
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const stegobjekter = StegRoutes.map((steg: IStegRoute, index: number) => {
        return {
            ...steg,
            index: index,
        };
    });

    function behandleSøknad(søknad: ISøknad) {
        return { ...søknad, barn: { ...søknad.barn, verdi: sorterBarn(søknad.barn.verdi) } };
    }

    function sorterBarn(barn: ISøknadsfelt<IBarn>[]) {
        return barn.sort(barn => (barn.verdi.medISøknad.verdi ? -1 : 1));
    }

    function sendInnSøknad() {
        if (innsendingStatus.status !== RessursStatus.HENTER) {
            settInnsendingStatus(byggHenterRessurs());

            axiosRequest<IKvittering, ISøknad>({
                url: '/api/soknad',
                method: 'POST',
                withCredentials: true,
                data: behandleSøknad(søknad),
            })
                .then(ressurs => {
                    settInnsendingStatus(ressurs);
                    if (ressurs.status === RessursStatus.SUKSESS) {
                        settUtfyltSteg(utfyltSteg + 1);
                        history.push({
                            pathname: hentPath(StegRoutes, RouteEnum.Kvittering),
                        });
                    }
                })
                .catch(() =>
                    settInnsendingStatus(byggFeiletRessurs('Innsending av søknad feilet'))
                );
        }
    }

    const erFørsteSteg: boolean = aktivtSteg === 0;
    const erKvitteringSteg: boolean = aktivtSteg + 1 === stegobjekter.length;
    const erOppsummeringSteg: boolean = aktivtSteg + 2 === stegobjekter.length;
    const visInnsendingsknapp = Miljø().visInnsendingsknapp;

    const nesteRoute: IStegRoute = hentNesteRoute(StegRoutes, location.pathname);
    const forrigeRoute: IStegRoute = hentForrigeRoute(StegRoutes, location.pathname);

    return (
        <div className={classNames('steg', klassenavn)}>
            <Ingress>Søknad om barnetrygd</Ingress>
            <Stegindikator
                autoResponsiv={true}
                aktivtSteg={aktivtSteg}
                steg={stegobjekter}
                visLabel={false}
            />
            <Panel className={'steg__innhold'}>
                <main className={'innholdscontainer'}>
                    <Systemtittel>{tittel}</Systemtittel>
                    <div className={'innholdscontainer__children'}>{children}</div>
                </main>
            </Panel>
            {!kommerFraOppsummering && !erKvitteringSteg && (
                <div className={'steg__knapper'}>
                    <div className={`steg__knapper--rad1`}>
                        {!erFørsteSteg && (
                            <KnappBase
                                className={'tilbake'}
                                type={'standard'}
                                onClick={() => {
                                    history.push(forrigeRoute.path);
                                }}
                            >
                                Tilbake
                            </KnappBase>
                        )}
                        {erSpørsmålBesvart && !erOppsummeringSteg && (
                            <KnappBase
                                className={erFørsteSteg ? 'neste-alene' : 'neste'}
                                type={'hoved'}
                                onClick={() => {
                                    history.push(nesteRoute.path);
                                }}
                            >
                                Neste
                            </KnappBase>
                        )}
                        {visInnsendingsknapp && erOppsummeringSteg && (
                            <KnappBase
                                spinner={innsendingStatus.status === RessursStatus.HENTER}
                                type={'hoved'}
                                className={'sendinn'}
                                onClick={sendInnSøknad}
                            >
                                Send søknad
                            </KnappBase>
                        )}
                    </div>

                    <KnappBase
                        className={'avbryt'}
                        type={'flat'}
                        onClick={() => {
                            settUtfyltSteg(0);
                            history.push('/');
                        }}
                    >
                        <div>Avbryt</div>
                    </KnappBase>
                </div>
            )}
            {kommerFraOppsummering && erSpørsmålBesvart && (
                <div className={'steg__knapper'}>
                    <Hovedknapp
                        className="tilbake-til-oppsummering"
                        onClick={() =>
                            history.push({
                                pathname: hentPath(StegRoutes, RouteEnum.Oppsummering),
                            })
                        }
                    >
                        Tilbake til oppsummering
                    </Hovedknapp>
                </div>
            )}
        </div>
    );
};

export default Steg;

import React, { useEffect } from 'react';
import './Steg.less';
import KnappBase from 'nav-frontend-knapper';
import Stegindikator from 'nav-frontend-stegindikator';
import Panel from 'nav-frontend-paneler';
import { StegRoutes, RouteEnum } from '../../../routing/Routes';
import { Systemtittel, Ingress } from 'nav-frontend-typografi';
import { useLocation, useHistory } from 'react-router-dom';
import { IStegRoute, hentNesteRoute, hentForrigeRoute } from '../../../routing/Routes';
import { Hovedknapp } from 'nav-frontend-knapper';
import { hentPath } from '../../../routing/Routes';
import { ILokasjon } from '../../../typer/lokasjon';
import Miljø from '../../../Miljø';
import { useApp } from '../../../context/AppContext';
import { ISøknad, ISøknadsfelt, IBarn } from '../../../typer/søknad';
import { byggHenterRessurs, RessursStatus, byggFeiletRessurs } from '@navikt/familie-typer';
import { IKvittering } from '../../../typer/kvittering';

interface ISteg {
    tittel: string;
    erSpørsmålBesvart: boolean;
}

const Steg: React.FC<ISteg> = ({ tittel, children, erSpørsmålBesvart }) => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const {
        søknad,
        axiosRequest,
        innsendingStatus,
        settInnsendingStatus,
        aktivtSteg,
        settAktivtSteg,
    } = useApp();

    const kommerFraOppsummering = location.state?.kommerFraOppsummering;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                    history.push({
                        pathname: hentPath(StegRoutes, RouteEnum.Kvittering),
                    });
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
        <div className={'steg'}>
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
                                className={erOppsummeringSteg ? 'tilbake--alene' : 'tilbake'}
                                type={'standard'}
                                onClick={() => {
                                    settAktivtSteg(aktivtSteg - 1);
                                    history.push(forrigeRoute.path);
                                }}
                            >
                                <div>Tilbake</div>
                            </KnappBase>
                        )}
                        {erSpørsmålBesvart && !erOppsummeringSteg && (
                            <KnappBase
                                className={'neste'}
                                type={'hoved'}
                                onClick={() => {
                                    settAktivtSteg(aktivtSteg + 1);
                                    history.push(nesteRoute.path);
                                }}
                            >
                                <div>Neste</div>
                            </KnappBase>
                        )}
                        {visInnsendingsknapp && erOppsummeringSteg && (
                            <KnappBase
                                spinner={innsendingStatus.status === RessursStatus.HENTER}
                                type={'hoved'}
                                className={'sendinn'}
                                onClick={() => {
                                    settAktivtSteg(aktivtSteg + 1);
                                    sendInnSøknad();
                                }}
                            >
                                Send søknad
                            </KnappBase>
                        )}
                    </div>

                    <KnappBase
                        className={'avbryt'}
                        type={'flat'}
                        onClick={() => {
                            settAktivtSteg(0);
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

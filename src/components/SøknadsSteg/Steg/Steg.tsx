import React, { useEffect, useState } from 'react';
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
import Modal from 'nav-frontend-modal';

interface ISteg {
    tittel: string;
    erSpørsmålBesvart: boolean;
}

const Steg: React.FC<ISteg> = ({ tittel, children, erSpørsmålBesvart }) => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const { søknad, axiosRequest, innsendingStatus, settInnsendingStatus } = useApp();
    const kommerFraOppsummering = location.state?.kommerFraOppsummering;
    const [åpenModal, settÅpenModal] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const stegobjekter = StegRoutes.map((steg: IStegRoute, index: number) => {
        return {
            ...steg,
            index: index,
        };
    });

    const aktivtSteg: number = stegobjekter.findIndex(steg => steg.path === location.pathname);
    const erFørsteSteg: boolean = aktivtSteg === 0;
    const erSisteSteg: boolean = aktivtSteg + 1 === stegobjekter.length;
    const visInnsendingsknapp = Miljø().visInnsendingsknapp;
    const nesteRoute: IStegRoute = hentNesteRoute(StegRoutes, location.pathname);
    const forrigeRoute: IStegRoute = hentForrigeRoute(StegRoutes, location.pathname);

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
                })
                .catch(() =>
                    settInnsendingStatus(byggFeiletRessurs('Innsending av søknad feilet'))
                );
        }
    }

    function visModal() {}

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
            {!kommerFraOppsummering && (
                <div className={'steg__knapper'}>
                    <div className={`steg__knapper--rad1`}>
                        {!erFørsteSteg && (
                            <KnappBase
                                className={erSisteSteg ? 'tilbake--alene' : 'tilbake'}
                                type={'standard'}
                                onClick={() => history.push(forrigeRoute.path)}
                            >
                                <div>Tilbake</div>
                            </KnappBase>
                        )}
                        {erSpørsmålBesvart && !erSisteSteg && (
                            <KnappBase
                                className={'neste'}
                                type={'hoved'}
                                onClick={() => {
                                    history.push(nesteRoute.path);
                                }}
                            >
                                <div>Neste</div>
                            </KnappBase>
                        )}
                        {visInnsendingsknapp && erSisteSteg && (
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
                        onClick={() => settÅpenModal(true)}
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
            <Modal
                isOpen={åpenModal}
                onRequestClose={() => settÅpenModal(false)}
                closeButton={true}
                contentLabel="Content label"
            >
                <KnappBase
                    className={'avbryt'}
                    type={'flat'}
                    onClick={() => {
                        history.push('/');
                    }}
                >
                    <div>Avslutt søknad</div>
                </KnappBase>
            </Modal>
        </div>
    );
};

export default Steg;

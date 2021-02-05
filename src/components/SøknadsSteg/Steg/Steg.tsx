import React, { useEffect, useState } from 'react';

import './Steg.less';
import classNames from 'classnames';
import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg.js';
import { useLocation, useHistory } from 'react-router-dom';

import KnappBase from 'nav-frontend-knapper';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import Panel from 'nav-frontend-paneler';
import Stegindikator from 'nav-frontend-stegindikator';
import { Systemtittel, Ingress } from 'nav-frontend-typografi';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { byggHenterRessurs, RessursStatus, byggFeiletRessurs } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import Miljø from '../../../Miljø';
import { StegRoutes, RouteEnum } from '../../../routing/Routes';
import { IStegRoute, hentNesteRoute, hentForrigeRoute, hentPath } from '../../../routing/Routes';
import { IKvittering } from '../../../typer/kvittering';
import { ILokasjon } from '../../../typer/lokasjon';
import { ISøknad, ISøknadsfelt, IBarn } from '../../../typer/søknad';

interface ISteg {
    tittel: string;
    erSpørsmålBesvart: boolean;
    className?: string;
}

const Steg: React.FC<ISteg> = ({ tittel, children, erSpørsmålBesvart, className }) => {
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
    const [åpenModal, settÅpenModal] = useState(false);

    useEffect(() => {
        const detteSteget = StegRoutes.findIndex(steg => steg.path === location.pathname);
        settAktivtSteg(detteSteget);

        if ((utfyltSteg === -1 ? 0 : utfyltSteg + 1) < detteSteget && !kommerFraOppsummering) {
            history.push('/');
        } else if (detteSteget > utfyltSteg) {
            settUtfyltSteg(detteSteget);
        }
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const stegobjekter: StegindikatorStegProps[] = StegRoutes.map(
        (steg: IStegRoute, index: number) => {
            return {
                label: steg.label,
                index: index,
            };
        }
    );

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

    function håndterModalStatus() {
        settÅpenModal(!åpenModal);
    }

    return (
        <div className={classNames('steg', className)}>
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
                        onClick={() => håndterModalStatus()}
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
                className={'steg__modal'}
                isOpen={åpenModal}
                onRequestClose={() => håndterModalStatus()}
                closeButton={true}
                contentLabel="avbryt-søknad-modal"
                shouldCloseOnOverlayClick={true}
            >
                <div className={'modal-container'}>
                    <div className={'informasjonsbolk'}>
                        <Undertittel>
                            Er du sikker på at du vil avbryte søknadprosessen?
                        </Undertittel>
                        <Normaltekst className={'modal-tekst'}>
                            Hvis du avbryter vil innholdet i søknaden bli slettet.
                        </Normaltekst>
                    </div>
                    <div className={'avslutt-knapp'}>
                        <KnappBase
                            type={'fare'}
                            onClick={() => {
                                settUtfyltSteg(0);
                                history.push('/');
                            }}
                        >
                            <div>Avbryt søknad</div>
                        </KnappBase>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Steg;

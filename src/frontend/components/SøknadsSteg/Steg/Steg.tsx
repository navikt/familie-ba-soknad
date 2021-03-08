import React, { useState } from 'react';

import './Steg.less';
import classNames from 'classnames';
import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg.js';
import { useLocation, useHistory } from 'react-router-dom';

import KnappBase from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import Panel from 'nav-frontend-paneler';
import Stegindikator from 'nav-frontend-stegindikator';
import { Systemtittel, Ingress } from 'nav-frontend-typografi';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { StegRoutes, hentAktivtStegIndex } from '../../../routing/Routes';
import { IStegRoute, hentNesteRoute, hentForrigeRoute } from '../../../routing/Routes';
import { ILokasjon } from '../../../typer/lokasjon';
import { ESteg } from '../../../typer/søknad';

interface ISteg {
    tittel: string;
    kanGåTilNesteSteg: () => boolean;
    className?: string;
}

const Steg: React.FC<ISteg> = ({ tittel, children, kanGåTilNesteSteg, className }) => {
    const history = useHistory();
    const location = useLocation<ILokasjon>();
    const { settUtfyltSteg } = useApp();

    const [åpenModal, settÅpenModal] = useState(false);

    const stegobjekter: StegindikatorStegProps[] = StegRoutes.map(
        (steg: IStegRoute, index: number) => {
            return {
                label: steg.label,
                index: index,
            };
        }
    );

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
                aktivtSteg={hentAktivtStegIndex(location)}
                steg={stegobjekter}
                visLabel={false}
            />
            <Panel className={'steg__innhold'}>
                <main className={'innholdscontainer'}>
                    <Systemtittel>{tittel}</Systemtittel>
                    <div className={'innholdscontainer__children'}>{children}</div>
                </main>
            </Panel>
            <div className={'steg__knapper'}>
                <div className={`steg__knapper--rad1`}>
                    {hentAktivtStegIndex(location) > ESteg.STEG_EN && (
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
                    <KnappBase
                        type={'hoved'}
                        onClick={() => {
                            if (kanGåTilNesteSteg()) {
                                history.push(nesteRoute.path);
                            }
                        }}
                    >
                        Neste
                    </KnappBase>
                </div>

                <KnappBase className={'avbryt'} type={'flat'} onClick={() => håndterModalStatus()}>
                    <div>Avbryt</div>
                </KnappBase>
            </div>
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

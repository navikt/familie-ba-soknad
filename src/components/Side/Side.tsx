import React from 'react';
import KnappBase from 'nav-frontend-knapper';
import Stegindikator from 'nav-frontend-stegindikator';
import './Side.less';
//import classNames from 'classnames';
import Panel from 'nav-frontend-paneler';
import { Routes } from '../../routing/Routes';
import { Systemtittel, Ingress } from 'nav-frontend-typografi';
import { useLocation, useHistory } from 'react-router-dom';
import { IRoute, hentNesteRoute, hentForrigeRoute } from '../../routing/Routes';

interface ISide {
    tittel: string;
}

const Side: React.FC<ISide> = ({ tittel, children }) => {
    const location = useLocation();
    const history = useHistory();
    const skalViseKnapper = true;
    const erSpørsmålBesvart = true;

    const routes: IRoute[] = Object.values(Routes);
    routes.shift();
    const stegobjekter = routes.map((steg: IRoute, index: number) => {
        return {
            ...steg,
            index: index,
        };
    });

    const aktivtSteg: number = stegobjekter.findIndex(steg => steg.path === location.pathname);
    const erFørsteSide: boolean = aktivtSteg === 0;
    const erSisteSide: boolean = aktivtSteg + 1 === stegobjekter.length;

    const nesteRoute: IRoute = hentNesteRoute(Routes, location.pathname);
    const forrigeRoute: IRoute = hentForrigeRoute(Routes, location.pathname);
    //const nesteKnappStyling = classNames('neste', {
    //    hideButton: nesteRoute === undefined,
    //});

    return (
        <div className={'skjema'}>
            <div className={'side'}>
                <Ingress>Søknad om barnetrygd</Ingress>
                <Stegindikator
                    autoResponsiv={true}
                    aktivtSteg={aktivtSteg}
                    steg={stegobjekter}
                    visLabel={false}
                />
                <Panel className={'side__innhold'}>
                    <main className={'innholdscontainer'}>
                        <Systemtittel>{stegobjekter[aktivtSteg].label}</Systemtittel>
                        {children}
                    </main>
                </Panel>
                {skalViseKnapper && (
                    <div
                        className={erSpørsmålBesvart ? 'side__knapper treKnapper' : 'side__knapper'}
                    >
                        {!erFørsteSide && (
                            <KnappBase
                                className={'tilbake'}
                                type={'standard'}
                                onClick={() => history.push(forrigeRoute.path)}
                            >
                                <div>Tilbake</div>
                            </KnappBase>
                        )}
                        {erSpørsmålBesvart && !erSisteSide && (
                            <KnappBase
                                type={'hoved'}
                                onClick={() => history.push(nesteRoute.path)}
                                className={'/*nesteKnappStyling*/'}
                            >
                                <div>Neste</div>
                            </KnappBase>
                        )}

                        <KnappBase
                            className={'avbryt'}
                            type={'flat'}
                            onClick={() => history.push(Routes[0].path)}
                        >
                            <div>Avbryt</div>
                        </KnappBase>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Side;

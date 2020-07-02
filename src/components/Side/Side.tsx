import React from 'react';
import KnappBase from 'nav-frontend-knapper';
import Stegindikator from 'nav-frontend-stegindikator';
//import classNames from 'classnames';
import Panel from 'nav-frontend-paneler';
import { Routes } from '../../routing/Routes';
import { Systemtittel } from 'nav-frontend-typografi';
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
    const aktivtSteg = stegobjekter.findIndex(steg => steg.path === location.pathname);
    const nesteRoute = hentNesteRoute(Routes, location.pathname);
    const forrigeRoute = hentForrigeRoute(Routes, location.pathname);
    //const nesteKnappStyling = classNames('neste', {
    //    hideButton: nesteRoute === undefined,
    //});

    return (
        <div className={'skjema'}>
            <div className={'side'}>
                <Stegindikator autoResponsiv={true} aktivtSteg={aktivtSteg} steg={stegobjekter} />
                <Panel className={'side__innhold'}>
                    <main className={'innholdscontainer'}>
                        <Systemtittel>{tittel}</Systemtittel>
                        {children}
                    </main>
                </Panel>
                {skalViseKnapper && (
                    <div
                        className={erSpørsmålBesvart ? 'side__knapper treKnapper' : 'side__knapper'}
                    >
                        <KnappBase
                            className={'tilbake'}
                            type={'standard'}
                            onClick={() => history.push(forrigeRoute.path)}
                        >
                            <div>Tilbake</div>
                        </KnappBase>
                        {erSpørsmålBesvart && (
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

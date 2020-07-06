import React from 'react';
import './Steg.less';
import KnappBase from 'nav-frontend-knapper';
import Stegindikator from 'nav-frontend-stegindikator';
import Panel from 'nav-frontend-paneler';
import { StegRoutes } from '../../../routing/Routes';
import { Systemtittel, Ingress } from 'nav-frontend-typografi';
import { useLocation, useHistory } from 'react-router-dom';
import { IStegRoute, hentNesteRoute, hentForrigeRoute } from '../../../routing/Routes';

interface ISide {
    tittel: string;
}

const Steg: React.FC<ISide> = ({ tittel, children }) => {
    const location = useLocation();
    const history = useHistory();
    const skalViseKnapper = true;
    const erSpørsmålBesvart = true;

    const stegobjekter = StegRoutes.map((steg: IStegRoute, index: number) => {
        return {
            ...steg,
            index: index,
        };
    });

    const aktivtSteg: number = stegobjekter.findIndex(steg => steg.path === location.pathname);
    const erFørsteSide: boolean = aktivtSteg === 0;
    const erSisteSide: boolean = aktivtSteg + 1 === stegobjekter.length;

    const nesteRoute: IStegRoute = hentNesteRoute(StegRoutes, location.pathname);
    const forrigeRoute: IStegRoute = hentForrigeRoute(StegRoutes, location.pathname);

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
                        <Systemtittel>{tittel}</Systemtittel>
                        {children}
                    </main>
                </Panel>
                {skalViseKnapper && (
                    <div className={'side__knapper'}>
                        <div className={`side__knapper--rad1`}>
                            {!erFørsteSide && (
                                <KnappBase
                                    className={erSisteSide ? 'tilbake--alene' : 'tilbake'}
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
                                >
                                    <div>Neste</div>
                                </KnappBase>
                            )}
                        </div>

                        <KnappBase
                            className={'avbryt'}
                            type={'flat'}
                            onClick={() => history.push('/')}
                        >
                            <div>Avbryt</div>
                        </KnappBase>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Steg;

import React from 'react';

import { useIntl } from 'react-intl';

import Lenke from 'nav-frontend-lenker';
import { Undertittel } from 'nav-frontend-typografi';

import ExpandableInfo from '../expandableContent/ExpandableInfo';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import bemHelper from './bemUtils';
import PictureScanningExample from './PictureScanningExample';
import ScanningIcon from './ScanningIcon';
import './pictureScanningGuide.less';

const bem = bemHelper('pictureScanningGuide');

const PictureScanningGuide = () => {
    const { formatMessage } = useIntl();
    const svgIconHeight = 100;
    return (
        <ExpandableInfo title={formatMessage({ id: 'psg.expandable.tittel' })}>
            <div className={bem.block}>
                <Undertittel className={bem.element('title')}>
                    <SpråkTekst id="psg.section1.tittel" />
                </Undertittel>
                <ul>
                    <li>
                        <SpråkTekst id="psg.section1.liste.1" />
                    </li>
                    <li>
                        <SpråkTekst id="psg.section1.liste.2" />
                    </li>
                    <li>
                        <SpråkTekst id="psg.section1.liste.3" />
                    </li>
                </ul>

                <Undertittel tag="h3" className={bem.element('title')}>
                    <SpråkTekst id="psg.section2.tittel" />
                </Undertittel>
                <ul>
                    <li>
                        <SpråkTekst id="psg.section2.liste.1" />
                    </li>
                    <li>
                        <SpråkTekst id="psg.section2.liste.2" />
                    </li>
                    <li>
                        <SpråkTekst id="psg.section2.liste.3" />
                    </li>
                </ul>
                <div className={bem.element('examples')}>
                    <Undertittel tag="h3" className={bem.element('title')}>
                        <SpråkTekst id="psg.icon.heading" />
                    </Undertittel>
                    <div className={bem.element('body')}>
                        <div className={bem.element('cell')}>
                            <PictureScanningExample
                                image={<ScanningIcon status="good" height={svgIconHeight} />}
                                status="suksess"
                                statusText={formatMessage({ id: 'psg.good' })}
                                description={formatMessage({ id: 'psg.icon.label.good' })}
                            />
                        </div>
                        <div className={bem.element('cell')}>
                            <PictureScanningExample
                                image={<ScanningIcon status="keystone" height={svgIconHeight} />}
                                status="feil"
                                statusText={formatMessage({ id: 'psg.bad' })}
                                description={formatMessage({ id: 'psg.icon.label.keystone' })}
                            />
                        </div>
                        <div className={bem.element('cell')}>
                            <PictureScanningExample
                                image={<ScanningIcon status="horizontal" height={svgIconHeight} />}
                                status="feil"
                                statusText={formatMessage({ id: 'psg.bad' })}
                                description={formatMessage({ id: 'psg.icon.label.horizontal' })}
                            />
                        </div>
                        <div className={bem.element('cell')}>
                            <PictureScanningExample
                                image={<ScanningIcon status="shadow" height={svgIconHeight} />}
                                status="feil"
                                statusText={formatMessage({ id: 'psg.bad' })}
                                description={formatMessage({ id: 'psg.icon.label.shadow' })}
                            />
                        </div>
                    </div>
                    <Lenke target="_blank" href={formatMessage({ id: 'psg.lenkepanel.url' })}>
                        <SpråkTekst id="psg.lenkepanel.text" />
                    </Lenke>
                </div>
            </div>
        </ExpandableInfo>
    );
};
export default PictureScanningGuide;

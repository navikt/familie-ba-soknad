import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { Checkbox } from 'nav-frontend-skjema';
import { Ingress, Normaltekst, Undertittel } from 'nav-frontend-typografi';

import barn1 from '../../../../assets/barn1.svg';
import barn2 from '../../../../assets/barn2.svg';
import barn3 from '../../../../assets/barn3.svg';
import { useApp } from '../../../../context/AppContext';
import { device } from '../../../../Theme';
import { IBarn } from '../../../../typer/person';
import { hentTilfeldigElement } from '../../../../utils/hjelpefunksjoner';
import { formaterFnr } from '../../../../utils/visning';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { FjernBarnKnapp } from './FjernBarnKnapp';

interface IBarnekortProps {
    velgBarnCallback: (barn: IBarn, barnMedISøknad: boolean) => void;
    barn: IBarn;
    barnSomSkalVæreMed: IBarn[];
    fjernBarnCallback: (ident: string) => void;
}

export const StyledBarnekort = styled.div`
    position: relative;
    border-radius: 0.3rem;
    max-width: calc(16.3rem - 0.3rem * 2);
    padding: 2rem;
    margin: 0 auto 0.625rem;
    background-color: ${navFarger.navLysGra};
    @media all and ${device.mobile} {
        width: 100%;
    }
`;

const StyledCheckbox = styled(Checkbox)`
    margin-top: 2.75rem;
`;

const InformasjonsboksInnhold = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 8rem;
`;

const BarnekortHeader = styled.div`
    height: 8rem;
    background-color: ${navFarger.navLillaDarken60};
    border-bottom: 0.25rem solid ${navFarger.navLillaLighten20};
    border-radius: 0.3rem 0.3rem 0 0;
    display: flex;
    align-items: flex-end;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    > img {
        display: block;
        margin: 0 auto;
    }
`;

const StyledUndertittel = styled(Undertittel)`
    text-transform: uppercase;
    && {
        font-weight: 700;
    }
`;

const StyledIngress = styled(Ingress)`
    && {
        font-size: 1rem;
        margin-top: 1rem;
        font-weight: 600;
    }
`;

const Barnekort: React.FC<IBarnekortProps> = ({
    barn,
    velgBarnCallback,
    barnSomSkalVæreMed,
    fjernBarnCallback,
}) => {
    const { formatMessage } = useIntl();
    const ikoner = [barn1, barn2, barn3];
    const {
        søknad: { barnRegistrertManuelt },
    } = useApp();

    const erMedISøknad = !!barnSomSkalVæreMed.find(barnMedISøknad => barnMedISøknad.id === barn.id);

    const erRegistrertManuelt = !!barnRegistrertManuelt.find(
        manueltRegistrertBarn => manueltRegistrertBarn.id === barn.id
    );

    return (
        <StyledBarnekort>
            <BarnekortHeader>
                <img
                    alt={formatMessage({ id: 'felles.barneillustrasjon.tittel' })}
                    src={hentTilfeldigElement(ikoner)}
                />
            </BarnekortHeader>
            <InformasjonsboksInnhold>
                <StyledUndertittel>{barn.navn}</StyledUndertittel>
                {barn.ident && (
                    <BarneKortInfo
                        labelId={'hvilkebarn.barn.fødselsnummer'}
                        verdi={formaterFnr(barn.ident)}
                    />
                )}
                {barn.alder && ( // Barn som søker har lagt inn selv har ikke fødselsdato
                    <BarneKortInfo labelId={'hvilkebarn.barn.alder'} verdi={barn.alder} />
                )}
                {barn.borMedSøker !== undefined && (
                    <BarneKortInfo
                        labelId={'hvilkebarn.barn.bosted'}
                        verdi={
                            <SpråkTekst
                                id={
                                    barn.borMedSøker
                                        ? 'hvilkebarn.barn.bosted.din-adresse'
                                        : 'hvilkebarn.barn.bosted.ikke-din-adresse'
                                }
                            />
                        }
                    />
                )}
                <StyledCheckbox
                    checked={erMedISøknad}
                    label={<SpråkTekst id={'hvilkebarn.barn.søk-om.spm'} />}
                    aria-label={
                        formatMessage({ id: 'hvilkebarn.barn.søk-om.spm' }) + ` (${barn.navn})`
                    }
                    onChange={() => velgBarnCallback(barn, erMedISøknad)}
                />
            </InformasjonsboksInnhold>
            {erRegistrertManuelt && (
                <FjernBarnKnapp barnId={barn.id} fjernBarnCallback={fjernBarnCallback} />
            )}
        </StyledBarnekort>
    );
};

const BarneKortInfo: React.FC<{ labelId: string; verdi: ReactNode }> = ({ labelId, verdi }) => {
    return (
        <div>
            <StyledIngress>
                <SpråkTekst id={labelId} />
            </StyledIngress>
            <Normaltekst>{verdi}</Normaltekst>
        </div>
    );
};

export default Barnekort;

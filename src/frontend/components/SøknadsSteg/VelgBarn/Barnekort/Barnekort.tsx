import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { BodyShort, Ingress, Label, Checkbox } from '@navikt/ds-react';
import { AGray100, APurple400, APurple800 } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../../context/AppContext';
import { device } from '../../../../Theme';
import { IBarn } from '../../../../typer/person';
import { hentBostedSpråkId } from '../../../../utils/språk';
import { formaterFnr } from '../../../../utils/visning';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { TilfeldigBarnIkon } from '../../../Felleskomponenter/TilfeldigBarnIkon/TilfeldigBarnIkon';

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
    margin: 0 0.3125rem 0.625rem;
    background-color: ${AGray100};
    @media all and ${device.mobile} {
        width: 100%;
        max-width: none;
        margin: 0 0 0.625rem;
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
    background-color: ${APurple800};
    border-bottom: 0.25rem solid ${APurple400};
    border-radius: 0.3rem 0.3rem 0 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
`;

const StyledLabel = styled(Label)`
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
    const {
        søknad: { barnRegistrertManuelt },
        erUtvidet,
    } = useApp();

    const erMedISøknad = !!barnSomSkalVæreMed.find(barnMedISøknad => barnMedISøknad.id === barn.id);

    const erRegistrertManuelt = !!barnRegistrertManuelt.find(
        manueltRegistrertBarn => manueltRegistrertBarn.id === barn.id
    );

    return (
        <StyledBarnekort>
            <BarnekortHeader>
                <TilfeldigBarnIkon />
            </BarnekortHeader>
            <InformasjonsboksInnhold>
                <StyledLabel>
                    {barn.adressebeskyttelse ? (
                        <SpråkTekst id={'hvilkebarn.barn.anonym'} />
                    ) : (
                        barn.navn
                    )}
                </StyledLabel>
                {!barn.adressebeskyttelse && (
                    <BarneKortInfo
                        labelId={'hvilkebarn.barn.fødselsnummer'}
                        verdi={formaterFnr(barn.ident)}
                    />
                )}
                {barn.alder && ( // Barn med undefined fødselsdato i pdl eller som søker har lagt inn selv har alder -null-
                    <BarneKortInfo
                        labelId={'hvilkebarn.barn.alder'}
                        verdi={<SpråkTekst id={'felles.år'} values={{ alder: barn.alder }} />}
                    />
                )}
                {!erRegistrertManuelt && (
                    <BarneKortInfo
                        labelId={'hvilkebarn.barn.bosted'}
                        verdi={<SpråkTekst id={hentBostedSpråkId(barn)} />}
                    />
                )}
                <StyledCheckbox
                    checked={erMedISøknad}
                    aria-label={
                        formatMessage({
                            id: erUtvidet
                                ? 'hvilkebarn-utvidet.barn.søk-om.spm'
                                : 'hvilkebarn.barn.søk-om.spm',
                        }) + ` (${barn.navn})`
                    }
                    onChange={() => velgBarnCallback(barn, erMedISøknad)}
                >
                    {formatMessage({
                        id: erUtvidet
                            ? 'hvilkebarn-utvidet.barn.søk-om.spm'
                            : 'hvilkebarn.barn.søk-om.spm',
                    })}
                </StyledCheckbox>
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
            <BodyShort>{verdi}</BodyShort>
        </div>
    );
};

export default Barnekort;

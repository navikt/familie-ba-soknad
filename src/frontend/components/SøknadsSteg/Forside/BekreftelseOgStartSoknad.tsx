import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { BodyLong, Button, ConfirmationPanel, Radio, RadioGroup } from '@navikt/ds-react';
import { AGreen500, ANavRed, AOrange500 } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { toPlainText } from '../../../utils/sanity';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
`;

const StyledButton = styled(Button)`
    && {
        margin: 2.3rem auto 0 auto;
    }
`;

export const bekreftelseBoksBorderFarge = (status: BekreftelseStatus) => {
    switch (status) {
        case BekreftelseStatus.BEKREFTET:
            return AGreen500;
        case BekreftelseStatus.FEIL:
            return ANavRed;
        default:
            return AOrange500;
    }
};

const BekreftelseOgStartSoknad: React.FC = () => {
    const { formatMessage } = useIntl();
    const { toggles } = useFeatureToggles();
    const {
        onStartSøknad,
        bekreftelseOnChange,
        bekreftelseStatus,
        settSøknadstype,
        søknadstypeFeil,
        settSøknadstypeFeil,
    } = useBekreftelseOgStartSoknad();

    const { tekster } = useApp();

    return (
        <FormContainer onSubmit={event => onStartSøknad(event)}>
            {toggles[EFeatureToggle.KOMBINER_SOKNADER] && (
                <RadioGroup
                    legend={toPlainText(tekster()[ESanitySteg.FORSIDE].soekerDuUtvidet.sporsmal.nb)} // TODO: Skal hente tekst fra Sanity
                    onChange={(value: ESøknadstype) => {
                        settSøknadstype(value);
                        settSøknadstypeFeil(false);
                    }}
                    error={søknadstypeFeil && 'Du må velge søknadstype'} // TODO: Skal hente tekst fra Sanity
                >
                    <Radio value={ESøknadstype.UTVIDET}>Ja</Radio>
                    <Radio value={ESøknadstype.ORDINÆR}>Nei</Radio>
                </RadioGroup>
            )}
            <Informasjonsbolk tittelId="forside.bekreftelsesboks.tittel">
                <ConfirmationPanel
                    label={formatMessage({ id: 'forside.bekreftelsesboks.erklæring.spm' })}
                    onChange={bekreftelseOnChange}
                    checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                    error={
                        bekreftelseStatus === BekreftelseStatus.FEIL && (
                            <span role={'alert'}>
                                <SpråkTekst id={'forside.bekreftelsesboks.feilmelding'} />
                            </span>
                        )
                    }
                >
                    <BodyLong>
                        <SpråkTekst id="forside.bekreftelsesboks.brødtekst" />
                    </BodyLong>
                </ConfirmationPanel>
            </Informasjonsbolk>

            <StyledButton
                variant={
                    bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'primary' : 'secondary'
                }
                type={'submit'}
            >
                <SpråkTekst id="forside.start-soknad.knapp" />
            </StyledButton>
        </FormContainer>
    );
};

export default BekreftelseOgStartSoknad;

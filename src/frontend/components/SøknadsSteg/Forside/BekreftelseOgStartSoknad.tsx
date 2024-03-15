import React from 'react';

import styled from 'styled-components';

import {
    Alert,
    BodyShort,
    Button,
    ConfirmationPanel,
    Radio,
    RadioGroup,
    VStack,
} from '@navikt/ds-react';
import { AGreen500, ANavRed, AOrange500 } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const FormContainer = styled.form`
    display: grid;
    gap: 3rem;
`;

const StyledButton = styled(Button)`
    && {
        margin: 0 auto;
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
    const { toggles } = useFeatureToggles();
    const {
        onStartSøknad,
        bekreftelseOnChange,
        bekreftelseStatus,
        settSøknadstype,
        søknadstypeFeil,
        settSøknadstypeFeil,
    } = useBekreftelseOgStartSoknad();

    const { tekster: teksterFunksjon, plainTekst } = useApp();
    const tekster = teksterFunksjon();
    const forsidetekster = tekster[ESanitySteg.FORSIDE];
    const fellestekster = tekster[ESanitySteg.FELLES];

    return (
        <FormContainer onSubmit={event => onStartSøknad(event)}>
            {toggles[EFeatureToggle.KOMBINER_SOKNADER] && (
                <VStack gap={'6'}>
                    <Alert variant="info">
                        {plainTekst(forsidetekster.utvidetBarnetrygdAlert)}
                    </Alert>
                    <RadioGroup
                        legend={plainTekst(forsidetekster.soekerDuUtvidet.sporsmal)}
                        onChange={(value: ESøknadstype) => {
                            settSøknadstype(value);
                            settSøknadstypeFeil(false);
                        }}
                        error={
                            søknadstypeFeil &&
                            plainTekst(forsidetekster.soekerDuUtvidet.feilmelding)
                        }
                    >
                        <Radio value={ESøknadstype.UTVIDET}>
                            {plainTekst(fellestekster.frittståendeOrd.ja)}
                        </Radio>
                        <Radio value={ESøknadstype.ORDINÆR}>
                            {plainTekst(fellestekster.frittståendeOrd.nei)}
                        </Radio>
                    </RadioGroup>
                </VStack>
            )}
            <ConfirmationPanel
                label={plainTekst(forsidetekster.bekreftelsesboksErklaering)}
                onChange={bekreftelseOnChange}
                checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                error={
                    bekreftelseStatus === BekreftelseStatus.FEIL && (
                        <span role={'alert'}>
                            <TekstBlock block={forsidetekster.bekreftelsesboksFeilmelding} />
                        </span>
                    )
                }
            >
                <BodyShort weight={'semibold'}>
                    {plainTekst(forsidetekster.bekreftelsesboksTittel)}
                </BodyShort>
                <TekstBlock block={forsidetekster.bekreftelsesboksBroedtekst} />
            </ConfirmationPanel>

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

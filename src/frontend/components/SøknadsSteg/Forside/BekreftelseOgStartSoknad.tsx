import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { ArrowRightIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Button,
    ConfirmationPanel,
    Heading,
    Link,
    Radio,
    RadioGroup,
    VStack,
} from '@navikt/ds-react';
import { AGreen500, ANavRed, AOrange500 } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../context/AppContext';
import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const StyledLink = styled(Link)`
    && {
        color: var(--a-text-action);
    }
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
    const { formatMessage } = useIntl();
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
        <form onSubmit={event => onStartSøknad(event)}>
            <VStack gap="12">
                <RadioGroup
                    legend={plainTekst(forsidetekster.soekerDuUtvidet.sporsmal)}
                    onChange={(value: ESøknadstype) => {
                        settSøknadstype(value);
                        settSøknadstypeFeil(false);
                    }}
                    error={
                        søknadstypeFeil && plainTekst(forsidetekster.soekerDuUtvidet.feilmelding)
                    }
                >
                    <Radio value={ESøknadstype.UTVIDET}>
                        {plainTekst(fellestekster.frittståendeOrd.ja)}
                    </Radio>
                    <Radio value={ESøknadstype.ORDINÆR}>
                        {plainTekst(fellestekster.frittståendeOrd.nei)}
                    </Radio>
                </RadioGroup>

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
                    <Heading level="2" size="xsmall" spacing>
                        <SpråkTekst id="forside.bekreftelsesboks.tittel" />
                    </Heading>
                    <BodyShort>
                        <SpråkTekst id="forside.bekreftelsesboks.brødtekst" />{' '}
                        <StyledLink
                            href={formatMessage({ id: 'forside.bekreftelsesboks.lenke' })}
                            inlineText
                        >
                            <SpråkTekst id="forside.bekreftelsesboks.lenketekst" />
                        </StyledLink>
                    </BodyShort>
                </ConfirmationPanel>

                <StyledButton
                    variant={
                        bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'primary' : 'secondary'
                    }
                    type={'submit'}
                    icon={<ArrowRightIcon aria-hidden />}
                    iconPosition="right"
                >
                    <SpråkTekst id="forside.start-soknad.knapp" />
                </StyledButton>
            </VStack>
        </form>
    );
};

export default BekreftelseOgStartSoknad;

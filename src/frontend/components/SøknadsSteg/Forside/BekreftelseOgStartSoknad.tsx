import React from 'react';

import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Button, ConfirmationPanel, Heading, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { AGreen500, ANavRed, AOrange500 } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../context/AppContext';
import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { ESanitySteg, Typografi } from '../../../typer/sanity/sanity';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

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
            <VStack gap="10">
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
                    label={plainTekst(forsidetekster.bekreftelsesboksErklaering)}
                    onChange={bekreftelseOnChange}
                    checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                    error={
                        bekreftelseStatus === BekreftelseStatus.FEIL && (
                            <span role={'alert'}>
                                {plainTekst(forsidetekster.bekreftelsesboksFeilmelding)}
                            </span>
                        )
                    }
                >
                    <Heading level="2" size="xsmall" spacing>
                        {plainTekst(forsidetekster.bekreftelsesboksTittel)}
                    </Heading>
                    <TekstBlock
                        block={forsidetekster.bekreftelsesboksBroedtekst}
                        typografi={Typografi.BodyLong}
                    />
                </ConfirmationPanel>

                <VStack gap="8" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                    <Button
                        variant={
                            bekreftelseStatus === BekreftelseStatus.BEKREFTET
                                ? 'primary'
                                : 'secondary'
                        }
                        type={'submit'}
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                    >
                        <SpråkTekst id="forside.start-soknad.knapp" />
                    </Button>
                </VStack>
            </VStack>
        </form>
    );
};

export default BekreftelseOgStartSoknad;

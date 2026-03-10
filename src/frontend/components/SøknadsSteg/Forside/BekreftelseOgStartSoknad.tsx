import React from 'react';

import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Button, ConfirmationPanel, Heading, Radio, RadioGroup, VStack } from '@navikt/ds-react';

import { Typografi } from '../../../../common/sanity';
import { ESøknadstype } from '../../../../common/typer/kontrakt/generelle';
import { useAppContext } from '../../../context/AppContext';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';

import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const BekreftelseOgStartSoknad: React.FC = () => {
    const {
        onStartSøknad,
        bekreftelseOnChange,
        bekreftelseStatus,
        settSøknadstype,
        søknadstypeFeil,
        settSøknadstypeFeil,
    } = useBekreftelseOgStartSoknad();
    const { tekster, plainTekst } = useAppContext();

    const forsidetekster = tekster().FORSIDE;
    const navigasjonTekster = tekster().FELLES.navigasjon;
    const fellestekster = tekster().FELLES;

    return (
        <form onSubmit={event => onStartSøknad(event)}>
            <VStack gap="space-40">
                <RadioGroup
                    legend={plainTekst(forsidetekster.soekerDuUtvidet.sporsmal)}
                    onChange={(value: ESøknadstype) => {
                        settSøknadstype(value);
                        settSøknadstypeFeil(false);
                    }}
                    error={søknadstypeFeil && plainTekst(forsidetekster.soekerDuUtvidet.feilmelding)}
                >
                    <Radio value={ESøknadstype.UTVIDET}>{plainTekst(fellestekster.frittståendeOrd.ja)}</Radio>
                    <Radio value={ESøknadstype.ORDINÆR}>{plainTekst(fellestekster.frittståendeOrd.nei)}</Radio>
                </RadioGroup>

                <ConfirmationPanel
                    label={plainTekst(forsidetekster.bekreftelsesboksErklaering)}
                    onChange={bekreftelseOnChange}
                    checked={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                    error={
                        bekreftelseStatus === BekreftelseStatus.FEIL && (
                            <span role={'alert'}>{plainTekst(forsidetekster.bekreftelsesboksFeilmelding)}</span>
                        )
                    }
                >
                    <Heading level="2" size="xsmall" spacing>
                        {plainTekst(forsidetekster.bekreftelsesboksTittel)}
                    </Heading>
                    <TekstBlock block={forsidetekster.bekreftelsesboksBroedtekst} typografi={Typografi.BodyLong} />
                </ConfirmationPanel>

                <VStack gap="space-32" width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                    <Button
                        variant={bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'primary' : 'secondary'}
                        type={'submit'}
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                    >
                        {plainTekst(navigasjonTekster.startKnapp)}
                    </Button>
                </VStack>
            </VStack>
        </form>
    );
};

export default BekreftelseOgStartSoknad;

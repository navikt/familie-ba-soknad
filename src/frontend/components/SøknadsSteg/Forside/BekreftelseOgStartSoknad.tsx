import { useTranslate } from '@hooks/useTranslate';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, ErrorMessage, InfoCard, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { ESanitySteg, Typografi } from '../../../../common/sanity';
import { ESøknadstype } from '../../../../common/typer/kontrakt/generelle';
import { useSanityTekster } from '../../../context/SanityContext';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { BekreftelseStatus, useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const BekreftelseOgStartSoknad: FC = () => {
    const {
        onStartSøknad,
        bekreftelseOnChange,
        bekreftelseStatus,
        settSøknadstype,
        søknadstypeFeil,
        settSøknadstypeFeil,
    } = useBekreftelseOgStartSoknad();

    const forsidetekster = useSanityTekster(ESanitySteg.FORSIDE);
    const fellestekster = useSanityTekster(ESanitySteg.FELLES);
    const translate = useTranslate();

    const bekreftelseKortStatus = () => {
        switch (bekreftelseStatus) {
            case BekreftelseStatus.BEKREFTET:
                return 'success';
            case BekreftelseStatus.FEIL:
                return 'danger';
            case BekreftelseStatus.NORMAL:
            default:
                return 'warning';
        }
    };

    return (
        <form onSubmit={event => onStartSøknad(event)}>
            <VStack gap="space-40">
                <RadioGroup
                    legend={translate(forsidetekster.soekerDuUtvidet.sporsmal)}
                    onChange={(value: ESøknadstype) => {
                        settSøknadstype(value);
                        settSøknadstypeFeil(false);
                    }}
                    error={søknadstypeFeil && translate(forsidetekster.soekerDuUtvidet.feilmelding)}
                >
                    <Radio value={ESøknadstype.UTVIDET}>{translate(fellestekster.frittståendeOrd.ja)}</Radio>
                    <Radio value={ESøknadstype.ORDINÆR}>{translate(fellestekster.frittståendeOrd.nei)}</Radio>
                </RadioGroup>

                <VStack gap={'space-8'}>
                    <InfoCard data-color={bekreftelseKortStatus()}>
                        <InfoCard.Header>
                            <InfoCard.Title>{translate(forsidetekster.bekreftelsesboksTittel)}</InfoCard.Title>
                        </InfoCard.Header>
                        <InfoCard.Content>
                            <TekstBlock
                                block={forsidetekster.bekreftelsesboksBroedtekst}
                                typografi={Typografi.BodyLong}
                            />
                            <Checkbox
                                value={bekreftelseStatus === BekreftelseStatus.BEKREFTET}
                                onChange={bekreftelseOnChange}
                            >
                                {translate(forsidetekster.bekreftelsesboksErklaering)}
                            </Checkbox>
                        </InfoCard.Content>
                    </InfoCard>
                    {bekreftelseStatus === BekreftelseStatus.FEIL && (
                        <ErrorMessage showIcon>{translate(forsidetekster.bekreftelsesboksFeilmelding)}</ErrorMessage>
                    )}
                </VStack>

                <VStack width={{ sm: 'fit-content' }} marginInline={{ sm: 'auto' }}>
                    <Button
                        variant={bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'primary' : 'secondary'}
                        type={'submit'}
                        icon={<ArrowRightIcon aria-hidden />}
                        iconPosition="right"
                    >
                        {translate(fellestekster.navigasjon.startKnapp)}
                    </Button>
                </VStack>
            </VStack>
        </form>
    );
};

export default BekreftelseOgStartSoknad;

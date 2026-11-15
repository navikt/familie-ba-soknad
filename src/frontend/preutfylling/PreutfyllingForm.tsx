import { Button, ErrorMessage, HStack, VStack } from '@navikt/ds-react';
import { FormProvider } from 'react-hook-form';

import { AvvikField } from './AvvikField';
import { BarnField } from './BarnField';
import { EkstraBarnIdentField } from './EkstraBarnIdentField';
import { ScenarioField } from './ScenarioField';
import { usePreutfyllingForm } from './usePreutfyllingForm';

export function PreutfyllingForm() {
    const { form, onSubmit } = usePreutfyllingForm();

    const {
        handleSubmit,
        formState: { errors },
    } = form;

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack gap="space-20">
                    <ScenarioField />
                    <AvvikField />
                    <BarnField />
                    <EkstraBarnIdentField />
                    {errors.root?.message && <ErrorMessage showIcon>{errors.root.message}</ErrorMessage>}
                    <HStack>
                        <Button type="submit" variant="secondary">
                            Preutfyll og gå til oppsummering
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </FormProvider>
    );
}

import { useAppContext } from '@context/AppContext';
import { useEøsContext } from '@context/EøsContext';
import type { Alpha3Code } from 'i18n-iso-countries';
import { useForm } from 'react-hook-form';
import { byggPreutfyltSøknad } from '../byggPreutfyltSøknad';
import { type Avvik, Scenario } from '../scenario';
import { useGåTilOppsummering } from '../useGåTilOppsummering';

export enum PreutfyllingFormFields {
    SCENARIO = 'scenario',
    AVVIK = 'avvik',
    BARN_IDER = 'barnIder',
    EKSTRA_BARN_IDENT = 'ekstraBarnIdent',
}

export interface PreutfyllingFormValues {
    [PreutfyllingFormFields.SCENARIO]: Scenario;
    [PreutfyllingFormFields.AVVIK]: Avvik[];
    [PreutfyllingFormFields.BARN_IDER]: string[];
    [PreutfyllingFormFields.EKSTRA_BARN_IDENT]: string;
}

const EØS_LAND: Alpha3Code = 'DNK';

export function usePreutfyllingForm() {
    const { søknad } = useAppContext();
    const { erEøsLand } = useEøsContext();
    const gåTilOppsummering = useGåTilOppsummering();

    const barnFraFolkeregisteret = søknad.søker.barn;

    const form = useForm<PreutfyllingFormValues>({
        values: {
            [PreutfyllingFormFields.SCENARIO]: Scenario.ORDINÆR,
            [PreutfyllingFormFields.AVVIK]: [],
            [PreutfyllingFormFields.BARN_IDER]:
                barnFraFolkeregisteret.length === 1 ? [barnFraFolkeregisteret[0].id] : [],
            [PreutfyllingFormFields.EKSTRA_BARN_IDENT]: '',
        },
    });

    const { setError } = form;

    function onSubmit(formValues: PreutfyllingFormValues) {
        const { scenario, avvik, barnIder, ekstraBarnIdent } = formValues;

        if (!erEøsLand(EØS_LAND)) {
            setError('root', { message: `Kodeverket har ikke ${EØS_LAND} som EØS-land.` });
            return;
        }

        try {
            const preutfyltSøknad = byggPreutfyltSøknad(søknad, {
                scenario,
                avvik,
                barn: barnFraFolkeregisteret.filter(barn => barnIder.includes(barn.id)),
                ekstraBarnIdent: ekstraBarnIdent || undefined,
                eøsLand: EØS_LAND,
            });
            gåTilOppsummering(preutfyltSøknad);
        } catch (error: unknown) {
            setError('root', { message: error instanceof Error ? error.message : 'Klarte ikke å lage søknaden.' });
        }
    }

    return { form, onSubmit };
}

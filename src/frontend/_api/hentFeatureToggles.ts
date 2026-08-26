import { apiClient } from '@api/client/apiClient';
import { BASE_PATH } from '../../common/miljø';
import type { AllFeatureToggles } from '../../common/typer/feature-toggles';

export async function hentFeatureToggles(): Promise<AllFeatureToggles> {
    return apiClient.get<void, AllFeatureToggles>({
        url: `${BASE_PATH}toggles/all`,
    });
}

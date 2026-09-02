import { apiClient } from '@api/client/apiClient';
import { describe, expect, test, vi } from 'vitest';
import miljø from '../../common/miljø';
import { verifiserInnloggetBruker } from './verifiserInnloggetBruker';

vi.mock('@api/client/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

vi.mock('../../common/miljø', () => ({
    default: vi.fn(),
}));

describe('verifiserInnloggetBruker', () => {
    test('kaller apiClient.get med riktig url og returnerer responsen', async () => {
        vi.mocked(miljø).mockReturnValue({
            soknadApiProxyUrl: 'https://mock.url',
        } as ReturnType<typeof miljø>);
        vi.mocked(apiClient.get).mockResolvedValue('OK');

        const result = await verifiserInnloggetBruker();

        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith({
            url: `https://mock.url/innlogget/barnetrygd`,
            withCredentials: true,
        });
        expect(result).toBe('OK');
    });

    test('propagerer feil fra apiClient.get', async () => {
        const feil = new Error('Noe gikk galt');
        vi.mocked(apiClient.get).mockRejectedValue(feil);

        await expect(verifiserInnloggetBruker()).rejects.toThrow(feil);
    });
});

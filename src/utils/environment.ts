export interface IEnvironment {
    apiUrl: string;
}

export const environment = (): IEnvironment => {
    if (window.location.hostname.includes('dev')) {
        return {
            apiUrl: 'https://familie-ba-soknad-api.dev-nav.no',
        };
    } else {
        return {
            apiUrl: 'http://localhost:3000',
        };
    }
};

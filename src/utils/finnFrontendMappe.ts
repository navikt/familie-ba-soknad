import { existsSync } from 'fs';
import path from 'path';

const dirname = (): string => {
    try {
        return __dirname;
    } catch (e) {
        return path.dirname(new URL(import.meta.url).pathname);
    }
};

export const finnProsjektMappe = (): string => {
    const kjentFilIRotMappe = 'tsconfig.base.json';
    let mappe = dirname();

    while (!existsSync(path.join(mappe, kjentFilIRotMappe))) {
        mappe = path.join(mappe, '..');
    }

    return mappe;
};

export const finnFrontendMappe = () => {
    return path.join(finnProsjektMappe(), 'dist');
};

export default finnFrontendMappe;

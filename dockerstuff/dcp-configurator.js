import childProcess from 'child_process';
import fs from 'fs';
import { createInterface } from 'readline';
import { promisify } from 'util';

const daemonConfigLocation = `${process.env.HOME}/.docker/daemon.json`;

const io = createInterface(process.stdin, process.stdout);
io.on('close', () => {
    console.log('Done! Nå kan du kjøre docker-compose up så snart docker desktop er klar!');
});

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const exec = promisify(childProcess.exec);
const question = text => new Promise(resolve => io.question(text, resolve));

const isRunningMacOS = async () => {
    const { stdout } = await exec('uname');
    return stdout.trim() === 'Darwin';
};

const rebootDockerMachine = async () => {
    console.log('Starter docker på nytt med de nye innstillingene');
    await exec(`osascript -e 'quit app "Docker"'`);
    // Ta en pause, ellers crasher stuff
    await exec(`sleep 1`);
    await exec(`open -a Docker`);
};

const currentDockerSettings = async () => {
    const contents = await readFile(daemonConfigLocation);
    return JSON.parse(contents);
};

const isBuildkitEnabled = async () => {
    try {
        const {
            features: { buildkit },
        } = await currentDockerSettings();
        return buildkit ?? true;
    } catch (e) {
        // features section is missing, so it's enabled by default
        return true;
    }
};

const modifyDockerSettings = async () => {
    console.log('Endrer docker-instillinger for å disable buildkit');
    const data = await currentDockerSettings();

    const newData = {
        ...data,
        features: {
            ...data.features,
            buildkit: false,
        },
    };

    await writeFile(daemonConfigLocation, JSON.stringify(newData));
    return true;
};

const writeDotEnvFile = async () => {
    if (await exists('.env')) {
        const contents = (await readFile('.env')).toString();
        console.warn('.env-filen finnes allerede med følgende innhold:');
        console.log(contents);
        const overwrite = await question(
            'Vil du overskrive den? Den må inneholde GITHUB_USER og GITHUB_TOKEN. (y/N): '
        );
        if (overwrite.trim() !== 'y') {
            console.log('Ok, vi overskriver ikke env-filen');
            return;
        }
    }

    const githubUser = await question(
        'Hva er github-brukernavnet du bruker for å klone Nav-repositories? '
    );
    const githubToken = await question(
        'Lim in personal access token (lag et med read:packages og repo her https://github.com/settings/tokens): '
    );
    await writeFile(
        '.env',
        [`GITHUB_USER=${githubUser}`, `GITHUB_TOKEN=${githubToken}`, ''].join('\n')
    );
};

const run = async () => {
    console.log('La oss konfigurere docker-compose stacken!\n');

    const isMac = isRunningMacOS();
    const buildkitEnabled = isBuildkitEnabled();
    await writeDotEnvFile();

    if ((await isMac) && (await buildkitEnabled)) {
        await modifyDockerSettings().then(rebootDockerMachine);
    }
};

await run();
io.close();

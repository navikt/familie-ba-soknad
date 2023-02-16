# familie-ba-soknad

Frontend - søknad for barnetrygd.

## Avhengigheter
1. Node versjon >=14


## Log in på https://npm.pkg.github.com
På github -> Settings -> Developer Settings -> Generate New Token
Select scopes `repo` og `read:packages`

eksporter miljøvariabel NPM_TOKEN, f eks ved å legge til 
`export NPM_TOKEN=<ditt token>` i ~/.zshrc

## Kjør lokalt

1. `yarn install`
2. `yarn start:dev` evt `docker-compose up -d`

For å kjøre med mellomlagring må du ha familie-dokument kjørende (er en del av docker-compose stacken). 

## Kjør full app
For å kunne se PDFen som blir sent til joark (arkivering) lokalt må vi kjøre en del apper i tillegg til denne.
Alle disse tjenestene bygges og kjøres via docker-compose. Start med laste ned docker og docker-compose `brew install docker` og `brew install docker-compose`. 

For å bygge containerene må vi sette npm-token og docker buildkit som miljøvariabler. Dette legges typisk til i filene .zshrc eller .bash-profile slik:\
`export NPM_TOKEN=<TOKEN GENERERT PÅ GITHUB>`\
`export DOCKER_BUILDKIT=0`

Du trenger og å sette github credentials. Kjør `yarn setup:docker:env` eller legg til dette i en .env på rotnivå:\
`GITHUB_USER=<GitHub brukernavnet ditt>`\
`GITHUB_TOKEN=<TOKEN GENERERT PÅ GITHUB>`

Siden Docker Desktop ikke lenger er gratis kan du f.eks. bruke Colima. For å kunne kjøre hele stacken må vi starte colima med ekstra memory, disk og cpu.
1. Last ned colima med brew `brew install colima`
2. Kjør `colima start -c 4 -d 120 -m 8`

Deretter åpne `docker-compose.yml`
i intellij og start alle servicene for å komme i gang.

Eventuelt kan du kjøre `docker-compose up` i terminalen. Da vil den bygge alt første gang, men om du trenger å bygge på nytt etter første gang kjør
`docker-compose up -- build`.

**OBS!** Dersom man ikke får oppdatert versjon i frontend kan det være pga. utdatert docker images, så da kan man kjøre `docker-compose up -d --build`. 
Skjer det noe annet uventet kan det kanskje hjelpe å slette alle images, stoppa containere og volumes (starte fra scratch).

**OBS2!** Husk å stoppe docker og colima når du er ferdig `docker-compose down` og `colima stop`.

Når `docker-compose` sier at alle tjenestene er oppe betyr det bare at containerene har startet og at init-programmet
kjører. Følg med på loggen til frontend-containeren for å se når webpack er ferdig, og følg med på loggen til mottak
for å se når den er klar til å ta imot søknader fra frontend.

Genererte søknader og vedlegg lagres til `var/mottatte_soknader` i roten av repoet. IntelliJ synker ikke umiddelbart
filsystem-endringer, så hvis loggen til mottak sier at søknaden er prosessert men filene ikke har dukket opp i mappen
kan du høyreklikke på mappen og reloade den fra disk for å se søknadsfilene. Filene som lagres er

* hoveddokument.json - selve søknaden som json
* hoveddokument.pdf - det genererte PDF-dokumentet
* request.json - hele requestet som sendes til familie-integrasjoner for journalføring
* vedlegg-x.ext - de opplastede vedleggene som i prod ville vært konvertert til PDFer

# Endre PDF i familie-ba-dokgen
Ved å mounte inn templates fra [familie-ba-dokgen](https://github.com/navikt/familie-ba-dokgen) kan du bruke
`docker-compose`-stacken til å gjøre endringer i PDF-genereringen. Fremgangsmåte:

* Klon ned familie-ba-dokgen ned lokalt start `compiler.py` der
* Uncomment volume mount under dokgen i `docker-compose.yml` i dette prosjektet og endre pathen til familie-ba-dokgen-repoet
* Start dokgen-servicen på nytt
* Når du er fornøyd, commit uncompiled og compiled templates i familie-ba-dokgen og push.
* Når du merger endringene i familie-ba-dokgen, oppdater `docker-compose.yml` til å bruke den nye commit-hashen for dokgen

# Bygg og deploy
Appen bygges hos github actions, og gir beskjed til nais deploy om å deployere appen i gcp. Alle commits til feature brancher går til dev miljøet og master går til produksjon.

# Feature toggles (Unleash)

Vi benytter `Unleash` for opprettelse av feature toggles i applikasjonen.

## Opprette ny toggle

I Unleash:
1. Gå til https://unleash.nais.io/#/features og opprett ny toggle ved å klikke på pluss-ikonet
2. Gi navn på ny toggle med prefix `familie-ba-soknad.`. Eks: `familie-ba-soknad.ny_toggle`
3. Legg til `activation strategy` = `byCluster` og spesifiser `dev-gcp` og/eller `prod-gcp` (Begge dersom toggelen skal benyttes i begge miljøer)

I kode:
1. Gå til fila `typer/feature-toggles.ts` og legg til ny toggle i enumen `EFeatureToggle` og registrer navnet på toggelen fra Unleash i `ToggleKeys`
2. Dersom toggelen skal defaulte til noe annet enn false må dette legges inn i `defaultFeatureToggleValues`

Eks:

```ts
// Legg til nye feature toggles her
export enum EFeatureToggle {
    NY_TOGGLE = 'NY_TOGGLE',
}

// Definer alle feature toggle keys her
export const ToggleKeys: Record<EFeatureToggle, string> = {
    [EFeatureToggle.NY_TOGGLE]: 'familie-ba-soknad.ny_toggle',
};

export type EAllFeatureToggles = Record<EFeatureToggle, boolean>;

// Default verdier som brukes dersom man ikke finner feature toggle i unleash.
export const defaultFeatureToggleValues: EAllFeatureToggles = {
    ...Object.values(EFeatureToggle).reduce((acc, featureToggle) => {
        acc[featureToggle] = false;
        return acc;
    }, {} as EAllFeatureToggles),
    // Dersom noen toggler ikke skal være default false:
    ...{ [EFeatureToggle.NY_TOGGLE]: true },
};
```

Toggelen kan derettes tas ibruk på følgende måte:

```ts
const { toggles } = useFeatureToggles();

if (toggles.NY_TOGGLE) {
    // Kode som kjører dersom NY_TOGGLE er enabled i Unleash
}
```

# Henvendelser

Ved spørsmål knyttet til koden eller prosjektet opprett en issue.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.


### Logging til Sentry
https://sentry.gc.nav.no/nav/familie-ba-soknad/

Bruk tag ``` scope:familie-ba-soknad ``` for å filtrere på kun exceptions fanget opp av Sentry.ErrorBoundary (dette vil f eks filtrere ut alle exceptions som nav-dokoratøren kaster)

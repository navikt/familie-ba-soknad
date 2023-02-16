# familie-ba-soknad

Frontend - søknad for barnetrygd.

## Avhengigheter
1. Node versjon >=16.17.0


## Log in på https://npm.pkg.github.com
På github -> Settings -> Developer Settings -> Generate New Token
Select scopes `repo` og `read:packages`

eksporter miljøvariabel NPM_TOKEN, f eks ved å legge til 
`export NPM_TOKEN=<ditt token>` i ~/.zshrc

## Kjør lokalt

1. `yarn install`
2. `yarn start:dev`
3. Kjør opp familie-baks-soknad-api

### Mellomlagring
For å kjøre med mellomlagring må du ha familie-dokument kjørende (https://github.com/navikt/familie-dokument).

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

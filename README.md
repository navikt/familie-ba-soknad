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

# Henvendelser

Ved spørsmål knyttet til koden eller prosjektet opprett en issue.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.

### Logging til Sentry
https://sentry.gc.nav.no/nav/familie-ba-soknad/

Bruk tag ``` scope:familie-ba-soknad ``` for å filtrere på kun exceptions fanget opp av Sentry.ErrorBoundary (dette vil f eks filtrere ut alle exceptions som nav-dokoratøren kaster)

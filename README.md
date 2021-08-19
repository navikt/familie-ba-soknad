# familie-ba-soknad

Frontend - søknad for barnetrygd.

## Avhengigheter
1. Node versjon >=14

## Kjør lokalt


1. `yarn install`
2. `yarn start:dev` evt `docker-compose up -d`

For å kjøre med mellomlagring må du ha familie-dokument kjørende (er en del av docker-compose stacken). 

## Kjør full app
For å kunne se PDFen som blir sent til joark (arkivering) lokalt må vi kjøre en del apper i tillegg til denne.
Alle disse tjenestene bygges og kjøres via docker-compose, kjør `docker-compose up` eller åpne `docker-compose.yml`
i intellij og start alle servicene for å komme i gang.

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

# Bygg og deploy
Appen bygges hos github actions, og gir beskjed til nais deploy om å deployere appen i gcp. Alle commits til feature brancher går til dev miljøet og master går til produksjon.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes til:

* Henning Håkonsen, `henning.hakonsen@nav.no`

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.


### Logging til Sentry
https://sentry.gc.nav.no/nav/familie-ba-soknad/

Bruk tag ``` scope:familie-ba-soknad ``` for å filtrere på kun exceptions fanget opp av Sentry.ErrorBoundary (dette vil f eks filtrere ut alle exceptions som nav-dokoratøren kaster)


# Preutfylling – testverktøy for preprod

Fyller ut hele søknaden for testpersonen som er logget inn, og sender testeren til oppsummeringen. Testeren velger et
scenario, eventuelle avvik fra happy case og hvilke barn søknaden gjelder.

## Slik er koden bygget opp

- `index.tsx` er inngangen. Den laster panelet når `skalVisePreutfylling.ts` sier at det skal vises, og `Feilgrense.tsx`
  fanger feil i panelet.
- `Preutfyllingspanel.tsx` viser panelet på forsiden.
- `form/` har skjemaet, laget med react-hook-form. `PreutfyllingForm.tsx` er skjemaet, og `usePreutfyllingForm.ts` har
  skjemaet og innsendingen. Hvert felt ligger i sin egen `*Field.tsx` med valideringsreglene sine. Kravet om minst ett
  barn ligger på feltet for fødselsnummer.
- `scenario.ts` har scenarioene, avvikene og regelen for hvilke valg som ikke kan kombineres.
- `byggPreutfyltSøknad.ts` lager søknaden ut fra valgene. Den bruker ikke React.
- `useGåTilOppsummering.ts` setter søknaden i søknadens egen tilstand og går til oppsummeringen.
- `tester/` har enhetstestene. `testoppsett.ts` der har tilfellene de kjøres for.

## Hvor panelet vises

- I preprod (`*.dev.nav.no`) ligger panelet alltid øverst på forsiden, lukket til testeren åpner det.
- Lokalt vises det bare når siden lastes med `?preutfylling` i adressen, for eksempel
  `/barnetrygd/soknad/?preutfylling`. Uten det er forsiden uten panelet når vi utvikler og kjører tester.
- I produksjon vises det aldri. `skalVisePreutfylling` slipper bare gjennom hostene over.

Preprod og produksjon bruker det samme bygget, så koden følger med til produksjon selv om den ikke brukes der:

- Koden til panelet ligger i en egen chunk. Den ligger i imaget og på CDN-et, men nettleseren henter den ikke i
  produksjon.
- Inngangen (`index.tsx`, `Feilgrense.tsx` og `skalVisePreutfylling.ts`) er med i hovedbundelen og gjør én sjekk av
  hosten for hver bruker.
- Fordi panelet lastes for seg, deler bygget ut to små felles chunker. Forsiden henter derfor to små skriptfiler mer
  enn uten verktøyet (om lag 1 kB).

## Slik er verktøyet skilt fra søknaden

- All koden ligger i denne mappen.
- Søknaden bruker verktøyet ett sted: `<PreutfyllingITestmiljø />` i `src/frontend/App.tsx`.
- Ende-til-ende-testen ligger i `playwright/tester/preutfylling.spec.ts`, fordi Playwright bare leter etter tester der.
- `tester/separasjon.test.ts` feiler hvis annen kode peker inn i mappen, hvis `App.tsx` importerer noe annet enn
  inngangen, eller hvis inngangen begynner å importere panelet eller kode fra søknaden.
- Verktøyet endrer ingen annen kode i søknaden. Det leser og setter tilstand gjennom `useAppContext`, `useStegContext`
  og `useEøsContext`, slik søknaden selv gjør når den gjenoppretter en mellomlagret søknad.
- Feiler panelet når det lastes eller tegnes, viser `Feilgrense` en melding i stedet for at feilen når søknaden.

Verktøyet påvirker likevel søknaden for testpersonen som bruker det:

- Den preutfylte søknaden mellomlagres og erstatter en søknad testpersonen har påbegynt. Den ligger der til testeren
  sender inn eller velger «Start på nytt», eller til mellomlagringen utløper. Det gjelder også for andre som logger inn
  med samme testperson.
- Gir verktøyet et steg en søknad steget ikke tåler, feiler steget til testeren velger «Start på nytt» og laster siden
  på nytt. «Start på nytt» alene nullstiller ikke EØS-stegene i søknaden.
- I preprod har forsiden et ekstra panel med en overskrift foran innholdet. Det kan gi utslag i tester av universell
  utforming som kjøres der.

## Regler verktøyet kopierer fra søknaden

Stegene i søknaden eier reglene. Verktøyet må gi de samme svarene som en søker ville fått lagret, og kopierer derfor
disse reglene:

| Regel                                      | Kilde                                                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Hvilke spørsmål som vises                  | `useOmdeg`, `useDinLivssituasjon`, `useOmBarnaDine`, `useOmBarnet`, `useEøsForSøker`, `useEøsForBarn` |
| Vedleggskrav                               | `oppdaterSøknad` i `useDinLivssituasjon`, `useOmBarnaDine` og `useOmBarnet`                           |
| Når søknaden får EØS-steg                  | `skalTriggeEøsForSøker` og `skalTriggeEøsForBarn` i `EøsContext`                                      |
| Hvordan et barn lagt til med fnr. ser ut   | `leggTilBarn` i `useLeggTilBarn`                                                                      |
| Hvordan perioder ser ut                    | dialogene for arbeidsperiode, barnetrygdperiode og utenlandsopphold                                   |
| Hva som settes når en søknad gjenopprettes | `fortsettPåSøknaden` i `useBekreftelseOgStartSoknad`                                                  |
| Hvor oppsummeringen ligger blant stegene   | `steg` i `StegContext` (kopiert i `useGåTilOppsummering.ts`)                                          |
| Hvilken id spørsmålet om samboer har       | `AppContext` når søkeren hentes (kopiert i `tester/testoppsett.ts`)                                   |

## Testene

Testene ligger i `tester/` og kjører i CI sammen med de andre enhetstestene:

- `byggPreutfyltSøknad.test.tsx` lar hvert steg i søknaden lagre den preutfylte søknaden på nytt og krever at ingenting
  endrer seg. Den sender også søknaden gjennom oppsummeringen og gjør den om til kontrakten.
- `Preutfyllingspanel.test.tsx` tester panelet: hva det setter i søknaden, og at det går til oppsummeringen.
- `index.test.tsx` tester at panelet ikke vises eller lastes der det ikke skal.
- `skalVisePreutfylling.test.ts` tester hvilke hoster som slipper gjennom, og leser hostene til appen fra `.nais/`.
  Finner den ingen ingresser, har formatet i `.nais/` endret seg. Oppdater da `hosterFraNais` i testen.
- `scenario.test.ts` tester hvilke valg som ikke kan kombineres.
- `separasjon.test.ts` tester at verktøyet er skilt fra resten av koden.

Ende-til-ende-testen er liten og dekker det bare et ekte bygg kan vise. Den kjører ikke i CI, fordi Playwright ikke gjør
det i dette repoet. Kjør den lokalt med `pnpm test:playwright preutfylling`.

Feiler `byggPreutfyltSøknad.test.tsx` etter en endring i søknaden, skriver ikke verktøyet lenger det søknaden selv ville
lagret. Da har du to valg:

1. Oppdater `byggPreutfyltSøknad.ts` så svarene passer med det nye spørsmålet eller den nye regelen.
2. Slett verktøyet hvis ingen bruker det lenger.

Slutter testen å kompilere fordi et steg er bygget om, for eksempel fordi `oppdaterSøknad` har fått nytt navn, er det
testen som må endres. EØS-stegene testes allerede gjennom komponenten og knappen «Gå videre». De andre stegene kan
testes på samme måte.

Dette fanger testene ikke opp:

- Datoene i periodene. De valideres bare i dialogene der søkeren legger dem til.
- Om mottaket godtar søknaden. Innsendingen er mocket.
- Svar på skjulte spørsmål som steget bare tar vare på. De viktigste har egne forventninger i testen.
- Panelet i en ekte nettleser. Det dekkes bare av ende-til-ende-testen.

## Slik legger du til et avvik

1. Legg til avviket og teksten i `scenario.ts`. Kan det ikke kombineres med andre valg, legger du regelen i
   `feilmeldingForUgyldigKombinasjon` samme sted.
2. Sett svarene i `fyllUtBarn` eller `fyllUtSøker` i `byggPreutfyltSøknad.ts`. Svarene i «Om barna dine» følger av
   svarene for hvert barn. Utløser avviket et vedleggskrav som ikke er i `medVedleggskrav`, legger du det til der.
3. Legg til forventningen i `FORVENTNINGER` i ende-til-ende-testen. Enhetstestene prøver avviket uten flere endringer.

## Slik legger du til et scenario

1. Legg til scenarioet og teksten i `scenario.ts`, og i `EØS_SCENARIOER` hvis søknaden skal ha EØS-steg.
2. Sett svarene i `byggPreutfyltSøknad.ts`. Et EØS-scenario må også sette `triggetEøs` i `fyllUtSøker` eller
   `fyllUtBarn`, ellers får søknaden ingen EØS-steg.
3. Oppdater forventningen til `erEøs` i `byggPreutfyltSøknad.test.tsx` hvis scenarioet ikke er et EØS-scenario. Resten
   av enhetstestene prøver scenarioet uten flere endringer.
4. Legg til en test som sender inn scenarioet i ende-til-ende-testen.

## Slik sletter du verktøyet

1. Slett mappen `src/frontend/preutfylling/`.
2. Fjern importen og `<PreutfyllingITestmiljø />` i `src/frontend/App.tsx`.
3. Slett `playwright/tester/preutfylling.spec.ts`.
4. Kjør `pnpm remove react-hook-form` hvis ingen annen kode bruker pakken. Skjemaet i panelet er det eneste som bruker
   den i dag.

`pnpm validate` feiler til steg 2 og 3 er gjort, fordi begge filene importerer fra mappen. Utover `react-hook-form` har
verktøyet ikke lagt til avhengigheter, konfigurasjon, tekster eller noe i backend.

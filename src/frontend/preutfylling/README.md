# Preutfylling – testverktøy for preprod

Fyller ut hele søknaden for testpersonen som er logget inn, og sender testeren til oppsummeringen. Testeren velger et
scenario, eventuelle avvik fra happy case og hvilke barn søknaden gjelder.

## Hvor panelet vises

- I preprod (`*.dev.nav.no`) ligger panelet alltid øverst på forsiden, lukket til testeren åpner det.
- Lokalt vises det bare når siden lastes med `?preutfylling` i adressen, for eksempel
  `/barnetrygd/soknad/?preutfylling`. Uten det er forsiden lik den i produksjon når vi utvikler og kjører tester.
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
- Søknaden bruker verktøyet ett sted: `<Preutfylling />` i `src/frontend/App.tsx`.
- Ende-til-ende-testen ligger i `playwright/tester/preutfylling.spec.ts`, fordi Playwright bare leter etter tester der.
- `separasjon.test.ts` feiler hvis annen kode peker inn i mappen, hvis `App.tsx` importerer noe annet enn inngangen,
  eller hvis inngangen begynner å importere panelet eller kode fra søknaden.
- Verktøyet endrer ingen kode i søknaden. Det leser og setter tilstand gjennom `useAppContext`, `useStegContext` og
  `useEøsContext`, slik søknaden selv gjør når den gjenoppretter en mellomlagret søknad.
- Feiler panelet når det lastes eller tegnes, viser `Feilgrense` en melding i stedet for at feilen når søknaden.

Verktøyet påvirker likevel søknaden for testpersonen som bruker det:

- Den preutfylte søknaden mellomlagres og erstatter en søknad testpersonen har påbegynt. Den ligger der til testeren
  sender inn eller velger «Start på nytt», også for andre som logger inn med samme testperson.
- Gir verktøyet et steg en søknad steget ikke tåler, feiler steget til testeren velger «Start på nytt» og laster siden
  på nytt. «Start på nytt» alene nullstiller ikke EØS-stegene i søknaden.
- I preprod har forsiden et ekstra panel med en overskrift foran innholdet. Det kan gi utslag i tester av universell
  utforming som kjøres der.

## Regler verktøyet kopierer fra søknaden

Stegene i søknaden eier reglene. `byggPreutfyltSøknad.ts` må gi de samme svarene som en søker ville fått lagret, og
kopierer derfor disse reglene:

| Regel                                      | Kilde                                                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Hvilke spørsmål som vises                  | `useOmdeg`, `useDinLivssituasjon`, `useOmBarnaDine`, `useOmBarnet`, `useEøsForSøker`, `useEøsForBarn` |
| Vedleggskrav                               | `oppdaterSøknad` i `useDinLivssituasjon`, `useOmBarnaDine` og `useOmBarnet`                           |
| Når søknaden får EØS-steg                  | `skalTriggeEøsForSøker` og `skalTriggeEøsForBarn` i `EøsContext`                                      |
| Hvordan et barn lagt til for hånd ser ut   | `leggTilBarn` i `useLeggTilBarn`                                                                      |
| Hvordan perioder ser ut                    | dialogene for arbeidsperiode, barnetrygdperiode og utenlandsopphold                                   |
| Hva som settes når en søknad gjenopprettes | `fortsettPåSøknaden` i `useBekreftelseOgStartSoknad`                                                  |

## Testene

Testene i mappen kjører i CI sammen med de andre enhetstestene:

- `byggPreutfyltSøknad.test.tsx` lar hvert steg i søknaden lagre den preutfylte søknaden på nytt og krever at ingenting
  endrer seg. Den sender også søknaden gjennom oppsummeringen og gjør den om til kontrakten.
- `Preutfyllingspanel.test.tsx` tester panelet: hva det setter i søknaden, og at det går til oppsummeringen.
- `index.test.tsx` tester at panelet ikke vises eller lastes der det ikke skal.
- `skalVisePreutfylling.test.ts` tester hvilke hoster som slipper gjennom, og leser hostene til appen fra `.nais/`.
- `separasjon.test.ts` tester at verktøyet er skilt fra resten av koden.

Ende-til-ende-testen er liten og dekker det bare et ekte bygg kan vise. Den kjører ikke i CI, fordi Playwright ikke gjør
det i dette repoet. Kjør den lokalt med `pnpm test:playwright preutfylling`.

Feiler `byggPreutfyltSøknad.test.tsx` etter en endring i søknaden, skriver ikke verktøyet lenger det søknaden selv ville
lagret. Da har du to valg:

1. Oppdater `byggPreutfyltSøknad.ts` så svarene passer med det nye spørsmålet eller den nye regelen.
2. Slett verktøyet hvis ingen bruker det lenger.

Dette fanger ikke testene:

- Datoene i periodene. De valideres bare i dialogene der søkeren legger dem til.
- Om mottaket godtar søknaden. Innsendingen er mocket.
- Svar på skjulte spørsmål som steget bare tar vare på. De viktigste har egne forventninger nederst i testen.
- Panelet i en ekte nettleser. Det dekkes bare av ende-til-ende-testen.

## Slik legger du til et avvik

1. Legg til avviket og teksten i `scenario.ts`.
2. Sett svarene i `lagBarnMedISøknad` eller `lagSøker` i `byggPreutfyltSøknad.ts`. Svarene i «Om barna dine» og
   vedleggskravene følger av svarene for hvert barn.
3. Legg til forventningen i `FORVENTET_SVAR` i ende-til-ende-testen. Enhetstestene prøver avviket uten flere endringer.

## Slik sletter du verktøyet

1. Slett mappen `src/frontend/preutfylling/`.
2. Fjern importen og `<Preutfylling />` i `src/frontend/App.tsx`.
3. Slett `playwright/tester/preutfylling.spec.ts`.

`pnpm validate` feiler til steg 2 og 3 er gjort, fordi begge filene importerer fra mappen. Verktøyet har ikke lagt til
avhengigheter, konfigurasjon, tekster eller noe i backend.

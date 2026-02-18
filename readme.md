# 🚀 Test Monorepo: Astro + Preact + Lit

Projekt demonstracyjny architektury typu **Micro-frontends** wykorzystujący **pnpm workspaces** oraz **Turborepo**. System łączy wydajność Astro, elastyczność Preacta oraz reużywalność komponentów Web Components stworzonych w bibliotece Lit.



## 🏗️ Struktura Projektu

Repozytorium jest podzielone na aplikacje (**apps**) oraz współdzielone pakiety (**packages**):

### Apps
- **`apps/test-portal` (Astro 5.0)**: Główna powłoka (shell) systemu. Odpowiada za routing, SEO i statyczne strony. Wykorzystuje **Astro View Transitions** do płynnej nawigacji.
- **`apps/test-dashboard` (Preact)**: Aplikacja typu SPA (Single Page Application) montowana dynamicznie wewnątrz portalu. Obsługuje logikę panelu użytkownika.

### Packages (`@shared/*`)
- **`packages/ui`**: Biblioteka komponentów **Lit** (Custom Elements). Działają niezależnie od frameworka (Astro, Preact, czysty HTML).
- **`packages/logic`**: Współdzielona logika biznesowa, Query Client (TanStack Query) oraz sygnały Preact.
- **`packages/types`**: Centralne repozytorium typów TypeScript oraz schematów walidacji **Zod**.
- **`packages/locales`**: Współdzielone zasoby i18n (pliki JSON).

---

## 🛠️ Szybki Start

Projekt wymaga zainstalowanego menedżera pakietów **pnpm**.

### 1. Instalacja zależności
```bash
pnpm install
```

### 2. Uruchomienie deweloperskie

Uruchamia portal i dashboard równolegle przy pomocy Turborepo:

```bash
pnpm dev
pnpm turbo dev
pnpm turbo dev --filter=test-portal
```

- Portal: http://localhost:4321
- Dashboard: http://localhost:3001

### 3. Budowanie

```bash
pnpm run build:all
pnpm run build:all:prod
```

Oto sformatowany fragment README, gotowy do skopiowania, zaczynający się od sekcji ze stosem technologicznym:

Markdown
## 🧩 Stack Technologiczny

| Warstwa | Technologia |
| :--- | :--- |
| **Orkiestracja** | Turborepo, pnpm Workspaces |
| **Główny Shell** | Astro 5 (View Transitions) |
| **Dashboard** | Preact |
| **UI Components** | Lit (Custom Elements) |
| **Stylizacja** | Tailwind CSS v4 |
| **Walidacja** | Zod |
| **Interakcje** | Alpine.js (wewnątrz Lit components) |

---

## 💡 Kluczowe Rozwiązania

### Custom Elements Bridge
Komponenty Lit (np. `register-form`) są zintegrowane z Preactem poprzez dedykowane **Adaptery**. Dzięki temu zachowujemy pełne typowanie propsów i zdarzeń `CustomEvent` przy użyciu TypeScripta.



### Współdzielone Schematy (Shared Schemas)
Zarówno komponenty UI (Lit), jak i aplikacja Dashboard (Preact), korzystają z tych samych schematów Zod zdefiniowanych w `@shared/types`. Gwarantuje to spójną walidację danych po obu stronach (Single Source of Truth).

### Re-inicjalizacja Dashboardu (Astro Shell)
Ze względu na użycie **View Transitions** w Astro, Dashboard jest automatycznie montowany ponownie przy każdej nawigacji. Rozwiązuje to problem skryptów typu "execute-once" w środowiskach SPA-like.


---

## 📝 Rozwiązywanie Problemów

### Dekoratory TypeScript
Jeśli edytor zgłasza błąd przy `@customElement`, upewnij się, że `tsconfig.json` w danym pakiecie zawiera:
```json
"compilerOptions": {
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

### JSX IntrinsicElements
Nowe komponenty Lit muszą być zarejestrowane w global.d.ts w aplikacji dashboard, aby TypeScript rozpoznawał niestandardowe tagi HTML wewnątrz JSX bez błędów o braku typu:

```bash
import 'preact';

declare module 'preact' {
  namespace JSX {
    interface IntrinsicElements {
      'register-form': any; // Lub dokładniejszy interfejs propsów
    }
  }
}
```

### Problemy z kompilacją (Project References)
Pakiety współdzielone używają trybu `"composite": true`. Jeśli TypeScript zgłasza błędy dotyczące referencji projektów:
- Upewnij się, że każdy pakiet w `packages/` ma włączoną flagę `composite` w swoim `tsconfig.json`.
- Spróbuj wykonać `pnpm build` w głównym katalogu, aby wygenerować pliki `.tsbuildinfo` wymagane przez kompilator.
- W razie trwałych problemów w VS Code, użyj komendy: `TypeScript: Restart TS Server`.

### Obsługa Alpine.js w środowisku Dev
W trybie deweloperskim Dashboardu (port 3001), Alpine.js jest inicjalizowany ręcznie w `entry.tsx`. Na produkcji (Portal), Alpine jest dostarczany przez integrację Astro. Jeśli dyrektywy `x-data` nie działają, sprawdź czy `window.Alpine` jest poprawnie zdefiniowany.

---


## 🏗️ Build & Deployment

System budowania oparty jest na **Turborepo**, co zapewnia optymalne wykorzystanie cache'u i równoległą kompilację wszystkich mikro-frontendów.

### Komendy budowania
| Komenda | Opis |
| :--- | :--- |
| `pnpm run build:all` | Buduje wszystkie paczki i aplikacje w trybie deweloperskim (z Source Maps). |
| `pnpm run build:all:prod` | Pełna optymalizacja produkcyjna (minifikacja, tree-shaking) wszystkich modułów. |
| `pnpm run postbuild:all` | Skrypty po-buildowe: czyszczenie assetów i przygotowanie struktury dystrybucyjnej. |

### Dystrybucja modułów
Po zakończeniu procesu budowania, artefakty są automatycznie kopiowane do centralnego katalogu:
`📂 /modules`

Dashboard w trybie Runtime dynamicznie ładuje manifesty mikro-aplikacji właśnie z tego folderu, co pozwala na wierną symulację środowiska produkcyjnego podczas lokalnego developmentu.

---

## 📡 Central Logger System

Wprowadziliśmy autorski system logowania rozproszonego, który konsoliduje strumienie danych ze wszystkich mikro-frontendów (React, Preact, Web Components) w jednym, interaktywnym terminalu.



### Architektura Loggera
Każdy mikro-frontend korzysta ze współdzielonej paczki `@shared/logic`, która:
* **Wykrywa środowisko**: Automatycznie aktywuje się na `localhost` lub w trybie `development`.
* **Non-blocking**: Wykorzystuje `fetch` z flagą `keepalive: true`, co pozwala na logowanie zdarzeń nawet tuż przed zamknięciem karty/odświeżeniem strony.
* **Kategoryzacja**: Logi są grupowane w przejrzyste tagi: `Lifecycle`, `Event`, `UX`, `Auth`, `Validation`.

### Uruchamianie serwera logów
Aby uruchomić centralny nasłuch logów w dedykowanym oknie terminala, użyj:

```bash
# Uruchomienie deweloperskie z obsługą logów
pnpm dev:logs

# Szybkie uruchomienie z roota
pnpm logs

# Lub bezpośrednio
node tools/log-server/index.js
```

### Interfejs Terminala (Sticky Header)
Serwer logów posiada interaktywne menu zarządzane w czasie rzeczywistym (reaguje na pojedyncze klawisze, bez potrzeby naciskania Enter):

* **`[1-6]`** – Przełączanie widoczności logów dla konkretnych mikro-aplikacji (Astro, UI, Dashboard, Task Manager, Event-Bus, etc.).
* **`[+/-]`** – Dynamiczna zmiana poziomu filtrowania (`DEBUG` → `INFO` → `WARN` → `ERROR` → `CRITICAL`).
* **`[q]`** – Bezpieczne wyjście i automatyczne przywrócenie domyślnych ustawień przewijania terminala.



---

## 🛡️ Error Boundary & Validation

Bezpieczeństwo i stabilność ekosystemu opiera się na dwóch kluczowych mechanizmach:

### 1. Izolacja błędów (Error Boundary)
Każdy moduł (React, Preact) jest opakowany w komponent `ErrorBoundary`. W przypadku wystąpienia błędu krytycznego:
* **Stabilność**: Błąd jest izolowany wewnątrz modułu, zapobiegając awarii całego Dashboardu.
* **Raportowanie**: Logger automatycznie wysyła raport `CRITICAL` wraz ze stack-trace'em do centralnego serwera logów.
* **Komunikacja**: Przez `event-bus` emitowane jest zdarzenie `COMPONENT_CRASHED`, umożliwiając Dashboardowi wyświetlenie interfejsu awaryjnego (np. przycisku "Reboot Module").

### 2. Walidacja Schematów (Zod)
Wszystkie formularze i dane wejściowe (np. `RegisterForm`) są walidowane przy użyciu biblioteki **Zod**.
* **UX**: Spersonalizowane, polskie komunikaty błędów (np. *"Hasła nie są identyczne"*).
* **Analityka**: Każda nieudana próba walidacji jest logowana jako `WARN` w kategorii `Validation`, co pozwala na bieżące monitorowanie problemów użytkowników z formularzami.

---
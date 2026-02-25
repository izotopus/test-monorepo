# 🚀 Test Monorepo: Astro + Preact + Lit

Projekt demonstracyjny architektury typu **Micro-frontends** wykorzystujący **pnpm workspaces** oraz **Turborepo**. System łączy wydajność Astro, elastyczność Preacta oraz reużywalność komponentów Web Components stworzonych w bibliotece Lit.



## 🏗️ Struktura Projektu

Repozytorium jest podzielone na aplikacje (**apps**) oraz współdzielone pakiety (**packages**):

### Apps
- **`apps/test-portal` (Astro 5.0)**: Główna powłoka (shell) systemu. Odpowiada za routing, SEO i serwowanie modułów statycznych. Wykorzystuje **Astro View Transitions** do płynnej nawigacji między modułami.
- **`apps/test-dashboard` (Preact)**: Centralny panel sterowania (SPA), który zarządza stanem sesji i dynamicznym montowaniem mikrofrontendów.
- **`apps/test-task-manager` (React)**: Mikrofrontend odpowiedzialny za zarządzanie zadaniami. Może działać w trybie **Live Dev** (Vite) lub być ładowany jako **moduł statyczny** z Portalu.
- **`apps/test-analytics` (Angular 19)**: Moduł analityczny wykorzystujący potężne możliwości Angulara. Podczas budowania jest spłaszczany przez kolektor do formatu ESM, co pozwala na jego bezproblemową integrację z shellem Astro.

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
```

- Portal: http://localhost:4321
- Dashboard: http://localhost:3001
- Test TM: http://localhost:3002
- ANalitycs: http://localhost:3010

### 3. Budowanie

```bash
pnpm run build:all
pnpm run build:all:prod
```

---

## 🛠️ Rozwój i Budowanie (Orkiestracja)

System wykorzystuje autorski skrypt `dev-orchestrator.js`, który zarządza dynamicznym przełączaniem modułów między trybem **Live Dev** (hot-reload) a **Static Build** (ładowanie z dysku).

### 1. Konfiguracja Środowiska (dev-config.yaml)

Sercem systemu jest plik `dev-config.yaml`. To tutaj decydujesz, które aplikacje mają być uruchomione w trybie deweloperskim, a które mają być serwowane jako gotowe paczki statyczne.

```yaml
apps:
  TEST_PORTAL:
    name: "test-portal"
    devUrl: "http://localhost:4321"
    type: dev # Zawsze uruchamia serwer Astro
  
  TASK_MANAGER:
    name: "@apps/test-task-manager"
    devUrl: "http://localhost:3002/src/main.tsx"
    prodUrl: "/modules/task-manager/main.js"
    distDir: "apps/test-task-manager/dist"
    type: build # Moduł będzie serwowany statycznie z /public portalu
```

### 2. Mechanizm działania:
- `type: dev`: Orkiestrator uruchamia proces `pnpm turbo dev` dla tej aplikacji. Dashboard łączy się z nią bezpośrednio przez `devUrl`.
- `type: build`: Orkiestrator buduje aplikację, a skrypt `collect-modules.js` kopiuje jej pliki do `/apps/test-portal/public/modules`. Dashboard ładuje ją z portu Portalu, oszczędzając zasoby systemowe.

### 3. Mechanizm działania:
- `pnpm dev`: Standardowy start na podstawie `dev-config.yaml`. Generuje configi TS i uruchamia serwery.
- `pnpm dev:logs`: Uruchamia środowisko z włączonym przesyłaniem logów do centralnego serwera.
- `pnpm build:all`: Buduje wszystkie paczki i aplikacje w trybie lokalnym.
- `pnpm build:all:prod`: Pełny build produkcyjny (wymusza `type: build` dla wszystkich MF i wstrzykuje `BASE_URL`).
- `pnpm collect`: Ręczne odświeżenie plików statycznych w folderze `/public` portalu.
- `pnpm collect:prod`: Kopiowanie modułów do finalnego folderu `/dist` portalu przed wdrożeniem.

### 4. Zaawansowane Budowanie (Turborepo):
Możesz budować poszczególne aplikacje z pominięciem orkiestratora, korzystając z filtrów:
```bash
# Buduje tylko aplikację Analytics i jej zależności
pnpm turbo build --filter=@apps/test-analytics

# Czyszczenie cache i wymuszenie świeżego buildu
pnpm turbo build --force
```

### 5. Generowanie Konfiguracji:
Przy każdym uruchomieniu `pnpm dev` lub pnpm `build:all`, orkiestrator generuje pliki:
- `packages/logic/src/microfrontends/generated-config.dev.ts`
- `packages/logic/src/microfrontends/generated-config.prod.ts`

Pliki te zawierają aktualne adresy URL oraz flagi globalne (np. `ENABLE_LOGS`), które są automatycznie importowane przez mikrofrontendy.

---

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

## 📡 Central Logger System

Autorski system logowania rozproszonego, który konsoliduje strumienie danych ze wszystkich mikro-frontendów (React, Preact, Web Components) w jednym, interaktywnym terminalu.


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
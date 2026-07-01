# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Type-check + production build
npm run lint         # ESLint
npm run test         # Run all tests once (Vitest)
npm run test:watch   # Run tests in watch mode
```

To run a single test file:
```bash
npx vitest run src/shared/api/fetch/fetchRequest.test.ts
```

## Architecture

The project follows **Feature-Sliced Design (FSD)** — a strict layered architecture where each layer can only import from layers below it.

```
src/
  app/        # App entry, router, Redux store, global middlewares
  pages/      # Page components; may own local Redux slices (e.g., challenges)
  features/   # User-facing feature modules (e.g., auth forms, useAuth hook)
  entities/   # Domain objects with their Redux slices (user, notifications)
  widgets/    # Composed UI blocks (e.g., NotificationList)
  shared/     # Foundational utilities, no business logic
```

Each slice exposes a public API through an `index.ts` barrel — always import from the barrel, never from internal paths.

The `@` alias resolves to `src/`, configured in both [vite.config.ts](vite.config.ts) and [tsconfig.app.json](tsconfig.app.json).

## HTTP / API Layer (`src/shared/api/`)

All network calls go through `http` ([src/shared/api/http.ts](src/shared/api/http.ts)), which wraps `fetchRequest` ([src/shared/api/fetch/fetchRequest.ts](src/shared/api/fetch/fetchRequest.ts)).

Key behaviors:
- `fetchRequest` retries on server errors and network failures up to `CONSTANTS.MAX_REFETCH_ATTEMPTS` (3) with exponential backoff. 4xx errors are **not** retried.
- `http` automatically injects the `Authorization: Bearer <token>` header for authenticated requests. Pass `auth = false` for public endpoints.
- On a 401, `http` triggers a single shared `refreshRequest()` (deduplicated via a cached promise) and retries the original request. `refreshRequest()` hits `/auth/refresh`, sets the new access token itself, and resolves to the user (`IUser`) or `null` on failure — it does **not** redirect. The redirect-to-`/login` policy lives in the 401 interceptor (`requestData`): if refresh yields no session mid-request, it redirects there. Restore-on-boot calls `refreshRequest()` directly, so a failed refresh just means "guest" (no redirect).
- `requestImitation` in `src/shared/api/requestImitation.ts` is a dev-only mock helper — not used in real API calls.

**Request hooks** (for use in components):
- `useRequest` — fires automatically on mount; for data fetching.
- `useMutationRequest` — returns `{ isLoading, mutate }`; for form submissions / user-triggered actions. Its second arg is an options object: `{ onSuccess, onError, onSettled }`.

Both hooks dispatch `addNotification({ type: 'error', ... })` on failure automatically.

## Auth Flow

`accessTokenProvider` ([src/shared/api/accessTokenProvider.ts](src/shared/api/accessTokenProvider.ts)) keeps the access token in module-level memory, **never** `localStorage`. This is the security boundary — a tampered client-side cache can't grant real access because every request needs the in-memory token.

Auth hooks live under `src/features/auth/hooks/`:
- **Login / signup** — `useAuth` ([useAuth.tsx](src/features/auth/hooks/useAuth.tsx)) wraps `useMutationRequest` and dispatches `setUserToStore` on success.
- **Session restore on boot** — `useRestoreSession` ([useRestoreSession.tsx](src/features/auth/hooks/useRestoreSession.tsx)) calls `refreshRequest()` (which sets the token and returns the user), then dispatches `setUserToStore` on success or `resetUserStore` on `null`. It runs **only inside the app area** (see Routing) — never on `/login`, `/signup`, or 404.
- **Logout** — `useLogout` ([useLogout.tsx](src/features/auth/hooks/useLogout.tsx)) clears the token + display cache, then does a full `window.location.replace(ROUTES.LOGIN)` to nuke all in-memory state.

**Display cache:** `userStorage` ([src/entities/user/model/userStorage.ts](src/entities/user/model/userStorage.ts)) persists only non-sensitive display fields (`nickname`, `role`, `fullname`, `email`) to `localStorage` — never the token. It seeds `userSlice` `initialState` so the `Header` shows the real user immediately (no guest flash) before restore resolves; `userPersistMiddleware` keeps it in sync (write on `setUserToStore`, clear on `resetUserStore`); `useLogout` clears it explicitly before the reload.

`UserAccessData` (`src/features/auth/auth.types.ts`) extends `IUser` with `accessToken`.

## Redux Store

Store ([src/app/providers/ReduxProvider/store.ts](src/app/providers/ReduxProvider/store.ts)) has three slices, plus `userPersistMiddleware` (syncs the user display cache to `localStorage`):
- `user` — current user identity and role (`UserRole` = `visitor` | `participant` | `moderator` | `admin`); `initialState.user` is seeded from `userStorage`
- `challenges` — owned by the `pages/challenges` page layer
- `notifications` — global toast/notification queue

Use typed hooks from `src/shared/lib/hooks/redux.ts` (`useAppDispatch`, `useAppSelector`) instead of the raw Redux hooks.

## Routing & Role Guards

Routes ([src/app/routes/index.tsx](src/app/routes/index.tsx)) use React Router v7 object config (`createBrowserRouter`). Layout and access control are done with **components**, not loaders:

- `RootLayout` ([src/app/layouts/RootLayout.tsx](src/app/layouts/RootLayout.tsx)) — root shell (`Header`/`Footer`/`NotificationList`) around **every** page; no session restore.
- `AppLayout` ([src/app/layouts/AppLayout.tsx](src/app/layouts/AppLayout.tsx)) — wraps only the app area. Runs `useRestoreSession` (renders `Loader` until it resolves), then picks the role layout. Resolving the role **before** the role layout (and its `<Outlet/>`) mounts avoids an `undefined -> role` swap that would remount the routed subtree and re-fire restore.
- `GuestRoute` ([src/app/routes/GuestRoute.tsx](src/app/routes/GuestRoute.tsx)) — wraps `/login` and `/signup`; redirects already-authenticated users to home.
- `ProtectedRoute` ([src/app/routes/ProtectedRoute.tsx](src/app/routes/ProtectedRoute.tsx)) — `allowedRoles?` guard; redirects to `/login` (no user) or `/forbidden` (wrong role).

Keep `<Outlet/>` at a stable tree position — never nest it inside a component whose type swaps by role, or the whole routed subtree remounts.

All route paths are constants in `src/shared/config/routes.ts` — always use `ROUTES.*` rather than hardcoded strings.

## WebSocket (`src/shared/api/socket/SocketClient.ts`)

`SocketClient` is a class wrapping the native `WebSocket` with:
- Automatic reconnection with exponential backoff + jitter (up to `MAX_REFETCH_ATTEMPTS`)
- Heartbeat ping/pong mechanism (60 s interval, 10 s pong timeout triggers reconnect)
- Send queue for messages sent before the connection opens (max 50 entries, oldest dropped on overflow)
- Intentional close vs. unexpected close distinction to suppress reconnect on manual `close()`

## Testing

Tests use Vitest + jsdom + Testing Library. Setup file: `src/shared/config/tests.ts` (imports `@testing-library/jest-dom`). Vitest globals (`describe`, `it`, `expect`, `vi`) are available without imports.

Use `muteConsole()` from `src/shared/lib/test` to suppress expected console output in tests that intentionally trigger errors/warnings.

## Environment Variables

`VITE_API_URL` — base URL for all API calls. Set in `.env.development` for local development.

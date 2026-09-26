# Photo Library

A photo library built with Angular 22 (standalone components, zoneless change detection, signals),
Angular Material and SCSS. It shows a random photo stream with infinite scrolling, lets you keep
favorites that survive a refresh, and opens each favorite in a fullscreen details view.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.8 and updated to Angular 22.2.0.
It requires Node.js 22 or newer.

## Architecture

```text
src/app/
  app.config.ts          application providers (router, zoneless CD, Material icon setup)
  app.routes.ts          lazy-loaded feature routes
  core/layout/header/    application shell header with navigation
  core/favorites/        FavoritesStore: signal-based single source of truth for favorites
  core/storage/          LocalStorageService: guarded JSON access to localStorage
  shared/models/         domain models shared across features
  shared/components/     reusable presentational components (photo card)
  shared/directives/     reusable directives (infinite scroll via IntersectionObserver)
  features/
    photos/              "/"            random photo stream; PhotoService simulates the API
    favorites/           "/favorites"   persisted favorites
    photo-details/       "/photos/:id"  fullscreen photo view
```

Key decisions:

- **Favorites state** lives in a single signal-based store (`FavoritesStore`). Pages read its
  signals and call `add` / `remove`; persistence to `localStorage` is an internal detail.
- **Photo API** is simulated in `PhotoService` with a random 200-300 ms delay so the UI
  behaves as it would against a real backend. Image URLs are seeded by the photo id, so a
  favorite always shows the same picture.
- **Infinite scrolling** is a reusable `InfiniteScrollDirective` wrapping `IntersectionObserver`.
  It only reports that the end was reached; the page decides what to load.
- **Photo card** is a shared presentational component with a heart button for favoriting and an
  optional selectable body, used by both the stream and the favorites page.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Vitest](https://vitest.dev) (Node.js + jsdom, no browser required). Run `npm run test:coverage` for a single run with a coverage report in `coverage/`.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

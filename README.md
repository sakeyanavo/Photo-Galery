
# Photo Library

A small Angular 22 app (standalone components, signals, zoneless) with Angular Material and Tailwind CSS.
It shows a stream of random photos with infinite scrolling, lets you save favorites
(persisted in `localStorage`) and opens a favorite in a fullscreen details view.

Requires Node.js 22 or newer.

## Structure

```text
src/app/
  app.routes.ts                       "/", "/favorites", "/photos/:id"
  core/layout/header/                 header with navigation
  core/services/favorites/            FavoritesService: favorites state (signal) persisted to localStorage
  shared/models/photo.model.ts        Photo { id, url }
  shared/components/photo-card/       image + heart button, used by both lists
  shared/directives/                  InfiniteScrollDirective: emits when its element scrolls into view
  features/
    services/photo.service.ts         simulated API: random photos after a 200-300 ms delay
    pages/photos/                     photo stream, tap the photo or the heart to (un)favorite
    pages/photos/photo-details/       fullscreen photo with "Remove from favorites"
    pages/favorites/                  saved photos, tap a photo to open it
```

## Commands

- `npm start` – dev server on `http://localhost:4200/`
- `npm test` – unit tests (Vitest)
- `npm run build` – production build into `dist/`

## Technologies and why

- **Angular 22** with standalone components, signals and zoneless change detection. Signals keep
  the state model tiny: the favorites list is one `signal<Photo[]>` and every page reads it directly,
  so there is no store library, no RxJS subjects and no manual change detection.
- **Angular Material** for the toolbar, buttons, icons and spinner, so the app gets accessible,
  consistent controls and a colour theme without writing them by hand.
- **Tailwind CSS v4** (via `@tailwindcss/postcss` and `.postcssrc.json`) for layout and hover styles.
  Utility classes keep all styling next to the markup, which removed every component stylesheet.
  Material colours are used through their CSS variables, e.g. `bg-(--mat-sys-primary)`.
- **RxJS** only where it fits naturally: the simulated photo API returns an `Observable` with a
  `timer` delay, like a real `HttpClient` call would.
- **IntersectionObserver** for infinite scrolling. It fires when the sentinel element becomes visible,
  which is cheaper and simpler than listening to scroll events and measuring positions.
- **localStorage** for persistence. Favorites must survive a refresh and there is no backend, so a
  JSON array under one key is the simplest thing that works.
- **Vitest** with jsdom for unit tests, because the project template already used it and it runs
  without a browser.

## Most difficult problems and why

1. **Infinite scroll that keeps loading when the first batch does not fill the screen.**
   An `IntersectionObserver` only fires when visibility *changes*. After a batch loads, if the
   sentinel is still on screen nothing changes, so no new event arrives and the list gets stuck.
2. **The details page flashing "Photo not found" while removing a favorite.**
   Removing the photo from the store and navigating away happen at almost the same time. If the
   store updates first, the page briefly renders the not-found branch before the navigation lands.
3. **Making Tailwind and Angular Material work together.**
   Angular's build only runs Tailwind v4 through PostCSS, and without the config file the import is
   inlined as raw source and no utility classes are generated. Material also styles its own
   components (for example the toolbar background), which overrides same-specificity utilities.

## How the solutions were found

1. Reading the `IntersectionObserver` documentation confirmed that a newly created observer reports
   the initial intersection state immediately. So instead of keeping one observer alive, the photos
   page renders the sentinel only while not loading. After each batch the element is re-created, the
   directive creates a fresh observer, and if the sentinel is still visible it fires straight away.
2. Reordering the two calls: navigate to `/favorites` first and remove the photo only after the
   `router.navigate` promise resolves. By then the details component is destroyed, so it never sees
   the empty state.
3. Following the Angular section of the Tailwind installation guide and inspecting the built
   `styles.css`: a 29 kB file full of theme variables and no `.grid` class meant PostCSS had not run,
   while an 18 kB file with the utilities meant it had. For the toolbar background the Tailwind
   important modifier (`bg-white!`) was enough, and the toolbar's own colour rule was checked in the
   browser DevTools to confirm the conflict.

## Time spent

About 10 hours in total over two days: roughly 5 hours for the project setup, upgrade to Angular 22
and the first working version, and roughly 5 hours for simplifying the code, restructuring the
folders, switching the styling to Tailwind and updating the tests.


<img width="1722" height="967" alt="Screenshot 2026-09-26 at 18 10 08" src="https://github.com/user-attachments/assets/16d7f834-bd23-4e65-a54d-d5c678f6df6a" />
<img width="1722" height="967" alt="Screenshot 2026-09-26 at 18 10 32" src="https://github.com/user-attachments/assets/7ac98dc2-dd6b-45ff-9e3e-f280caff0fb3" />
<img width="1722" height="967" alt="Screenshot 2026-09-26 at 18 10 43" src="https://github.com/user-attachments/assets/c7e29da3-8845-4cf2-bcc4-9fccf6edfea1" />

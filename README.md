# Photo Library

A small Angular 22 app (standalone components, signals, zoneless) with Angular Material.
It shows a stream of random photos with infinite scrolling, lets you save favorites
(persisted in `localStorage`) and opens a favorite in a fullscreen details view.

Requires Node.js 22 or newer.

## Structure

```text
src/app/
  app.routes.ts                  "/", "/favorites", "/photos/:id"
  core/layout/header/            header with navigation
  core/favorites/                FavoritesService: favorites state (signal) persisted to localStorage
  shared/models/photo.model.ts   Photo { id, url }
  shared/components/photo-card/  image + heart button, used by both lists
  shared/directives/             InfiniteScrollDirective: emits when its element scrolls into view
  features/
    photos/                      photo stream + PhotoService (random photos after a 200-300 ms delay)
    favorites/                   saved photos, tap a photo to open it
    photo-details/               fullscreen photo with "Remove from favorites"
```

## Commands

- `npm start` – dev server on `http://localhost:4200/`
- `npm test` – unit tests (Vitest)
- `npm run build` – production build into `dist/`

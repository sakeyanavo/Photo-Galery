import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Photos · Photo Library',
    loadComponent: () => import('./features/photos/photos-page.component').then(m => m.PhotosPageComponent),
  },
  {
    path: 'favorites',
    title: 'Favorites · Photo Library',
    loadComponent: () =>
      import('./features/favorites/favorites-page.component').then(m => m.FavoritesPageComponent),
  },
  {
    path: 'photos/:id',
    title: 'Photo · Photo Library',
    loadComponent: () =>
      import('./features/photo-details/photo-details-page.component').then(m => m.PhotoDetailsPageComponent),
  },
  { path: '**', redirectTo: '' },
];

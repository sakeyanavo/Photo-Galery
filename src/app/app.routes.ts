import { Routes } from '@angular/router';
import { FavoritesPageComponent } from './features/pages/favorites/favorites-page.component';
import { PhotoDetailsPageComponent } from './features/pages/photos/photo-details/photo-details-page.component';
import { PhotosPageComponent } from './features/pages/photos/photos-page.component';

export const routes: Routes = [
  { path: '', component: PhotosPageComponent },
  { path: 'favorites', component: FavoritesPageComponent },
  { path: 'photos/:id', component: PhotoDetailsPageComponent },
  { path: '**', redirectTo: '' },
];

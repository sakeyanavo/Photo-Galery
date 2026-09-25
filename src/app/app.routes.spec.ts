import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { routes } from './app.routes';
import { FavoritesPageComponent } from './features/favorites/favorites-page.component';
import { PhotoDetailsPageComponent } from './features/photo-details/photo-details-page.component';
import { PhotosPageComponent } from './features/photos/photos-page.component';

describe('app routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter(routes)],
    });
    harness = await RouterTestingHarness.create();
  });

  it('renders the photos page on the root route', async () => {
    const component = await harness.navigateByUrl('/', PhotosPageComponent);
    expect(component).toBeInstanceOf(PhotosPageComponent);
  });

  it('renders the favorites page on /favorites', async () => {
    const component = await harness.navigateByUrl('/favorites', FavoritesPageComponent);
    expect(component).toBeInstanceOf(FavoritesPageComponent);
  });

  it('renders the photo details page on /photos/:id', async () => {
    const component = await harness.navigateByUrl('/photos/42', PhotoDetailsPageComponent);
    expect(component).toBeInstanceOf(PhotoDetailsPageComponent);
  });

  it('redirects unknown routes to the photos page', async () => {
    await harness.navigateByUrl('/does-not-exist');
    expect(TestBed.inject(Router).url).toBe('/');
  });
});

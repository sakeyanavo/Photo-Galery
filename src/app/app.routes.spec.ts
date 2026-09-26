import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { appConfig } from './app.config';
import { FavoritesPageComponent } from './features/favorites/favorites-page.component';
import { PhotoDetailsPageComponent } from './features/photo-details/photo-details-page.component';
import { PhotosPageComponent } from './features/photos/photos-page.component';

describe('app routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    localStorage.clear();
    // Use the real application providers so route features such as component
    // input binding are exercised exactly as in production.
    TestBed.configureTestingModule({ providers: [appConfig.providers] });
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

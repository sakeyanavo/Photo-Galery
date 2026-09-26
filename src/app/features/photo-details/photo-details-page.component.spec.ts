import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FavoritesStore } from '../../core/favorites/favorites.store';
import { Photo } from '../../shared/models/photo.model';
import { PhotoDetailsPageComponent } from './photo-details-page.component';

@Component({ template: '' })
class BlankComponent {}

const photo = (id: string): Photo => ({
  id,
  url: `https://example.com/${id}.jpg`,
  width: 400,
  height: 600,
  alt: `Photo ${id}`,
});

describe('PhotoDetailsPageComponent', () => {
  let harness: RouterTestingHarness;
  let favorites: FavoritesStore;
  let router: Router;

  const element = () => harness.routeNativeElement as HTMLElement;
  const img = () => element().querySelector<HTMLImageElement>('img');
  const removeButton = () =>
    Array.from(element().querySelectorAll('button')).find(b => b.textContent?.includes('Remove from favorites'));

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [
            { path: 'photos/:id', component: PhotoDetailsPageComponent },
            { path: 'favorites', component: BlankComponent },
            { path: '', component: BlankComponent },
          ],
          withComponentInputBinding(),
        ),
      ],
    });
    favorites = TestBed.inject(FavoritesStore);
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  it('resolves the photo from the route id and renders it fullscreen', async () => {
    favorites.add(photo('a'));
    favorites.add(photo('b'));

    await harness.navigateByUrl('/photos/b', PhotoDetailsPageComponent);

    expect(img()?.getAttribute('src')).toBe(photo('b').url);
    expect(img()?.getAttribute('alt')).toBe('Photo b');
    expect(element().querySelector('.not-found')).toBeNull();
  });

  it('links back to the favorites page', async () => {
    favorites.add(photo('a'));
    await harness.navigateByUrl('/photos/a', PhotoDetailsPageComponent);

    const back = element().querySelector<HTMLAnchorElement>('a.details__back');
    expect(back?.getAttribute('href')).toBe('/favorites');
  });

  it('removes the photo from favorites and navigates back to /favorites', async () => {
    favorites.add(photo('a'));
    await harness.navigateByUrl('/photos/a', PhotoDetailsPageComponent);

    removeButton()?.click();
    await harness.fixture.whenStable();

    expect(favorites.has('a')).toBe(false);
    expect(router.url).toBe('/favorites');
  });

  it('shows a not-found state for an unknown id', async () => {
    await harness.navigateByUrl('/photos/missing', PhotoDetailsPageComponent);

    expect(img()).toBeNull();
    expect(removeButton()).toBeUndefined();
    const notFound = element().querySelector('.not-found');
    expect(notFound).not.toBeNull();
    expect(notFound?.querySelector('a')?.getAttribute('href')).toBe('/favorites');
  });

  it('reacts when the route id changes', async () => {
    favorites.add(photo('a'));
    favorites.add(photo('b'));
    await harness.navigateByUrl('/photos/a', PhotoDetailsPageComponent);
    expect(img()?.getAttribute('alt')).toBe('Photo a');

    await harness.navigateByUrl('/photos/b', PhotoDetailsPageComponent);
    expect(img()?.getAttribute('alt')).toBe('Photo b');
  });

  it('falls back to an error state when the image fails to load', async () => {
    favorites.add(photo('a'));
    await harness.navigateByUrl('/photos/a', PhotoDetailsPageComponent);

    img()?.dispatchEvent(new Event('error'));
    await harness.fixture.whenStable();

    expect(img()).toBeNull();
    expect(element().querySelector('.details__fallback')).not.toBeNull();
    expect(removeButton()).toBeDefined();
  });
});

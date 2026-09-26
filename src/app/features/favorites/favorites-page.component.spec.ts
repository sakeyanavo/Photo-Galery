import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FAVORITES_STORAGE_KEY, FavoritesStore } from '../../core/favorites/favorites.store';
import { Photo } from '../../shared/models/photo.model';
import { FavoritesPageComponent } from './favorites-page.component';

@Component({ template: '' })
class BlankComponent {}

const photo = (id: string): Photo => ({
  id,
  url: `https://example.com/${id}.jpg`,
  width: 400,
  height: 600,
  alt: `Photo ${id}`,
});

describe('FavoritesPageComponent', () => {
  let fixture: ComponentFixture<FavoritesPageComponent>;
  let element: HTMLElement;
  let favorites: FavoritesStore;
  let router: Router;

  const cards = () => element.querySelectorAll('app-photo-card');
  const emptyState = () => element.querySelector('.empty');

  const configure = async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent],
      providers: [
        provideRouter([
          { path: '', component: BlankComponent },
          { path: 'photos/:id', component: BlankComponent },
        ]),
      ],
    }).compileComponents();
    favorites = TestBed.inject(FavoritesStore);
    router = TestBed.inject(Router);
  };

  const render = async () => {
    fixture = TestBed.createComponent(FavoritesPageComponent);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('shows an empty state with a link to the photo stream when there are no favorites', async () => {
    await configure();
    await render();

    expect(cards()).toHaveLength(0);
    expect(emptyState()).not.toBeNull();
    expect(emptyState()?.querySelector('a')?.getAttribute('href')).toBe('/');
  });

  it('renders one card per favorite, newest first', async () => {
    await configure();
    favorites.add(photo('a'));
    favorites.add(photo('b'));
    await render();

    expect(emptyState()).toBeNull();
    expect(cards()).toHaveLength(2);
    expect(cards()[0].querySelector('img')?.getAttribute('alt')).toBe('Photo b');
    expect(cards()[1].querySelector('img')?.getAttribute('alt')).toBe('Photo a');
  });

  it('marks every card as a favorite and makes it selectable', async () => {
    await configure();
    favorites.add(photo('a'));
    await render();

    const card = cards()[0];
    expect(card.querySelector('.card__fav--active')).not.toBeNull();
    expect(card.querySelector('button.card__body')?.getAttribute('aria-label')).toBe('Open photo: Photo a');
  });

  it('navigates to the photo details when a card is clicked', async () => {
    await configure();
    favorites.add(photo('a'));
    await render();

    cards()[0].querySelector<HTMLButtonElement>('button.card__body')?.click();
    await fixture.whenStable();

    expect(router.url).toBe('/photos/a');
  });

  it('removes a favorite from its heart button and updates the list', async () => {
    await configure();
    favorites.add(photo('a'));
    favorites.add(photo('b'));
    await render();

    cards()[0].querySelector<HTMLButtonElement>('.card__fav')?.click();
    await fixture.whenStable();

    expect(favorites.has('b')).toBe(false);
    expect(cards()).toHaveLength(1);
    expect(cards()[0].querySelector('img')?.getAttribute('alt')).toBe('Photo a');
  });

  it('shows the empty state again once the last favorite is removed', async () => {
    await configure();
    favorites.add(photo('a'));
    await render();

    cards()[0].querySelector<HTMLButtonElement>('.card__fav')?.click();
    await fixture.whenStable();

    expect(cards()).toHaveLength(0);
    expect(emptyState()).not.toBeNull();
  });

  it('renders favorites persisted by a previous session', async () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([photo('x'), photo('y')]));
    await configure();
    await render();

    expect(cards()).toHaveLength(2);
  });
});

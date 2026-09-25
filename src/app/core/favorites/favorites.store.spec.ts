import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Photo } from '../../shared/models/photo.model';
import { FAVORITES_STORAGE_KEY, FavoritesStore } from './favorites.store';

const photo = (id: string): Photo => ({
  id,
  url: `https://example.com/${id}.jpg`,
  width: 400,
  height: 600,
  alt: `Photo ${id}`,
});

describe('FavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const createStore = () => TestBed.inject(FavoritesStore);

  it('starts empty when nothing is persisted', () => {
    const store = createStore();
    expect(store.favorites()).toEqual([]);
    expect(store.count()).toBe(0);
  });

  it('adds a photo and exposes it through the signals', () => {
    const store = createStore();
    expect(store.add(photo('a'))).toBe(true);

    expect(store.favorites()).toEqual([photo('a')]);
    expect(store.count()).toBe(1);
    expect(store.has('a')).toBe(true);
    expect(store.get('a')).toEqual(photo('a'));
  });

  it('prevents duplicate favorites', () => {
    const store = createStore();
    store.add(photo('a'));

    expect(store.add(photo('a'))).toBe(false);
    expect(store.favorites()).toHaveLength(1);
  });

  it('removes a favorite and reports whether anything was removed', () => {
    const store = createStore();
    store.add(photo('a'));
    store.add(photo('b'));

    expect(store.remove('a')).toBe(true);
    expect(store.remove('a')).toBe(false);
    expect(store.favorites()).toEqual([photo('b')]);
    expect(store.has('a')).toBe(false);
  });

  it('persists every change to localStorage', () => {
    const store = createStore();
    store.add(photo('a'));
    store.add(photo('b'));
    store.remove('a');

    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([photo('b')]);
  });

  it('restores favorites persisted by a previous session', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([photo('a'), photo('b')]));

    const store = createStore();
    expect(store.favorites()).toEqual([photo('a'), photo('b')]);
    expect(store.has('b')).toBe(true);
  });

  it('ignores corrupt or malformed persisted data', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([photo('a'), { id: 'broken' }, 'nope', null]));

    const store = createStore();
    expect(store.favorites()).toEqual([photo('a')]);
  });
});

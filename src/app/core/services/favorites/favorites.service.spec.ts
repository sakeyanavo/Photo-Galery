import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FavoritesService } from './favorites.service';

const photo = { id: 'a', url: 'https://example.com/a.jpg' };

describe('FavoritesService', () => {
  beforeEach(() => localStorage.clear());

  it('adds, finds and removes photos', () => {
    const service = TestBed.inject(FavoritesService);

    service.add(photo);
    service.add(photo);
    expect(service.photos()).toEqual([photo]);
    expect(service.isFavorite('a')).toBe(true);
    expect(service.getById('a')).toEqual(photo);

    service.remove('a');
    expect(service.photos()).toEqual([]);
    expect(service.isFavorite('a')).toBe(false);
  });

  it('persists favorites in localStorage', () => {
    TestBed.inject(FavoritesService).add(photo);

    TestBed.resetTestingModule();
    expect(TestBed.inject(FavoritesService).photos()).toEqual([photo]);
  });
});

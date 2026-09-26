import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FavoritesService } from '../../../core/services/favorites/favorites.service';
import { Photo } from '../../../shared/models/photo.model';
import { FavoritesPageComponent } from './favorites-page.component';

const photo: Photo = { id: 'a', url: 'https://example.com/a.jpg' };

describe('FavoritesPageComponent', () => {
  let fixture: ComponentFixture<FavoritesPageComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('shows an empty message when there are no favorites', async () => {
    fixture = TestBed.createComponent(FavoritesPageComponent);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No favorites yet');
  });

  it('lists favorites, opens details on click and removes from the heart', async () => {
    const favorites = TestBed.inject(FavoritesService);
    favorites.add(photo);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(FavoritesPageComponent);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('app-photo-card')).toHaveLength(1);

    host.querySelector<HTMLButtonElement>('img')!.click();
    expect(navigate).toHaveBeenCalledWith(['/photos', 'a']);

    host.querySelector<HTMLButtonElement>('[aria-label]')!.click();
    await fixture.whenStable();
    expect(favorites.photos()).toEqual([]);
    expect(host.querySelectorAll('app-photo-card')).toHaveLength(0);
  });
});

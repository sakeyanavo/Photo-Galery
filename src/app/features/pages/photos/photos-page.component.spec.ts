import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FavoritesService } from '../../../core/services/favorites/favorites.service';
import { Photo } from '../../../shared/models/photo.model';
import { PhotoService } from '../../services/photo.service';
import { PhotosPageComponent } from './photos-page.component';

const batch: Photo[] = [
  { id: 'a', url: 'https://example.com/a.jpg' },
  { id: 'b', url: 'https://example.com/b.jpg' },
];

describe('PhotosPageComponent', () => {
  let fixture: ComponentFixture<PhotosPageComponent>;

  beforeEach(async () => {
    localStorage.clear();
    vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });

    await TestBed.configureTestingModule({
      imports: [PhotosPageComponent],
      providers: [provideZonelessChangeDetection(), { provide: PhotoService, useValue: { getPhotos: () => of(batch) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosPageComponent);
    await fixture.whenStable();
  });

  it('loads the first batch of photos', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('app-photo-card')).toHaveLength(2);
  });

  it('toggles a favorite from the heart button', async () => {
    const favorites = TestBed.inject(FavoritesService);
    const heart = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.card__heart')!;

    heart.click();
    await fixture.whenStable();
    expect(favorites.photos()).toEqual([batch[0]]);
    expect(heart.textContent?.trim()).toBe('favorite');

    heart.click();
    await fixture.whenStable();
    expect(favorites.photos()).toEqual([]);
  });
});

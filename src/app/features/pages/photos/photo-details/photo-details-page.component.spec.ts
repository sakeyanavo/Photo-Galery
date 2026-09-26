import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FavoritesService } from '../../../../core/services/favorites/favorites.service';
import { Photo } from '../../../../shared/models/photo.model';
import { PhotoDetailsPageComponent } from './photo-details-page.component';

const photo: Photo = { id: 'a', url: 'https://example.com/a.jpg' };

describe('PhotoDetailsPageComponent', () => {
  let fixture: ComponentFixture<PhotoDetailsPageComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PhotoDetailsPageComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  async function create(id: string): Promise<HTMLElement> {
    fixture = TestBed.createComponent(PhotoDetailsPageComponent);
    fixture.componentRef.setInput('id', id);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the favorite photo and removes it', async () => {
    const favorites = TestBed.inject(FavoritesService);
    favorites.add(photo);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    const host = await create('a');
    expect(host.querySelector('img')?.src).toBe(photo.url);

    host.querySelector('button')!.click();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledWith(['/favorites']);
    expect(favorites.photos()).toEqual([]);
  });

  it('shows a not found message for an unknown id', async () => {
    const host = await create('missing');
    expect(host.textContent).toContain('Photo not found');
  });
});

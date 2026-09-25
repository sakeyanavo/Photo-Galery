import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FavoritesStore } from '../../core/favorites/favorites.store';
import { InfiniteScrollDirective } from '../../shared/directives/infinite-scroll.directive';
import { Photo } from '../../shared/models/photo.model';
import { PhotoService } from './photo.service';
import { PhotosPageComponent } from './photos-page.component';

const makePhotos = (prefix: string, count: number): Photo[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    url: `https://example.com/${prefix}-${i}.jpg`,
    width: 400,
    height: 600,
    alt: `Photo ${prefix}-${i}`,
  }));

describe('PhotosPageComponent', () => {
  let fixture: ComponentFixture<PhotosPageComponent>;
  let element: HTMLElement;
  let batch$: Subject<Photo[]>;
  let photoService: { loadBatch: ReturnType<typeof vi.fn> };
  let favorites: FavoritesStore;

  const cards = () => element.querySelectorAll('app-photo-card');
  const spinner = () => element.querySelector('mat-progress-spinner');
  const scrollToEnd = () =>
    fixture.debugElement.query(By.directive(InfiniteScrollDirective)).injector.get(InfiniteScrollDirective).scrolledToEnd.emit();

  const resolveBatch = async (photos: Photo[]) => {
    batch$.next(photos);
    batch$.complete();
    batch$ = new Subject<Photo[]>();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    batch$ = new Subject<Photo[]>();
    photoService = { loadBatch: vi.fn(() => batch$) };

    await TestBed.configureTestingModule({
      imports: [PhotosPageComponent],
      providers: [{ provide: PhotoService, useValue: photoService }],
    }).compileComponents();

    favorites = TestBed.inject(FavoritesStore);
    fixture = TestBed.createComponent(PhotosPageComponent);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('requests the first batch immediately and shows a loader while waiting', () => {
    expect(photoService.loadBatch).toHaveBeenCalledTimes(1);
    expect(spinner()).not.toBeNull();
    expect(cards()).toHaveLength(0);
  });

  it('renders the loaded photos and hides the loader', async () => {
    await resolveBatch(makePhotos('a', 12));

    expect(cards()).toHaveLength(12);
    expect(spinner()).toBeNull();
  });

  it('appends the next batch when the infinite-scroll directive fires', async () => {
    await resolveBatch(makePhotos('a', 12));

    scrollToEnd();
    await fixture.whenStable();
    expect(photoService.loadBatch).toHaveBeenCalledTimes(2);
    expect(spinner()).not.toBeNull();

    await resolveBatch(makePhotos('b', 12));
    expect(cards()).toHaveLength(24);
  });

  it('ignores scroll events while a batch is already loading', () => {
    scrollToEnd();
    scrollToEnd();
    expect(photoService.loadBatch).toHaveBeenCalledTimes(1);
  });

  it('toggles a photo in favorites from its heart button', async () => {
    const photos = makePhotos('a', 3);
    await resolveBatch(photos);

    const heart = cards()[0].querySelector<HTMLButtonElement>('.card__fav');
    heart?.click();
    await fixture.whenStable();

    expect(favorites.favorites()).toEqual([photos[0]]);
    expect(heart?.classList).toContain('card__fav--active');

    heart?.click();
    await fixture.whenStable();
    expect(favorites.count()).toBe(0);
    expect(heart?.classList).not.toContain('card__fav--active');
  });

  it('does not make photos clickable on the stream page', async () => {
    await resolveBatch(makePhotos('a', 2));
    expect(element.querySelector('button.card__body')).toBeNull();
  });

  it('shows an error state with a retry action when loading fails', async () => {
    batch$.error(new Error('boom'));
    await fixture.whenStable();

    const alert = element.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(spinner()).toBeNull();

    batch$ = new Subject<Photo[]>();
    alert?.querySelector('button')?.click();
    await fixture.whenStable();

    expect(photoService.loadBatch).toHaveBeenCalledTimes(2);
    expect(element.querySelector('[role="alert"]')).toBeNull();
  });
});

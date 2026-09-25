import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FavoritesStore } from '../../core/favorites/favorites.store';
import { PhotoCardComponent } from '../../shared/components/photo-card/photo-card.component';
import { InfiniteScrollDirective } from '../../shared/directives/infinite-scroll.directive';
import { Photo } from '../../shared/models/photo.model';
import { PhotoService } from './photo.service';

const BATCH_SIZE = 12;

@Component({
  selector: 'app-photos-page',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, PhotoCardComponent, InfiniteScrollDirective],
  templateUrl: './photos-page.component.html',
  styleUrl: './photos-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosPageComponent {
  private readonly photoService = inject(PhotoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly favorites = inject(FavoritesStore);
  protected readonly photos = signal<Photo[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly canLoadMore = computed(() => !this.loading() && this.error() === null);

  constructor() {
    this.loadMore();
  }

  protected loadMore(): void {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.photoService
      .loadBatch(BATCH_SIZE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: batch => {
          this.photos.update(current => [...current, ...batch]);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('We could not load more photos right now.');
          this.loading.set(false);
        },
      });
  }

  protected toggleFavorite(photo: Photo): void {
    if (!this.favorites.remove(photo.id)) {
      this.favorites.add(photo);
    }
  }
}

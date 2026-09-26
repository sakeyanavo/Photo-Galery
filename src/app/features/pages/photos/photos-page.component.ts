import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FavoritesService } from '../../../core/services/favorites/favorites.service';
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll.directive';
import { PhotoCardComponent } from '../../../shared/components/photo-card/photo-card.component';
import { Photo } from '../../../shared/models/photo.model';
import { PhotoService } from '../../services/photo.service';

const BATCH_SIZE = 12;

@Component({
  selector: 'app-photos-page',
  imports: [MatProgressSpinnerModule, PhotoCardComponent, InfiniteScrollDirective],
  templateUrl: './photos-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosPageComponent {
  private readonly photoService = inject(PhotoService);

  protected readonly favorites = inject(FavoritesService);
  protected readonly photos = signal<Photo[]>([]);
  protected readonly loading = signal(false);

  constructor() {
    this.loadMore();
  }

  protected loadMore(): void {
    this.loading.set(true);
    this.photoService.getPhotos(BATCH_SIZE).subscribe(batch => {
      this.photos.update(photos => [...photos, ...batch]);
      this.loading.set(false);
    });
  }

  protected toggleFavorite(photo: Photo): void {
    if (this.favorites.isFavorite(photo.id)) {
      this.favorites.remove(photo.id);
    } else {
      this.favorites.add(photo);
    }
  }
}

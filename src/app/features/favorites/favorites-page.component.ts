import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FavoritesStore } from '../../core/favorites/favorites.store';
import { PhotoCardComponent } from '../../shared/components/photo-card/photo-card.component';
import { Photo } from '../../shared/models/photo.model';

@Component({
  selector: 'app-favorites-page',
  imports: [MatButtonModule, MatIconModule, RouterLink, PhotoCardComponent],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPageComponent {
  private readonly router = inject(Router);
  private readonly favorites = inject(FavoritesStore);

  // Most recently saved first, so a photo just added on the stream page is easy to find.
  protected readonly photos = computed(() => this.favorites.favorites().slice().reverse());
  protected readonly count = this.favorites.count;

  protected open(photo: Photo): void {
    void this.router.navigate(['/photos', photo.id]);
  }

  protected remove(photo: Photo): void {
    this.favorites.remove(photo.id);
  }
}

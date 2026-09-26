import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../../../core/services/favorites/favorites.service';
import { PhotoCardComponent } from '../../../shared/components/photo-card/photo-card.component';
import { Photo } from '../../../shared/models/photo.model';

@Component({
  selector: 'app-favorites-page',
  imports: [RouterLink, PhotoCardComponent],
  templateUrl: './favorites-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPageComponent {
  private readonly router = inject(Router);

  protected readonly favorites = inject(FavoritesService);

  protected open(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }
}

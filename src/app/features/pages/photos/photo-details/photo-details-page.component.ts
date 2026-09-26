import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../../../../core/services/favorites/favorites.service';

@Component({
  selector: 'app-photo-details-page',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './photo-details-page.component.html',
  styleUrl: './photo-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailsPageComponent {
  private readonly router = inject(Router);
  private readonly favorites = inject(FavoritesService);

  /** Route parameter, bound by `withComponentInputBinding()`. */
  readonly id = input.required<string>();

  protected readonly photo = computed(() => this.favorites.getById(this.id()));

  protected async remove(): Promise<void> {
    // Navigate first so the "not found" state never shows while leaving the page.
    await this.router.navigate(['/favorites']);
    this.favorites.remove(this.id());
  }
}

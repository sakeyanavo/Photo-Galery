import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FavoritesStore } from '../../core/favorites/favorites.store';

@Component({
  selector: 'app-photo-details-page',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './photo-details-page.component.html',
  styleUrl: './photo-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailsPageComponent {
  private readonly router = inject(Router);
  private readonly favorites = inject(FavoritesStore);

  /** Bound from the `:id` route parameter via `withComponentInputBinding()`. */
  readonly id = input.required<string>();

  protected readonly photo = computed(() => this.favorites.get(this.id()));

  // Reset when navigating between photos so a broken image does not stick to the next one.
  protected readonly imageFailed = linkedSignal({ source: this.id, computation: () => false });

  // While the removal navigation is in flight the photo is already gone from the store;
  // this flag keeps the "not found" state from flashing before /favorites renders.
  protected readonly removing = signal(false);

  protected remove(): void {
    this.removing.set(true);
    this.favorites.remove(this.id());
    void this.router.navigate(['/favorites']);
  }

  protected onImageError(): void {
    this.imageFailed.set(true);
  }
}

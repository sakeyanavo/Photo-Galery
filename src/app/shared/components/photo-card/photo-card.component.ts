import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Photo } from '../../models/photo.model';

type ImageStatus = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-photo-card',
  imports: [MatIconModule, NgTemplateOutlet],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCardComponent {
  readonly photo = input.required<Photo>();
  readonly favorite = input(false);
  /** Makes the photo itself clickable; `selected` is emitted on click. */
  readonly selectable = input(false);
  /** Spoken label for clicking the photo when it is selectable ("Open photo"). */
  readonly actionLabel = input('Open photo');

  readonly selected = output<Photo>();
  readonly favoriteToggled = output<Photo>();

  // Resets to "loading" whenever a different photo is bound to a reused card.
  protected readonly status = linkedSignal<Photo, ImageStatus>({
    source: this.photo,
    computation: () => 'loading',
  });

  protected readonly selectLabel = computed(() => `${this.actionLabel()}: ${this.photo().alt}`);
  protected readonly favoriteButtonLabel = computed(
    () => `${this.favorite() ? 'Remove from favorites' : 'Add to favorites'}: ${this.photo().alt}`,
  );

  protected select(): void {
    this.selected.emit(this.photo());
  }

  protected toggleFavorite(): void {
    this.favoriteToggled.emit(this.photo());
  }

  protected onLoad(): void {
    this.status.set('loaded');
  }

  protected onError(): void {
    this.status.set('error');
  }
}

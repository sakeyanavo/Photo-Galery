import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-photo-card',
  imports: [MatIconModule],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCardComponent {
  readonly photo = input.required<Photo>();
  readonly favorite = input(false);

  /** Emitted when the photo itself is clicked. */
  readonly selected = output<Photo>();
  /** Emitted when the heart button is clicked. */
  readonly favoriteToggled = output<Photo>();
}

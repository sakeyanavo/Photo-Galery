import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-photo-details-page',
  templateUrl: './photo-details-page.component.html',
  styleUrl: './photo-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailsPageComponent {}

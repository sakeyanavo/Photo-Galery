import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-photos-page',
  templateUrl: './photos-page.component.html',
  styleUrl: './photos-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosPageComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPageComponent {}

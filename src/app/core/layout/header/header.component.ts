import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  readonly label: string;
  readonly icon: string;
  readonly path: string;
  readonly exact: boolean;
}

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // The root path must match exactly, otherwise "/photos/:id" would also light up "Photos".
  protected readonly navItems: readonly NavItem[] = [
    { label: 'Photos', icon: 'photo_library', path: '/', exact: true },
    { label: 'Favorites', icon: 'favorite', path: '/favorites', exact: false },
  ];
}

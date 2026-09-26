import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('renders links to the photos and favorites pages', async () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('.header__link[href="/"]')?.textContent).toContain('Photos');
    expect(host.querySelector('.header__link[href="/favorites"]')?.textContent).toContain('Favorites');
  });
});

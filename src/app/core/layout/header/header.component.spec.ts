import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { HeaderComponent } from './header.component';

@Component({ template: '' })
class BlankComponent {}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let host: HTMLElement;
  let router: Router;

  const link = (label: string): HTMLAnchorElement => {
    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('a'));
    const match = links.find(a => a.textContent?.includes(label));
    if (!match) {
      throw new Error(`Link "${label}" not found`);
    }
    return match;
  };

  const navigate = async (url: string) => {
    await router.navigateByUrl(url);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: '', component: BlankComponent },
          { path: 'favorites', component: BlankComponent },
          { path: 'photos/:id', component: BlankComponent },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HeaderComponent);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('renders the brand link pointing to the photos route', () => {
    const brand = host.querySelector<HTMLAnchorElement>('.header__brand');
    expect(brand).not.toBeNull();
    expect(brand?.getAttribute('href')).toBe('/');
  });

  it('renders navigation links for Photos and Favorites', () => {
    expect(link('Photos').getAttribute('href')).toBe('/');
    expect(link('Favorites').getAttribute('href')).toBe('/favorites');
  });

  it('marks only the Photos link active on the root route', async () => {
    await navigate('/');

    expect(link('Photos').classList).toContain('active');
    expect(link('Photos').getAttribute('aria-current')).toBe('page');
    expect(link('Favorites').classList).not.toContain('active');
  });

  it('marks only the Favorites link active on the favorites route', async () => {
    await navigate('/favorites');

    expect(link('Favorites').classList).toContain('active');
    expect(link('Favorites').getAttribute('aria-current')).toBe('page');
    expect(link('Photos').classList).not.toContain('active');
  });

  it('does not treat the photo details route as the root route', async () => {
    await navigate('/photos/42');

    expect(link('Photos').classList).not.toContain('active');
    expect(link('Favorites').classList).not.toContain('active');
  });
});

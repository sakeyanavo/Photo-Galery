import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Photo } from '../../models/photo.model';
import { PhotoCardComponent } from './photo-card.component';

const photo: Photo = { id: 'p1', url: 'https://example.com/p1.jpg', width: 400, height: 600, alt: 'A photo' };

@Component({
  imports: [PhotoCardComponent],
  template: `
    <app-photo-card
      [photo]="photo()"
      [favorite]="favorite()"
      [selectable]="selectable()"
      actionLabel="Open photo"
      (selected)="selected = $event"
      (favoriteToggled)="toggled = $event" />
  `,
})
class HostComponent {
  readonly photo = signal(photo);
  readonly favorite = signal(false);
  readonly selectable = signal(false);
  selected: Photo | null = null;
  toggled: Photo | null = null;
}

describe('PhotoCardComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  const img = () => element.querySelector<HTMLImageElement>('img');
  const favButton = () => element.querySelector<HTMLButtonElement>('.card__fav');
  const bodyButton = () => element.querySelector<HTMLButtonElement>('button.card__body');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('renders the photo image with alt text and intrinsic size', () => {
    expect(img()?.getAttribute('src')).toBe(photo.url);
    expect(img()?.getAttribute('alt')).toBe(photo.alt);
    expect(img()?.getAttribute('width')).toBe('400');
    expect(img()?.getAttribute('height')).toBe('600');
  });

  it('emits favoriteToggled only from the heart button', () => {
    favButton()?.click();

    expect(host.toggled).toEqual(photo);
    expect(host.selected).toBeNull();
  });

  it('labels the heart button with the action it will perform', async () => {
    expect(favButton()?.getAttribute('aria-label')).toBe('Add to favorites: A photo');
    expect(favButton()?.getAttribute('aria-pressed')).toBe('false');

    host.favorite.set(true);
    await fixture.whenStable();

    expect(favButton()?.getAttribute('aria-label')).toBe('Remove from favorites: A photo');
    expect(favButton()?.getAttribute('aria-pressed')).toBe('true');
    expect(favButton()?.classList).toContain('card__fav--active');
  });

  it('does not make the photo clickable unless selectable', () => {
    expect(bodyButton()).toBeNull();
  });

  it('emits selected when a selectable photo is clicked', async () => {
    host.selectable.set(true);
    await fixture.whenStable();

    expect(bodyButton()?.getAttribute('aria-label')).toBe('Open photo: A photo');
    bodyButton()?.click();

    expect(host.selected).toEqual(photo);
    expect(host.toggled).toBeNull();
  });

  it('shows a placeholder until the image has loaded', async () => {
    expect(element.querySelector('.card__skeleton')).not.toBeNull();

    img()?.dispatchEvent(new Event('load'));
    await fixture.whenStable();

    expect(element.querySelector('.card__skeleton')).toBeNull();
  });

  it('falls back to an error state when the image fails to load', async () => {
    img()?.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(element.querySelector('.card__fallback')).not.toBeNull();
    expect(img()).toBeNull();
  });
});

import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Photo } from '../../models/photo.model';
import { PhotoCardComponent } from './photo-card.component';

const photo: Photo = { id: 'a', url: 'https://example.com/a.jpg' };

describe('PhotoCardComponent', () => {
  let fixture: ComponentFixture<PhotoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCardComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCardComponent);
    fixture.componentRef.setInput('photo', photo);
    await fixture.whenStable();
  });

  it('shows the photo and emits when it is clicked', () => {
    const selected: Photo[] = [];
    fixture.componentInstance.selected.subscribe(p => selected.push(p));
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('img')?.src).toBe(photo.url);
    host.querySelector<HTMLButtonElement>('img')!.click();
    expect(selected).toEqual([photo]);
  });

  it('shows the favorite state and emits when the heart is clicked', async () => {
    const toggled: Photo[] = [];
    fixture.componentInstance.favoriteToggled.subscribe(p => toggled.push(p));
    const heart = () => (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('[aria-label]')!;

    expect(heart().textContent).toContain('favorite_border');
    fixture.componentRef.setInput('favorite', true);
    await fixture.whenStable();
    expect(heart().textContent?.trim()).toBe('favorite');

    heart().click();
    expect(toggled).toEqual([photo]);
  });
});

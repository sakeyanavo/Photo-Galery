import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  it('returns the requested number of photos with unique ids', async () => {
    const photos = await firstValueFrom(TestBed.inject(PhotoService).getPhotos(5));

    expect(photos).toHaveLength(5);
    expect(new Set(photos.map(photo => photo.id)).size).toBe(5);
    for (const photo of photos) {
      expect(photo.url).toContain(photo.id);
    }
  });
});

import { Injectable } from '@angular/core';
import { Observable, map, timer } from 'rxjs';
import { Photo } from '../../shared/models/photo.model';

/** Simulates a photo API: returns random photos after a 200-300 ms delay. */
@Injectable({ providedIn: 'root' })
export class PhotoService {
  getPhotos(count: number): Observable<Photo[]> {
    const delay = 200 + Math.random() * 100;
    return timer(delay).pipe(map(() => Array.from({ length: count }, createPhoto)));
  }
}

function createPhoto(): Photo {
  const id = Math.random().toString(36).slice(2, 10);
  // Seeding the URL with the id keeps the image stable for favorites and the details page.
  return { id, url: `https://picsum.photos/seed/${id}/400/600` };
}

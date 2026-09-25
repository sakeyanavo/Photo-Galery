import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, defer, map, throwError, timer } from 'rxjs';
import { Photo } from '../../shared/models/photo.model';

export interface PhotoApiConfig {
  readonly minDelayMs: number;
  readonly maxDelayMs: number;
  /** Probability (0–1) that a request fails; lets the error path be exercised on demand. */
  readonly failureRate: number;
}

export const PHOTO_API_CONFIG = new InjectionToken<PhotoApiConfig>('PHOTO_API_CONFIG', {
  providedIn: 'root',
  factory: () => ({ minDelayMs: 200, maxDelayMs: 300, failureRate: 0 }),
});

const PHOTO_WIDTH = 400;
const PHOTO_HEIGHT = 600;

/**
 * Simulates a remote photo API. There is no real backend, so each batch is generated
 * locally after a random network-like delay, mirroring what an HttpClient call would feel like.
 */
@Injectable({ providedIn: 'root' })
export class PhotoService {
  private readonly config = inject(PHOTO_API_CONFIG);

  loadBatch(count: number): Observable<Photo[]> {
    return defer(() => {
      if (!Number.isInteger(count) || count <= 0) {
        return throwError(() => new RangeError(`Batch size must be a positive integer, got ${count}`));
      }

      return timer(this.randomDelay()).pipe(
        map(() => {
          if (Math.random() < this.config.failureRate) {
            throw new Error('Photo API request failed');
          }
          return Array.from({ length: count }, () => this.createPhoto());
        }),
      );
    });
  }

  private randomDelay(): number {
    const { minDelayMs, maxDelayMs } = this.config;
    return minDelayMs + Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1));
  }

  private createPhoto(): Photo {
    const id = createId();
    return {
      id,
      // Seeding picsum with the id makes the url stable, so a favorite shows the same
      // image on the details page and after a refresh.
      url: `https://picsum.photos/seed/${id}/${PHOTO_WIDTH}/${PHOTO_HEIGHT}`,
      width: PHOTO_WIDTH,
      height: PHOTO_HEIGHT,
      alt: `Random photo ${id.slice(-6)}`,
    };
  }
}

let sequence = 0;

// Time + counter guarantees uniqueness within a session, and the random suffix makes
// collisions with ids persisted by earlier sessions practically impossible.
function createId(): string {
  sequence += 1;
  return `${Date.now().toString(36)}-${sequence.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

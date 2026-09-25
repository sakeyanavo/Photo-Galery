import { Injectable, computed, inject, signal } from '@angular/core';
import { Photo, isPhoto } from '../../shared/models/photo.model';
import { LocalStorageService } from '../storage/local-storage.service';

export const FAVORITES_STORAGE_KEY = 'photo-library.favorites';

/**
 * Single source of truth for favorites. Components read the signals and call the
 * mutation methods; persistence is an internal detail of the store.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly storage = inject(LocalStorageService);

  // A Map keeps `has()` and `get()` O(1) while preserving insertion order for display.
  private readonly items = signal<ReadonlyMap<string, Photo>>(this.restore());

  readonly favorites = computed(() => Array.from(this.items().values()));
  readonly count = computed(() => this.items().size);

  has(id: string): boolean {
    return this.items().has(id);
  }

  get(id: string): Photo | undefined {
    return this.items().get(id);
  }

  add(photo: Photo): boolean {
    if (this.has(photo.id)) {
      return false;
    }
    this.commit(next => next.set(photo.id, photo));
    return true;
  }

  remove(id: string): boolean {
    if (!this.has(id)) {
      return false;
    }
    this.commit(next => next.delete(id));
    return true;
  }

  private commit(mutate: (next: Map<string, Photo>) => void): void {
    const next = new Map(this.items());
    mutate(next);
    this.items.set(next);
    this.storage.set(FAVORITES_STORAGE_KEY, Array.from(next.values()));
  }

  private restore(): ReadonlyMap<string, Photo> {
    const stored = this.storage.get<unknown>(FAVORITES_STORAGE_KEY);
    const photos = Array.isArray(stored) ? stored.filter(isPhoto) : [];
    return new Map(photos.map(photo => [photo.id, photo]));
  }
}

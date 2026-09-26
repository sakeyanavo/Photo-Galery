import { Injectable, signal } from '@angular/core';
import { Photo } from '../../../shared/models/photo.model';

const STORAGE_KEY = 'favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly photos = signal<Photo[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'));

  isFavorite(id: string): boolean {
    return this.photos().some(photo => photo.id === id);
  }

  getById(id: string): Photo | undefined {
    return this.photos().find(photo => photo.id === id);
  }

  add(photo: Photo): void {
    if (!this.isFavorite(photo.id)) {
      this.save([...this.photos(), photo]);
    }
  }

  remove(id: string): void {
    this.save(this.photos().filter(photo => photo.id !== id));
  }

  private save(photos: Photo[]): void {
    this.photos.set(photos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  }
}

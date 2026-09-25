import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Thin JSON wrapper around `localStorage`. Every access is guarded because the storage
 * can be missing (server rendering), disabled (privacy settings) or full (quota), and
 * none of those should break the application.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly storage = this.resolveStorage();

  get<T>(key: string): T | null {
    try {
      const raw = this.storage?.getItem(key);
      return raw == null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  }

  set(key: string, value: unknown): void {
    try {
      this.storage?.setItem(key, JSON.stringify(value));
    } catch {
      // Persistence is best effort; the in-memory state stays correct.
    }
  }

  remove(key: string): void {
    try {
      this.storage?.removeItem(key);
    } catch {
      // Same reasoning as in set().
    }
  }

  private resolveStorage(): Storage | null {
    try {
      return inject(DOCUMENT).defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  }
}

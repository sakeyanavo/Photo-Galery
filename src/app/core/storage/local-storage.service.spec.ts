import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null for a missing key', () => {
    expect(service.get('missing')).toBeNull();
  });

  it('round-trips JSON-serializable values', () => {
    service.set('key', { a: 1, list: ['x'] });
    expect(service.get<{ a: number; list: string[] }>('key')).toEqual({ a: 1, list: ['x'] });
  });

  it('returns null instead of throwing for corrupt JSON', () => {
    localStorage.setItem('key', '{not json');
    expect(service.get('key')).toBeNull();
  });

  it('removes a key', () => {
    service.set('key', 1);
    service.remove('key');
    expect(localStorage.getItem('key')).toBeNull();
  });

  it('swallows storage write failures such as quota errors', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });
    expect(() => service.set('key', 'value')).not.toThrow();
  });
});

import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Photo } from '../../shared/models/photo.model';
import { PHOTO_API_CONFIG, PhotoApiConfig, PhotoService } from './photo.service';

describe('PhotoService', () => {
  const setup = (config: Partial<PhotoApiConfig> = {}) => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PHOTO_API_CONFIG,
          useValue: { minDelayMs: 200, maxDelayMs: 300, failureRate: 0, ...config } satisfies PhotoApiConfig,
        },
      ],
    });
    return TestBed.inject(PhotoService);
  };

  const collect = (service: PhotoService, count: number) => {
    const state: { result?: Photo[]; error?: unknown } = {};
    service.loadBatch(count).subscribe({
      next: photos => (state.result = photos),
      error: err => (state.error = err),
    });
    return state;
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('loads the requested number of photos', async () => {
    const state = collect(setup(), 12);
    await vi.advanceTimersByTimeAsync(300);

    expect(state.result).toHaveLength(12);
  });

  it('produces well-formed photos with an image url derived from the id', async () => {
    const state = collect(setup(), 1);
    await vi.advanceTimersByTimeAsync(300);

    const [photo] = state.result ?? [];
    expect(photo.id).toBeTruthy();
    expect(photo.url).toContain(photo.id);
    expect(photo.width).toBeGreaterThan(0);
    expect(photo.height).toBeGreaterThan(0);
    expect(photo.alt).toBeTruthy();
  });

  it('never repeats an id across batches', async () => {
    const service = setup();
    const batches = [collect(service, 50), collect(service, 50), collect(service, 50)];
    await vi.advanceTimersByTimeAsync(300);

    const ids = batches.flatMap(b => b.result ?? []).map(p => p.id);
    expect(ids).toHaveLength(150);
    expect(new Set(ids).size).toBe(150);
  });

  it('resolves asynchronously with a delay inside the configured range', async () => {
    const state = collect(setup(), 3);
    expect(state.result).toBeUndefined();

    await vi.advanceTimersByTimeAsync(199);
    expect(state.result).toBeUndefined();

    await vi.advanceTimersByTimeAsync(101);
    expect(state.result).toHaveLength(3);
  });

  it('does not start the delay until the observable is subscribed', async () => {
    const service = setup();
    const batch$ = service.loadBatch(2);
    await vi.advanceTimersByTimeAsync(1000);

    let result: Photo[] | undefined;
    batch$.subscribe(p => (result = p));
    expect(result).toBeUndefined();
    await vi.advanceTimersByTimeAsync(300);
    expect(result).toHaveLength(2);
  });

  it('errors for a non-positive batch size', async () => {
    const state = collect(setup(), 0);
    await vi.advanceTimersByTimeAsync(300);

    expect(state.error).toBeInstanceOf(RangeError);
    expect(state.result).toBeUndefined();
  });

  it('errors when the simulated API fails', async () => {
    const state = collect(setup({ failureRate: 1 }), 5);
    await vi.advanceTimersByTimeAsync(300);

    expect(state.error).toBeInstanceOf(Error);
    expect(state.result).toBeUndefined();
  });
});

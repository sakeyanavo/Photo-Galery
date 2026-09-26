import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InfiniteScrollDirective } from './infinite-scroll.directive';

@Component({
  imports: [InfiniteScrollDirective],
  template: `<div appInfiniteScroll (reached)="count = count + 1"></div>`,
})
class HostComponent {
  count = 0;
}

describe('InfiniteScrollDirective', () => {
  let callback: (entries: Partial<IntersectionObserverEntry>[]) => void;
  const observer = { observe: vi.fn(), disconnect: vi.fn() };

  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: typeof callback) {
          callback = cb;
        }
        observe = observer.observe;
        disconnect = observer.disconnect;
      },
    );
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('emits when the element intersects and disconnects on destroy', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    expect(observer.observe).toHaveBeenCalledWith(fixture.nativeElement.firstElementChild);

    callback([{ isIntersecting: false }]);
    expect(fixture.componentInstance.count).toBe(0);
    callback([{ isIntersecting: true }]);
    expect(fixture.componentInstance.count).toBe(1);

    fixture.destroy();
    expect(observer.disconnect).toHaveBeenCalled();
  });
});

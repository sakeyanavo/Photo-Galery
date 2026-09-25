import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InfiniteScrollDirective } from './infinite-scroll.directive';

class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root = null;
  readonly rootMargin: string;
  readonly scrollMargin = '0px';
  readonly thresholds: readonly number[] = [0];
  readonly observed: Element[] = [];
  disconnected = false;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.rootMargin = options?.rootMargin ?? '0px';
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(): void {}

  disconnect(): void {
    this.disconnected = true;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(isIntersecting: boolean): void {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this);
  }
}

@Component({
  imports: [InfiniteScrollDirective],
  template: `
    <div
      class="sentinel"
      appInfiniteScroll
      [infiniteScrollDisabled]="disabled()"
      [infiniteScrollRootMargin]="rootMargin()"
      (scrolledToEnd)="emissions = emissions + 1"></div>
  `,
})
class HostComponent {
  readonly disabled = signal(false);
  readonly rootMargin = signal('200px');
  emissions = 0;
}

describe('InfiniteScrollDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const latestObserver = () => MockIntersectionObserver.instances.at(-1);
  const activeObservers = () => MockIntersectionObserver.instances.filter(o => !o.disconnected);

  beforeEach(async () => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('observes the host element with the configured root margin', () => {
    const observer = latestObserver();
    const sentinel = fixture.nativeElement.querySelector('.sentinel');

    expect(observer?.observed).toEqual([sentinel]);
    expect(observer?.rootMargin).toBe('200px');
  });

  it('emits scrolledToEnd when the host becomes visible', () => {
    latestObserver()?.trigger(true);
    expect(host.emissions).toBe(1);
  });

  it('does not emit when the host is not intersecting', () => {
    latestObserver()?.trigger(false);
    expect(host.emissions).toBe(0);
  });

  it('stops observing while disabled and resumes with a fresh observer when re-enabled', async () => {
    host.disabled.set(true);
    await fixture.whenStable();
    expect(activeObservers()).toHaveLength(0);

    host.disabled.set(false);
    await fixture.whenStable();
    expect(activeObservers()).toHaveLength(1);

    latestObserver()?.trigger(true);
    expect(host.emissions).toBe(1);
  });

  it('recreates the observer when the root margin changes', async () => {
    host.rootMargin.set('50px');
    await fixture.whenStable();

    expect(activeObservers()).toHaveLength(1);
    expect(latestObserver()?.rootMargin).toBe('50px');
  });

  it('disconnects the observer when destroyed', () => {
    const observer = latestObserver();
    fixture.destroy();
    expect(observer?.disconnected).toBe(true);
  });

  it('degrades gracefully when IntersectionObserver is unavailable', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    MockIntersectionObserver.instances = [];

    const otherFixture = TestBed.createComponent(HostComponent);
    await otherFixture.whenStable();

    expect(MockIntersectionObserver.instances).toHaveLength(0);
    expect(otherFixture.componentInstance.emissions).toBe(0);
  });
});

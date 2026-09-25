import { DestroyRef, Directive, ElementRef, afterNextRender, effect, inject, input, output, signal } from '@angular/core';

/**
 * Emits `scrolledToEnd` whenever the host element scrolls into view (plus the root margin).
 * Place it on a sentinel element after a list to implement infinite scrolling; the
 * directive knows nothing about what is being loaded.
 */
@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective {
  /** Pause while the consumer is busy (e.g. a batch is loading) so no duplicate requests fire. */
  readonly disabled = input(false, { alias: 'infiniteScrollDisabled' });
  /** How far before the sentinel is visible the event should fire. */
  readonly rootMargin = input('200px', { alias: 'infiniteScrollRootMargin' });

  readonly scrolledToEnd = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly rendered = signal(false);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => this.rendered.set(true));

    // Re-creating the observer when it is re-enabled gives an immediate intersection
    // snapshot, so a sentinel that is still on screen after a batch loads fires again
    // without waiting for the user to scroll.
    effect(() => {
      const disabled = this.disabled();
      const rootMargin = this.rootMargin();
      if (this.rendered()) {
        this.disconnect();
        if (!disabled) {
          this.connect(rootMargin);
        }
      }
    });

    inject(DestroyRef).onDestroy(() => this.disconnect());
  }

  private connect(rootMargin: string): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    this.observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          this.scrolledToEnd.emit();
        }
      },
      { rootMargin },
    );
    this.observer.observe(this.host.nativeElement);
  }

  private disconnect(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}

import { DestroyRef, Directive, ElementRef, afterNextRender, inject, output } from '@angular/core';

/** Emits `reached` when the host element scrolls into view. Put it on an element after a list. */
@Directive({ selector: '[appInfiniteScroll]' })
export class InfiniteScrollDirective {
  readonly reached = output<void>();

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          this.reached.emit();
        }
      },
      { rootMargin: '200px' },
    );

    afterNextRender(() => observer.observe(element));
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}

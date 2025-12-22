import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appPortal]',
  standalone: true,
})
export class PortalDirective implements OnInit, OnDestroy {
  private hostEl: HTMLElement;
  private placeholder: Comment | null = null;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.hostEl = this.el.nativeElement;
  }

  ngOnInit(): void {
    try {
      // insert a placeholder where the element used to be so Angular's view remains consistent
      const parent = this.hostEl.parentNode;
      if (parent) {
        this.placeholder = this.renderer.createComment('portal-placeholder');
        this.renderer.insertBefore(parent, this.placeholder as any, this.hostEl);
      }
      // move element to document.body
      this.renderer.appendChild(document.body, this.hostEl);
    } catch (e) {
      // fail gracefully in tests or SSR
      console.warn('PortalDirective: failed to move element to body', e);
    }
  }

  ngOnDestroy(): void {
    try {
      // remove the moved element
      if (this.hostEl && this.hostEl.parentNode) {
        this.renderer.removeChild(this.hostEl.parentNode, this.hostEl);
      }
      // remove placeholder if present
      if (this.placeholder && this.placeholder.parentNode) {
        this.renderer.removeChild(this.placeholder.parentNode, this.placeholder);
      }
    } catch (e) {
      /* ignore */
    }
  }
}

import { Component, AfterViewInit, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Offcanvas from 'bootstrap/js/dist/offcanvas';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit, OnDestroy {
  links = [
    { label: 'Home', route: '/' },
    { label: 'About', route: '/about' },
    { label: 'Services', route: '/services' },
    { label: 'Products', route: '/products' },
    { label: 'Blog', route: '/blog' },
    { label: 'Careers', route: '/careers' },
    { label: 'Contact', route: '/contact' }
  ];

  offcanvasLinks = [...this.links];
  visibleCount = this.links.length;

  private _offcanvasInstance: Offcanvas | null = null;
  private resizeObserver: any;

  @ViewChild('centerNav', { read: ElementRef }) centerNav!: ElementRef<HTMLElement>;
  @ViewChild('moreBtn', { read: ElementRef }) moreBtn!: ElementRef<HTMLElement>;
  @ViewChild('measureContainer', { read: ElementRef }) measureContainer!: ElementRef<HTMLElement>;
  @ViewChildren('measureItem', { read: ElementRef }) measureItems!: QueryList<ElementRef<HTMLElement>>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // initial compute after view is rendered
    setTimeout(() => this.computeVisibleLinks(), 0);
    // recompute on resize
    this.resizeObserver = () => this.computeVisibleLinks();
    window.addEventListener('resize', this.resizeObserver);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeObserver);
  }

  private computeVisibleLinks() {
    const centerEl = this.centerNav?.nativeElement as HTMLElement | undefined;
    const measureEl = this.measureContainer?.nativeElement as HTMLElement | undefined;
    if (!centerEl || !measureEl) {
      this.visibleCount = this.links.length;
      this.cdr.detectChanges();
      return;
    }

    // available width for center nav (subtract some padding reserve)
    const available = centerEl.clientWidth - 40; // reserve for 'More' button etc

    let total = 0;
    let fitCount = 0;

    const items = this.measureItems?.toArray() ?? [];
    for (let i = 0; i < items.length; i++) {
      const w = (items[i].nativeElement as HTMLElement).offsetWidth;
      total += w;
      if (total <= available) {
        fitCount = i + 1;
      } else {
        break;
      }
    }

    // if all fit, show all and hide More; otherwise show fitCount and enable more
    this.visibleCount = fitCount >= 1 ? fitCount : 0;
    this.cdr.detectChanges();
  }

  toggleOffcanvas(event: Event, source: 'mobile' | 'more') {
    event.preventDefault();
    const el = document.getElementById('offcanvasMenu');
    if (!el) return;

    // decide which links to show
    if (source === 'mobile') {
      this.offcanvasLinks = [...this.links];
    } else if (source === 'more') {
      // overflow links
      this.offcanvasLinks = this.links.slice(this.visibleCount);
    }

    // ensure changes reflect before showing
    this.cdr.detectChanges();

    const existing = Offcanvas.getInstance(el) as Offcanvas | null;
    const inst = existing ?? new Offcanvas(el);
    inst.show();
    this._offcanvasInstance = inst;
  }

  closeOffcanvas() {
    this._offcanvasInstance?.hide();
  }
}

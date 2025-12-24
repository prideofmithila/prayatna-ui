import { Component, AfterViewInit, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Offcanvas from 'bootstrap/js/dist/offcanvas';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit, OnDestroy {
  links = [
    { label: 'Home', route: '/' },
    { label: 'Sessions', route: '/sessions' },
    { label: 'About', route: '/about' },
    { label: 'Services', route: '/services' },
    { label: 'Products', route: '/products' },
    { label: 'Blog', route: '/blog' },
    { label: 'Careers', route: '/careers' },
    { label: 'Contact', route: '/contact' }
  ];

  offcanvasLinks = [...this.links];
  visibleCount = this.links.length;

  // Auth state
  isLoggedIn = false;
  userName: string | null = null;
  userPicture: string | null = null;

  // Cache last access token so we don't repeatedly call userinfo
  private lastAccessToken: string | null = null;
  // Profile dropdown
  isProfileMenuOpen = false;

  private _offcanvasInstance: Offcanvas | null = null;
  private resizeObserver: any;

  @ViewChild('centerNav', { read: ElementRef }) centerNav!: ElementRef<HTMLElement>;
  @ViewChild('moreBtn', { read: ElementRef }) moreBtn!: ElementRef<HTMLElement>;
  @ViewChild('measureContainer', { read: ElementRef }) measureContainer!: ElementRef<HTMLElement>;
  @ViewChildren('measureItem', { read: ElementRef }) measureItems!: QueryList<ElementRef<HTMLElement>>;

  constructor(private cdr: ChangeDetectorRef, private oauthService: OAuthService, private router: Router) {
    // only fetch profile when a relevant auth event occurs (token received/refreshed)
    this.oauthService.events.pipe(
      filter((e: any) => e?.type === 'token_received' || e?.type === 'token_refreshed' || e?.type === 'session_terminated' || e?.type === 'logout' || e?.type === 'token_expires')
    ).subscribe(() => {
      this.updateUserFromToken();
    });
  }

  ngAfterViewInit(): void {
    // initial compute after view is rendered
    setTimeout(() => this.computeVisibleLinks(), 0);
    // recompute on resize
    this.resizeObserver = () => this.computeVisibleLinks();
    window.addEventListener('resize', this.resizeObserver);

    // set initial auth state (force true to load profile once on init)
    setTimeout(() => this.updateUserFromToken(true), 0);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeObserver);
  }

  private updateUserFromToken(force: boolean = false) {
    const access = this.oauthService.getAccessToken() || null;

    if (!access) {
      // not authenticated
      this.isLoggedIn = false;
      this.userName = null;
      this.userPicture = null;
      this.lastAccessToken = null;
      this.cdr.detectChanges();
      return;
    }

    // if token hasn't changed and not forced, skip profile fetch
    if (!force && this.lastAccessToken === access) {
      return;
    }

    this.lastAccessToken = access;

    // load user profile once per token change
    this.oauthService.loadUserProfile().then((profile: any) => {
      this.isLoggedIn = true;
      this.userName = profile?.name || profile?.preferred_username || profile?.given_name || null;
      this.userPicture = profile?.picture || null;
      this.cdr.detectChanges();
    }).catch(() => {
      // fallback to token claims
      const claims: any = this.oauthService.getIdentityClaims() || {};
      this.isLoggedIn = true;
      this.userName = claims.name || claims.email || null;
      this.userPicture = claims.picture || null;
      this.cdr.detectChanges();
    });
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

  // Auth helpers
  signIn() {
    try {
      const returnUrl = this.router.url || '/sessions';
      sessionStorage.setItem('returnUrl', returnUrl);
    } catch {}
    this.router.navigate(['/login']);
  }

  signOut() {
    // clear tokens and return to the same page
    const returnUrl = this.router.url || '/sessions';
    try {
      // attempt proper revocation first
      const fn: any = (this.oauthService as any).revokeTokenAndLogout;
      if (typeof fn === 'function') {
        fn.call(this.oauthService);
      } else {
        this.oauthService.logOut();
      }
    } catch {}

    // force UI to reflect signed-out state immediately
    this.isLoggedIn = false;
    this.userName = null;
    this.userPicture = null;
    this.lastAccessToken = null;
    this.isProfileMenuOpen = false;
    this.cdr.detectChanges();

    // navigate back to same page (now in signed-out state)
    this.router.navigateByUrl(returnUrl);
  }

  toggleProfileMenu(event: Event) {
    event.preventDefault();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
}

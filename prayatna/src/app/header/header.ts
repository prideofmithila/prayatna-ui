import { Component, AfterViewInit, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import Offcanvas from 'bootstrap/js/dist/offcanvas';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { SessionsService } from '../sessions/sessions.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit, OnDestroy {
  links = [
    { label: 'Home', route: '/' },
    { label: 'Practice Tool', route: null },
    { label: 'Daily Quiz', route: null },
    { label: 'About', route: '/about' }
  ];

  offcanvasLinks = [...this.links];
  visibleCount = this.links.length;

  // Auth state
  isLoggedIn = false;
  userName: string | null = null;
  userPicture: string | null = null;
  userEmail: string | null = null;
  mobileQuizOpen = false;
  mobilePracticeOpen = false;

  // Cache last access token so we don't repeatedly call userinfo
  private lastAccessToken: string | null = null;
  // Profile dropdown
  isProfileMenuOpen = false;
  showQuizDropdown = false;
  showPracticeDropdown = false;

  private _offcanvasInstance: Offcanvas | null = null;
  private resizeObserver: any;

  @ViewChild('centerNav', { read: ElementRef }) centerNav!: ElementRef<HTMLElement>;
  @ViewChild('moreBtn', { read: ElementRef }) moreBtn!: ElementRef<HTMLElement>;
  @ViewChild('measureContainer', { read: ElementRef }) measureContainer!: ElementRef<HTMLElement>;
  @ViewChildren('measureItem', { read: ElementRef }) measureItems!: QueryList<ElementRef<HTMLElement>>;

  constructor(private cdr: ChangeDetectorRef, private oauthService: OAuthService, private router: Router, private sessionsService: SessionsService) {
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

    // Prefer ID token claims; if not available (oidc disabled), decode tokens manually
    let claims: any = this.oauthService.getIdentityClaims() || {};
    if (!claims || Object.keys(claims).length === 0) {
      const idt = this.oauthService.getIdToken();
      if (idt) {
        claims = this.decodeJwt(idt) || {};
      }
      if ((!claims || Object.keys(claims).length === 0) && access) {
        claims = this.decodeJwt(access) || {};
      }
    }

    this.isLoggedIn = true;
    const name = this.firstClaim(claims, [
      'name',
      'preferred_username',
      'given_name',
      'email',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
    ]);
    const picture = this.firstClaim(claims, [
      'picture'
    ]);
    const email = this.firstClaim(claims, [
      'email',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
    ]);

    this.userName = this.toPascalCase(name as string) || 'User';
    this.userPicture = (picture as string) || null;
    this.userEmail = (email as string) || null;
    this.cdr.detectChanges();
  }

  @HostListener('document:click')
  onDocumentClick() {
    let dirty = false;
    if (this.showQuizDropdown) { this.showQuizDropdown = false; dirty = true; }
    if (this.showPracticeDropdown) { this.showPracticeDropdown = false; dirty = true; }
    if (this.isProfileMenuOpen) { this.isProfileMenuOpen = false; dirty = true; }
    if (dirty) this.cdr.detectChanges();
  }

  private decodeJwt(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const json = decodeURIComponent(atob(payload).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private firstClaim(obj: any, keys: string[]): string | undefined {
    for (const k of keys) {
      if (obj && typeof obj[k] === 'string' && obj[k]) return obj[k];
    }
    return undefined;
  }

  private toPascalCase(input?: string | null): string {
    if (!input) return '';
    return input
      .split(/\s+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
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
    this.mobileQuizOpen = false;
    this.mobilePracticeOpen = false;
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
    // Clear tokens locally without calling revoke endpoint (backend uses custom tokens)
    this.oauthService.logOut(true); // true = skip revoke endpoint call
    
    // Clear API sessions from local storage
    this.sessionsService.clearApiSessions();
    
    // force UI to reflect signed-out state immediately
    this.isLoggedIn = false;
    this.userName = null;
    this.userPicture = null;
    this.lastAccessToken = null;
    this.isProfileMenuOpen = false;
    this.cdr.detectChanges();
  }

  toggleProfileMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleQuizDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showQuizDropdown = !this.showQuizDropdown;
    if (this.showQuizDropdown) this.showPracticeDropdown = false;
    this.cdr.detectChanges();
  }

  togglePracticeDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showPracticeDropdown = !this.showPracticeDropdown;
    if (this.showPracticeDropdown) this.showQuizDropdown = false;
    this.cdr.detectChanges();
  }

  goToSessions() {
    this.isProfileMenuOpen = false;
    this.showPracticeDropdown = false;
    this.showQuizDropdown = false;
    this.mobilePracticeOpen = false;
    this.mobileQuizOpen = false;
    this.router.navigate(['/sessions']);
    this.cdr.detectChanges();
  }

  toggleMobileQuiz(event: Event) {
    event.preventDefault();
    this.mobileQuizOpen = !this.mobileQuizOpen;
  }

  toggleMobilePractice(event: Event) {
    event.preventDefault();
    this.mobilePracticeOpen = !this.mobilePracticeOpen;
  }
}

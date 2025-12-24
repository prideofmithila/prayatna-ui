import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authProviders = [
    { key: 'google', label: 'Continue with Google', class: 'google-btn' }
    // Add more providers here later, e.g. { key: 'facebook', label: 'Continue with Facebook', class: 'facebook-btn' }
  ];

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {}

  loginWithGoogle() {
    this.oauthService.initCodeFlow();
  }

  loginWithProvider(key: string) {
    if (key === 'google') {
      this.loginWithGoogle();
      return;
    }
    // For non-OIDC providers in future, initiate via backend route
    // example: window.location.href = `/api/auth/${key}/start`;
  }


  navigateToSessions() {
    try {
      const returnUrl = sessionStorage.getItem('returnUrl');
      if (returnUrl) {
        sessionStorage.removeItem('returnUrl');
        this.router.navigateByUrl(returnUrl);
        return;
      }
    } catch {}
    this.router.navigate(['/sessions']);
  }
}

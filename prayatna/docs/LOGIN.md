# Login & Authentication

## Features

The login page provides multiple authentication options:

### Authentication Methods
1. **Google Sign-In** (Fully implemented)
   - OAuth 2.0 integration with Google
   - Automatic token refresh
   - User profile retrieval

2. **Facebook Login** (Coming soon)
   - Placeholder button ready for integration

3. **GitHub Login** (Coming soon)
   - Placeholder button ready for integration

4. **Microsoft Login** (Coming soon)
   - Placeholder button ready for integration

5. **Guest Mode**
   - Access the app without authentication
   - Limited functionality

### Sign Up / Sign In Toggle
- Users can easily switch between sign-up and sign-in modes
- The interface updates dynamically based on the selected mode

### Implementation Details

**Routes:**
- `/login` - Login page (default route)
- All other routes require navigation from login or guest mode

**Components:**
- `LoginComponent` - Main authentication screen
- Location: `src/app/auth/login.component.ts`

**Styling:**
- Modern gradient background
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Brand colors matching the app theme

**Integration:**
- Header is hidden on the login page
- OAuth service integration for Google authentication
- Session management with automatic token refresh

### To Add New OAuth Providers

To implement Facebook, GitHub, or Microsoft login:

1. Update `environment.ts` with provider configuration
2. Implement the login method in `LoginComponent`
3. Configure OAuth redirect URIs in provider console
4. Update backend to handle new provider tokens

### Guest Mode

Users can access the app without authentication by clicking "Continue as Guest". This provides:
- Access to core session tracking features
- Local storage for session data
- No cloud sync or cross-device access

# Backend Implementation Prompt for Google OAuth Authentication

## Context
I have a Prayatna session tracking app with an Angular frontend that uses `angular-oauth2-oidc` for Google sign-in. The frontend is configured with Google OAuth 2.0 code flow + PKCE and redirects to `https://localhost:4200/sessions` after authentication.

## Current State
- Backend: .NET with Swagger at `https://localhost:7147/swagger/index.html`
- Token endpoint already implemented
- Frontend sends Google ID token after OAuth flow completes

## Requirements

### 1. Google OAuth Token Verification & User Authentication
**Endpoint:** `POST /api/auth/google`

**Request Body:**
```json
{
  "idToken": "string"
}
```

**Implementation:**
- Verify Google ID token using Google's public JWKS (JSON Web Key Set)
- Validate token claims:
  - `aud` (audience) must match your Google Client ID
  - `iss` must be `https://accounts.google.com` or `accounts.google.com`
  - `exp` (expiration) must be valid
  - `email_verified` must be `true`
- Extract user claims: `sub` (Google user ID), `email`, `name`, `picture` (avatar URL)

**Response:**
```json
{
  "user": {
    "id": "guid",
    "email": "string",
    "name": "string",
    "avatarUrl": "string",
    "provider": "google",
    "roles": ["user"]
  },
  "accessToken": "string (JWT)",
  "refreshToken": "string",
  "expiresIn": 900
}
```

**Set httpOnly cookie:**
- `refresh_token` with `Secure`, `HttpOnly`, `SameSite=Strict` flags

### 2. User Model & Database
**User Entity:**
```csharp
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }  // Unique index
    public string Name { get; set; }
    public string? AvatarUrl { get; set; }
    public string Provider { get; set; }  // "google" or "guest"
    public string? ProviderId { get; set; }  // Google 'sub' claim
    public List<string> Roles { get; set; } = new() { "user" };
    public DateTime CreatedAt { get; set; }
    public DateTime LastLoginAt { get; set; }
}
```

**Business Logic:**
- On `POST /api/auth/google`: Upsert user by `Provider='google'` AND `ProviderId=sub`
  - If user exists: Update `Name`, `AvatarUrl`, `LastLoginAt`
  - If new user: Create with all fields, set `CreatedAt` and `LastLoginAt`
- Return user profile and issue app JWT

### 3. JWT & Refresh Token Management
**Access Token (JWT):**
- Issuer: your app domain (e.g., `https://localhost:7147`)
- Audience: your app
- Subject: `User.Id`
- Claims: `email`, `name`, `roles`, `provider`
- Expiration: 15 minutes
- Signing: Use HS256 or RS256 with secret key from appsettings

**Refresh Token:**
- Store in database table: `RefreshTokens` (Id, UserId, Token, ExpiresAt, IsRevoked)
- Expiration: 30 days
- Generate cryptographically secure random string (64 bytes, Base64)
- One-time use: revoke after consumption

### 4. Token Refresh Endpoint
**Endpoint:** `POST /api/auth/refresh`

**Request:**
- Read `refresh_token` from httpOnly cookie

**Implementation:**
- Validate refresh token exists in database and not expired/revoked
- Get associated user
- Revoke old refresh token (set `IsRevoked=true`)
- Issue new access token (JWT)
- Issue new refresh token and update database
- Set new httpOnly cookie

**Response:**
```json
{
  "accessToken": "string",
  "expiresIn": 900
}
```

### 5. Current User Endpoint
**Endpoint:** `GET /api/auth/me`

**Authorization:** Requires valid JWT in `Authorization: Bearer <token>` header

**Implementation:**
- Extract `User.Id` from JWT claims
- Query user from database
- Return user profile

**Response:**
```json
{
  "id": "guid",
  "email": "string",
  "name": "string",
  "avatarUrl": "string",
  "provider": "google",
  "roles": ["user"]
}
```

### 6. Logout Endpoint
**Endpoint:** `POST /api/auth/logout`

**Authorization:** Requires valid JWT

**Implementation:**
- Read `refresh_token` from httpOnly cookie
- Revoke refresh token in database
- Clear httpOnly cookie (set max-age=0)

**Response:**
```json
{
  "success": true
}
```

### 7. Guest User Support
**Endpoint:** `POST /api/auth/guest`

**Implementation:**
- Create temporary user with `Provider='guest'`, `ProviderId=null`
- Generate unique guest name: `Guest_<random>` or `Guest User`
- Set email as `guest_<guid>@prayatna.local` (not real email)
- Issue JWT with 24-hour expiration (longer than authenticated users)
- No refresh token for guests

**Response:**
```json
{
  "user": {
    "id": "guid",
    "name": "Guest User",
    "provider": "guest",
    "roles": ["guest"]
  },
  "accessToken": "string",
  "expiresIn": 86400
}
```

### 8. Security Checklist
- [ ] Rate limiting on all auth endpoints (10 requests per minute per IP)
- [ ] Google token verification uses cached JWKS (cache for 24 hours)
- [ ] JWT signing key stored in environment variables/secret manager
- [ ] HTTPS enforced in production
- [ ] CORS configured to allow `https://localhost:4200` (dev) and production domain
- [ ] httpOnly cookies with Secure and SameSite flags
- [ ] Refresh tokens stored with hash (SHA256) in database
- [ ] Failed login attempts logged for audit
- [ ] Token expiration times configurable via appsettings
- [ ] User sessions table to track active devices (optional)

### 9. Configuration (appsettings.json)
```json
{
  "Authentication": {
    "Google": {
      "ClientId": "YOUR_GOOGLE_CLIENT_ID"
    },
    "Jwt": {
      "SecretKey": "YOUR_SECRET_KEY_MIN_32_CHARS",
      "Issuer": "https://localhost:7147",
      "Audience": "https://localhost:7147",
      "AccessTokenExpirationMinutes": 15,
      "RefreshTokenExpirationDays": 30
    }
  },
  "Cors": {
    "AllowedOrigins": ["https://localhost:4200"]
  }
}
```

## Expected Deliverables
1. **Controllers:** `AuthController` with all endpoints listed above
2. **Services:** 
   - `GoogleAuthService` for token verification
   - `TokenService` for JWT generation and refresh token management
   - `UserService` for user CRUD operations
3. **Models/DTOs:** Request/response models for all endpoints
4. **Database migrations:** User and RefreshToken tables
5. **Middleware:** JWT authentication middleware
6. **Error handling:** Return appropriate HTTP status codes:
   - 401 for invalid/expired tokens
   - 403 for insufficient permissions
   - 400 for validation errors
   - 500 for server errors

## Testing Notes
- Frontend Angular app runs at `https://localhost:4200`
- After Google OAuth completes, frontend receives ID token
- Frontend will call `POST /api/auth/google` with the ID token
- On success, store JWT in memory and refresh token as httpOnly cookie
- Frontend includes JWT in `Authorization: Bearer <token>` for protected API calls
- When JWT expires (15min), frontend calls `POST /api/auth/refresh` automatically

## Additional Context
- Sessions data will be stored per user (User.Id foreign key)
- Guest users should have read-only or limited capabilities (enforce in API via roles)
- Consider adding `EmailVerified` field to User model for future email/password support
- Implement soft delete for users (IsDeleted flag) instead of hard delete

---

**Priority Implementation Order:**
1. User entity and database setup
2. Google token verification service
3. `POST /api/auth/google` with user upsert
4. JWT generation and validation middleware
5. `GET /api/auth/me`
6. Refresh token table and `POST /api/auth/refresh`
7. `POST /api/auth/logout`
8. `POST /api/auth/guest`
9. Rate limiting and security hardening

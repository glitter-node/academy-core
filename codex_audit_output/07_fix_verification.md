# Fix Verification

## Modified Files

- `resources/js/core/routing/Router.ts`
- `resources/js/core/auth/AuthManager.ts`
- `resources/js/core/template-engine/ActionDispatcher.ts`
- `templates/academy-core/template.json`
- `templates/academy-core/layouts/partials/common/_site_header.json`
- `templates/academy-core/dist/js/components.iife.js`
- `public/build/core/template-engine.min.js`
- `public/build/manifest.json`
- `public/build/assets/app-Bj43h_rG.js`
- `public/build/assets/app-BDx1VkfM.css`

Note: `resources/js/core/**` and `public/**` are ignored by the current Git configuration, but they were edited/built in the working tree because the runtime loads the built core engine from `public/build/core/template-engine.min.js`.

## Issue 1: `guest_only` Not Enforced

Status: Resolved

Before:

- `templates/academy-core/routes.json` declared `guest_only: true` on guest-only pages.
- `resources/js/core/routing/Router.ts` only enforced `auth_required`.
- Authenticated users could structurally reach `/login`, `/register`, `/forgot-password`, or `/reset-password` unless page-level logic handled it.

After:

- `Route` now includes `guest_only?: boolean`.
- The router evaluates `guest_only` in the same auth decision block as `auth_required`.
- When a matched route has `guest_only` and the user is authenticated, the router redirects to `/`.
- No template route metadata was changed.
- No auth logic was duplicated in page layouts or `AuthManager`.

Implementation evidence:

- `resources/js/core/routing/Router.ts`
  - Adds `guest_only?: boolean` to the route type.
  - Reuses `AuthManager.getInstance()`, `isAuthenticated()`, `getAuthType()`, and `checkAuth(authType)`.
  - Redirects authenticated users from `guest_only` routes with `window.location.href = '/'`.

## Issue 2: Consultation Dependency Missing

Status: Resolved

Before:

- Consultation layouts call reservation module endpoints.
- The template metadata declared `sirsoft-board` and `sirsoft-page`, but not `glitter-reservation`.
- The dependency was real but not machine-readable from `template.json`.

After:

- `templates/academy-core/template.json` declares `glitter-reservation` under `dependencies.modules`.
- No runtime checks were added.
- No consultation layout was changed.
- The dependency is now discoverable by tooling and documentation.

Implementation evidence:

```json
"dependencies": {
  "modules": {
    "sirsoft-board": ">=0.1.1",
    "sirsoft-page": ">=0.1.1",
    "glitter-reservation": ">=0.1.0"
  },
  "plugins": {}
}
```

## Issue 3: Logout Redirect Conflict

Status: Resolved

Before:

- `AuthManager.logout()` forced a redirect after logout.
- `_site_header.json` logout actions also attempted `setState`, `toast`, and `navigate("/")` through `onSuccess`.
- The generic `ActionDispatcher` success chain could execute UI-layer post-logout navigation after the central logout redirect began.

After:

- `AuthManager.logout()` remains the single redirect owner.
- Logout redirects to `config?.loginPath ?? '/login'`.
- `ActionDispatcher` skips `onSuccess` execution for `handler: 'logout'`.
- Header logout buttons now keep only the logout trigger after local menu-closing state updates.
- No new config layer, race handling, or redirect abstraction was introduced.

Implementation evidence:

- `resources/js/core/auth/AuthManager.ts`
  - Clears token and auth state.
  - Emits logout/auth state events.
  - Redirects once to the configured login path or `/login`.

- `resources/js/core/template-engine/ActionDispatcher.ts`
  - Generic `onSuccess` execution is gated with `action.handler !== 'logout'`.

- `templates/academy-core/layouts/partials/common/_site_header.json`
  - Desktop logout action now uses `{"handler": "logout"}` only.
  - Mobile logout action now uses `{"handler": "logout"}` only.

## Commands Run

```bash
npm run build
```

Result: Success from repository root. Vite built `public/build/manifest.json`, `public/build/assets/app-Bj43h_rG.js`, and `public/build/assets/app-BDx1VkfM.css`.

```bash
cd /volume1/glitterbz/AcademyCore/templates/academy-core
npm run build
```

Result: Success. Vite built `dist/css/components.css` and `dist/js/components.iife.js`.

```bash
npm run build:core
```

Result: Success. Vite built `public/build/core/template-engine.min.js` and copied core language files.

```bash
/usr/local/bin/php83 -r 'foreach (["templates/academy-core/template.json", "templates/academy-core/layouts/partials/common/_site_header.json"] as $file) { json_decode(file_get_contents($file)); if (json_last_error() !== JSON_ERROR_NONE) { fwrite(STDERR, $file . ": " . json_last_error_msg() . PHP_EOL); exit(1); } echo $file . ": OK" . PHP_EOL; }'
```

Result:

```text
templates/academy-core/template.json: OK
templates/academy-core/layouts/partials/common/_site_header.json: OK
```

Required command:

```bash
/usr/local/bin/php83 artisan route:list --path=api/auth
```

Result: Success. Laravel listed 8 matching routes:

```text
POST       api/auth/admin/login
POST       api/auth/forgot-password
POST       api/auth/login
POST       api/auth/logout
POST       api/auth/register
POST       api/auth/reset-password
GET|HEAD   api/auth/user
POST       api/auth/validate-reset-token
```

## Manual Verification Status

The requested browser-state checks require an authenticated browser session and were not executed from this CLI-only environment.

Static and build-level verification confirms:

- `/login` and `/register` are now guarded by router-level `guest_only` handling when the router sees an authenticated user.
- Logout now has one redirect owner: `AuthManager.logout()`.
- Header logout actions no longer attempt UI-layer navigation after logout.
- `consultation` dependency metadata is declared without changing runtime behavior.
- The consultation page layout was not modified, so this fix should not introduce a consultation rendering regression.

## Remaining Ambiguity

- Browser confirmation for authenticated `/login` and `/register` redirects still requires a live session.
- Browser confirmation for logout flicker/double navigation still requires a live session.
- The reservation module dependency is now declared, but no runtime module availability check was intentionally added by this fix.

## Final Stabilization Patch

Modified files:

- `resources/js/core/routing/Router.ts`
- `resources/js/core/auth/AuthManager.ts`
- `public/build/core/template-engine.min.js`
- `public/build/manifest.json`
- `public/build/assets/app-Bj43h_rG.js`
- `public/build/assets/app-BDx1VkfM.css`

Exact lines changed:

- `resources/js/core/routing/Router.ts:276-279`
  - Replaced the guest-only hard redirect with the existing router navigation mechanism:

```ts
if (matchResult.route.guest_only && isAuthenticated) {
  logger.log(`Guest-only route requested while authenticated, redirecting to: /`);
  this.navigate('/');
  return;
}
```

- `resources/js/core/auth/AuthManager.ts:370-374`
  - Replaced immediate `window.location.href` assignment with a microtask-deferred `window.location.replace()`:

```ts
if (previousState.type) {
  const loginPath = config?.loginPath ?? '/login';
  Promise.resolve().then(() => {
    window.location.replace(loginPath);
  });
}
```

Reason for change:

- `guest_only` now uses the router's existing SPA navigation path, avoiding a hard reload and reducing double-navigation risk.
- Logout now lets auth state clearing and emitted auth events settle in the current task before performing the single hard redirect.
- `window.location.replace()` avoids adding an extra history entry for the logout destination.
- No timeout, new async chain, new config layer, or new routing abstraction was introduced.

Validation commands:

```bash
npm run build:core
```

Result: Success. Rebuilt `public/build/core/template-engine.min.js`.

```bash
npm run build
```

Result: Success. Rebuilt root Vite assets.

```bash
/usr/local/bin/php83 artisan route:list --path=api/auth
```

Result: Success. The auth route list still includes login, logout, register, forgot-password, reset-password, user, admin login, and validate-reset-token routes.

Structural impact confirmation:

- No route metadata was changed.
- No backend API was changed.
- No template layout was changed in this stabilization step.
- No new abstraction or architecture layer was introduced.
- Redirect ownership remains centralized: guest-only route redirection is owned by the router, and logout destination redirection is owned by `AuthManager`.

Remaining manual verification:

- Browser verification is still required to observe that logout redirects once without flicker.
- Browser verification is still required to observe that authenticated access to `/login` redirects immediately without visible flicker.

# Academy Core Template

Academy Core is a bundled template for the GnuBoard7 CMS.

---

## Requirements

- GnuBoard7 core CMS
- PHP 8.3+ (available in PATH)
- Node.js and npm

---

## Directory Overview

templates/academy-core/
- dist/
- lang/
- layouts/
- preview/
- src/
- __tests__/

---

## Installation

### 1. Place template

<project-root>/templates/academy-core

### 2. Build

cd <project-root>/templates/academy-core  
npm install  
npm run build  

### 3. Apply template

cd <project-root>  
php artisan template:update academy-core --force  

### 4. Clear cache (optional)

php artisan template:cache-clear  

### 5. Verify

php artisan template:list  

---

## Development Rules

- Use PHP CLI (PHP 8.3+ recommended)
- Do not use Vite dev server
- Validate using build output
- Only modify templates/academy-core/**

---

## Build

cd <project-root>/templates/academy-core  
npm run build  

---

## Usage

Typical routes:

- /
- /about
- /programs
- /instructors
- /timetable
- /notices
- /faq
- /contact
- /consultation
- /login
- /register
- /forgot-password
- /reset-password
- /mypage/profile
- /mypage/change-password

---

## Auth Flow

- Login
- Register
- Forgot password
- Reset password

Expected API endpoints:

- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

---

## Localization

- Template UI is English-first
- Template fallback locale is en
- Core locale behavior is not modified

---

## Open Beta Status

Status: Open Beta Ready

Verified:

- Registration flow
- Login flow
- Password reset flow
- Logout UX
- Template build and activation

---

## What Is Not Included

- GnuBoard7 core internals
- Backend auth implementation
- Mail server
- Standalone CMS installer

---

## Release

cd <project-root>  
git add -A  
git commit -m "release: academy-core open beta"  
git push  

---

## Maintenance

- Keep UI text in English
- Do not mix template and core changes
- Rebuild after source changes
- Run template:update after build

---

## Verification & Reproducibility

This project is not just a template, but a reproducible project baseline.

The following verification criteria are provided:

### 1. Installation Reproducibility
- Same result guaranteed with identical steps
- No manual hidden configuration required
- Environment dependencies clearly defined

### 2. Runtime Validation
- Auth flow fully tested in browser
- Page rendering verified after template activation
- API contract integration confirmed

### 3. Structural Integrity
- No core modification required
- Extension points used for all custom logic
- Module / Template separation maintained

### 4. Operational Boundary Definition
- Scope of responsibility clearly defined
- External dependencies explicitly separated
- Non-included components documented

---

## Verification Procedure

To validate this project as a reproducible baseline, follow the steps below:

### 1. Clean Environment Setup

- Prepare a fresh GnuBoard7 installation
- Ensure no existing templates are active

### 2. Install Template

- Place academy-core under templates/
- Run build process
- Apply template using artisan command

### 3. Functional Verification

Verify the following flows in browser:

- Register → Login → Logout
- Forgot Password → Email → Reset → Login
- Navigate all public pages
- Access mypage routes

### 4. API Contract Check

Confirm backend responds correctly:

- POST /api/auth/login → 200 / 422
- POST /api/auth/register → 200 / 422
- POST /api/auth/forgot-password → 200
- POST /api/auth/reset-password → 200

### 5. Rebuild Consistency Check

- Delete dist/
- Run npm run build again
- Re-apply template
- Confirm identical behavior

### 6. Failure Boundary Check

Confirm the following are NOT handled by this template:

- Backend auth failure
- Mail delivery issues
- Core CMS errors

---

## License

Follow the license and distribution policy of the parent GnuBoard7 project.

Add a separate template license if needed.

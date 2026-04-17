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

## License

Follow the license and distribution policy of the parent GnuBoard7 project.

Add a separate template license if needed.

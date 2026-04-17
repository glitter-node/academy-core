import { describe, expect, it } from 'vitest';

import authBase from '../../../../../../templates/academy-core/layouts/auth/_auth_base.json';
import forgotPasswordLayout from '../../../../../../templates/academy-core/layouts/auth/forgot-password.json';
import loginLayout from '../../../../../../templates/academy-core/layouts/auth/login.json';
import registerLayout from '../../../../../../templates/academy-core/layouts/auth/register.json';
import resetPasswordLayout from '../../../../../../templates/academy-core/layouts/auth/reset-password.json';

describe('academy-core auth 공통 shell 구조', () => {
    it('academy-core auth 화면은 공통 auth base를 상속해야 한다', () => {
        expect((loginLayout as any).extends).toBe('auth/_auth_base');
        expect((forgotPasswordLayout as any).extends).toBe('auth/_auth_base');
        expect((resetPasswordLayout as any).extends).toBe('auth/_auth_base');
        expect((registerLayout as any).extends).toBe('auth/_auth_base');
    });

    it('auth base는 _user_base를 상속하고 공통 auth shell을 가져야 한다', () => {
        const authBaseStr = JSON.stringify(authBase);

        expect((authBase as any).extends).toBe('_user_base');
        expect(authBaseStr).toContain('ac_auth_page');
        expect(authBaseStr).toContain('ac_auth_card');
        expect(authBaseStr).toContain('ac_auth_body');
        expect(authBaseStr).toContain('ac_auth_footer_links');
        expect(authBaseStr).toContain('auth_body');
        expect(authBaseStr).toContain('/forgot-password');
        expect(authBaseStr).toContain('/reset-password');
    });

    it('login은 기존 redirect 흐름을 유지하면서 forgot password recovery 링크를 제공해야 한다', () => {
        const loginStr = JSON.stringify(loginLayout);

        expect(loginStr).toContain("query.redirect ?? '/mypage/profile'");
        expect(loginStr).toContain('"dataKey":"form"');
        expect(loginStr).toContain('query.registered');
        expect(loginStr).toContain('Your account has been created successfully.');
        expect(loginStr).toContain('You can now log in with your email and password.');
        expect(loginStr).toContain('/forgot-password');
        expect(loginStr).toContain('Forgot password?');
        expect(loginStr).toContain('ac_form_stack_login');
        expect(loginStr).toContain('ac_submit_button');
        expect(loginStr).toContain('is_loading');
        expect(loginStr).toContain('Logging in...');
        expect(loginStr).toContain('"disabled":"{{_local.isLoggingIn}}"');
        expect(loginStr).toContain('"name":"email"');
        expect(loginStr).toContain('"name":"password"');
        expect(loginStr).toContain('Use the email address linked to your academy account.');
    });

    it('forgot/reset password는 기존 auth API를 academy-core auth card 흐름으로 연결해야 한다', () => {
        const forgotStr = JSON.stringify(forgotPasswordLayout);
        const resetStr = JSON.stringify(resetPasswordLayout);

        expect(forgotStr).toContain('/api/auth/forgot-password');
        expect(forgotStr).toContain('"dataKey":"form"');
        expect(forgotStr).toContain('"body":"{{form}}"');
        expect(forgotStr).toContain('"name":"email"');
        expect(forgotStr).toContain('Send reset link');
        expect(resetStr).toContain('/api/auth/validate-reset-token');
        expect(resetStr).toContain('/api/auth/reset-password');
        expect(resetStr).toContain("query.token ?? ''");
        expect(resetStr).toContain("query.email ?? ''");
        expect(resetStr).toContain('Request a new reset link');
        expect(resetStr).toContain('Reset password');
    });

    it('register는 기존 회원가입 API와 언어/약관 필드를 유지해야 한다', () => {
        const registerStr = JSON.stringify(registerLayout);

        expect(registerStr).toContain('/api/auth/register');
        expect(registerStr).toContain('"dataKey":"form"');
        expect(registerStr).toContain('"agree_terms":"{{form.agree_terms ? 1 : 0}}"');
        expect(registerStr).toContain('"agree_privacy":"{{form.agree_privacy ? 1 : 0}}"');
        expect(registerStr).toContain('form.language');
        expect(registerStr).toContain('form.agree_terms');
        expect(registerStr).toContain('form.agree_privacy');
        expect(registerStr).toContain('agree_terms');
        expect(registerStr).toContain('agree_privacy');
        expect(registerStr).toContain('is_loading');
        expect(registerStr).toContain('Creating account...');
        expect(registerStr).toContain('Account created successfully.');
        expect(registerStr).toContain('"path":"/login"');
        expect(registerStr).toContain('"registered":"1"');
        expect(registerStr).toContain('"disabled":"{{_local.isRegistering}}"');
    });

    it('각 auth 화면은 핵심 필드를 유지해야 한다', () => {
        const registerStr = JSON.stringify(registerLayout);

        expect(registerStr).toContain('"name":"name"');
        expect(registerStr).toContain('"name":"nickname"');
        expect(registerStr).toContain('"name":"password_confirmation"');
    });
});

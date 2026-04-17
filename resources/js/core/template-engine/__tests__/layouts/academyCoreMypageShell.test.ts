import { describe, expect, it } from 'vitest';

import mypageBase from '../../../../../../templates/academy-core/layouts/mypage/_mypage_base.json';
import profileLayout from '../../../../../../templates/academy-core/layouts/mypage/profile.json';
import changePasswordLayout from '../../../../../../templates/academy-core/layouts/mypage/change-password.json';
import accountNav from '../../../../../../templates/academy-core/layouts/partials/mypage/_account_nav.json';

describe('academy-core mypage 공통 shell 구조', () => {
    it('profile/change-password는 공통 mypage base를 상속해야 한다', () => {
        expect((profileLayout as any).extends).toBe('mypage/_mypage_base');
        expect((changePasswordLayout as any).extends).toBe('mypage/_mypage_base');
    });

    it('mypage base는 _user_base를 상속하고 공통 shell과 account nav를 포함해야 한다', () => {
        const baseStr = JSON.stringify(mypageBase);

        expect((mypageBase as any).extends).toBe('_user_base');
        expect(baseStr).toContain('ac_account_page');
        expect(baseStr).toContain('ac_account_shell');
        expect(baseStr).toContain('ac_account_header');
        expect(baseStr).toContain('partials/mypage/_account_nav.json');
        expect(baseStr).toContain('mypage_body');
    });

    it('profile은 기존 /api/me 로딩과 저장, currentUser 재동기화를 유지해야 한다', () => {
        const profileStr = JSON.stringify(profileLayout);

        expect(profileStr).toContain('/api/me');
        expect(profileStr).toContain('profileForm');
        expect(profileStr).toContain('saveSuccess');
        expect(profileStr).toContain('currentUser');
        expect(profileStr).toContain('response.data ?? response.user ?? _global.currentUser');
    });

    it('change-password는 기존 /api/me/password 저장 흐름과 성공 후 Account 링크를 유지해야 한다', () => {
        const changePasswordStr = JSON.stringify(changePasswordLayout);

        expect(changePasswordStr).toContain('/api/me/password');
        expect(changePasswordStr).toContain('submitError');
        expect(changePasswordStr).toContain('submitErrors');
        expect(changePasswordStr).toContain('success');
        expect(changePasswordStr).toContain('/mypage/profile');
    });

    it('account nav는 기존 active 판별과 mypage 라우트를 유지해야 한다', () => {
        const navStr = JSON.stringify(accountNav);

        expect(navStr).toContain("route.path === '/mypage/profile'");
        expect(navStr).toContain("route.path === '/mypage/change-password'");
        expect(navStr).toContain('/mypage/profile');
        expect(navStr).toContain('/mypage/change-password');
    });
});

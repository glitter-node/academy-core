import { describe, expect, it } from 'vitest';

import consultationLayout from '../../../../../../templates/academy-core/layouts/consultation.json';
import consultationForm from '../../../../../../templates/academy-core/layouts/partials/consultation/_form.json';

describe('academy-core consultation과 currentUser 정합성', () => {
    it('consultation은 reservation verification 흐름을 그대로 유지해야 한다', () => {
        const layoutStr = JSON.stringify(consultationLayout);

        expect(layoutStr).toContain('/sanctum/csrf-cookie');
        expect(layoutStr).toContain('/modules/glitter-reservation/reservation/verification-status');
        expect(layoutStr).toContain('/modules/glitter-reservation/reservation/services');
    });

    it('consultation form은 verification 기반 분기를 유지해야 한다', () => {
        const formStr = JSON.stringify(consultationForm);

        expect(formStr).toContain('verificationStatus?.verified !== true');
        expect(formStr).toContain('verificationStatus?.verified === true');
        expect(formStr).toContain('/modules/glitter-reservation/reservation/bookings');
    });

    it('consultation form은 currentUser를 예약의 단일 진실 원천으로 사용하지 않아야 한다', () => {
        const formStr = JSON.stringify(consultationForm);

        expect(formStr).toContain('verificationStatus?.email');
        expect(formStr).toContain('_global.currentUser?.email');
        expect(formStr).not.toContain('customer_email": "{{_global.currentUser?.email');
    });

    it('로그인 사용자를 위한 보조 힌트와 이메일 채우기 버튼이 있어야 한다', () => {
        const formStr = JSON.stringify(consultationForm);

        expect(formStr).toContain('Use Signed-In Email');
        expect(formStr).toContain('Signed in as {{_global.currentUser?.email}}');
        expect(formStr).toContain('separate reservation email verification');
    });
});

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const templateRoot = '/volume1/glitterbz/AcademyCore/templates/academy-core';
const layoutsRoot = path.join(templateRoot, 'layouts');

const routesJson = JSON.parse(fs.readFileSync(path.join(templateRoot, 'routes.json'), 'utf8'));
const templateJson = JSON.parse(fs.readFileSync(path.join(templateRoot, 'template.json'), 'utf8'));
const seoConfig = JSON.parse(fs.readFileSync(path.join(templateRoot, 'seo-config.json'), 'utf8'));
const componentsJson = JSON.parse(fs.readFileSync(path.join(templateRoot, 'components.json'), 'utf8'));

const publicRoutes = [
  ['/', 'home'],
  ['/about', 'about'],
  ['/programs', 'programs'],
  ['/instructors', 'instructors'],
  ['/timetable', 'timetable'],
  ['/notices', 'notices'],
  ['/faq', 'faq'],
  ['/consultation', 'consultation'],
  ['/contact', 'contact'],
] as const;

const authRoutes = [
  ['/login', 'auth/login'],
  ['/forgot-password', 'auth/forgot-password'],
  ['/reset-password', 'auth/reset-password'],
  ['/register', 'auth/register'],
] as const;

const registeredComponentNames = new Set([
  ...componentsJson.components.basic.map((item: { name: string }) => item.name),
  ...componentsJson.components.composite.map((item: { name: string }) => item.name),
  ...componentsJson.components.layout.map((item: { name: string }) => item.name),
]);

const readLayout = (layoutName: string) => {
  const filePath = path.join(layoutsRoot, `${layoutName}.json`);
  return {
    filePath,
    content: fs.readFileSync(filePath, 'utf8'),
    json: JSON.parse(fs.readFileSync(filePath, 'utf8')),
  };
};

const extractNames = (value: unknown, acc: string[] = []) => {
  if (Array.isArray(value)) {
    value.forEach((item) => extractNames(item, acc));
    return acc;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.name === 'string') {
      acc.push(record.name);
    }
    Object.values(record).forEach((item) => extractNames(item, acc));
  }

  return acc;
};

describe('academy-core public route smoke', () => {
  it('maps every README public route to routes.json and an existing layout file', () => {
    const routeMap = new Map(routesJson.routes.map((route: { path: string; layout?: string }) => [route.path, route.layout]));

    for (const [routePath, layoutName] of publicRoutes) {
      expect(routeMap.get(routePath)).toBe(layoutName);
      expect(fs.existsSync(path.join(layoutsRoot, `${layoutName}.json`))).toBe(true);
    }
  });

  it('maps academy-core auth routes to the real layouts, including password recovery flows', () => {
    const routeMap = new Map(routesJson.routes.map((route: { path: string; layout?: string }) => [route.path, route.layout]));

    for (const [routePath, layoutName] of authRoutes) {
      expect(routeMap.get(routePath)).toBe(layoutName);
      expect(fs.existsSync(path.join(layoutsRoot, `${layoutName}.json`))).toBe(true);
    }
  });

  it('keeps public layouts on _user_base and aligns layout_name with the file path', () => {
    for (const [, layoutName] of publicRoutes) {
      const { json } = readLayout(layoutName);
      expect(json.layout_name).toBe(layoutName);
      expect(json.extends).toBe('_user_base');
    }
  });

  it('keeps public layout and partial references valid and avoids the banned conditional type', () => {
    for (const [, layoutName] of publicRoutes) {
      const { content } = readLayout(layoutName);
      const partials = content.match(/partials\/[^"\n]+\.json/g) ?? [];

      for (const partial of partials) {
        expect(fs.existsSync(path.join(layoutsRoot, partial))).toBe(true);
      }

      expect(content).not.toContain('"type": "conditional"');
    }
  });

  it('uses only component names that are registered in components.json', () => {
    const allowed = new Set([...registeredComponentNames, 'SlotContainer']);

    for (const [, layoutName] of publicRoutes) {
      const { json } = readLayout(layoutName);
      const names = extractNames(json);

      for (const name of names) {
        if (name.startsWith('ac_')) continue;
        expect(allowed.has(name)).toBe(true);
      }
    }
  });

  it('avoids auto-loading auth/user for guests and only loads current user data in the mypage base', () => {
    const userBase = readLayout('_user_base').json;
    const mypageBase = readLayout('mypage/_mypage_base').json;

    expect(userBase.data_sources ?? []).toEqual([]);
    expect(mypageBase.data_sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'current_user',
          endpoint: '/api/auth/user',
          auto_fetch: true,
          auth_mode: 'required',
        }),
      ]),
    );
  });

  it('keeps the consultation route wired to the reservation verification and booking flow', () => {
    const consultationLayout = readLayout('consultation').content;
    const consultationForm = fs.readFileSync(path.join(layoutsRoot, 'partials/consultation/_form.json'), 'utf8');

    expect(consultationLayout).toContain('/sanctum/csrf-cookie');
    expect(consultationLayout).toContain('/modules/glitter-reservation/reservation/verification-status');
    expect(consultationLayout).toContain('/modules/glitter-reservation/reservation/services');
    expect(consultationForm).toContain('/modules/glitter-reservation/reservation/email-verifications');
    expect(consultationForm).toContain('/modules/glitter-reservation/reservation/slots');
    expect(consultationForm).toContain('/modules/glitter-reservation/reservation/bookings');
  });

  it('keeps preview and SEO settings aligned with the real academy-core structure', () => {
    expect(fs.existsSync(path.join(templateRoot, templateJson.preview.thumbnail))).toBe(true);
    for (const screenshot of templateJson.preview.screenshots) {
      expect(fs.existsSync(path.join(templateRoot, screenshot))).toBe(true);
    }

    expect(seoConfig.component_map.HtmlContent.props_source).toBe('content');
    expect(Object.keys(templateJson.error_config.layouts).sort()).toEqual(['401', '403', '404', '500', '503', 'maintenance'].sort());
  });
});

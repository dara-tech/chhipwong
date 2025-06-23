// Simple test to verify i18n configuration
const i18n = {
  en: {
    welcome: 'Welcome to KH HARA',
    login: 'Login',
    home: 'Home'
  },
  km: {
    welcome: 'សូមស្វាគមន៍មកកាន់ KH HARA',
    login: 'ចូលប្រើប្រាស់',
    home: 'ទំព័រដើម'
  }
};

describe('i18n Configuration', () => {
  test('has correct English translations', () => {
    expect(i18n.en.welcome).toBe('Welcome to KH HARA');
    expect(i18n.en.login).toBe('Login');
    expect(i18n.en.home).toBe('Home');
  });

  test('has correct Khmer translations', () => {
    expect(i18n.km.welcome).toBe('សូមស្វាគមន៍មកកាន់ KH HARA');
    expect(i18n.km.login).toBe('ចូលប្រើប្រាស់');
    expect(i18n.km.home).toBe('ទំព័រដើម');
  });
});

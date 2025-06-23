// Mock routes configuration
const routes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/professionals', name: 'Professionals' },
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/dashboard', name: 'Dashboard', requiresAuth: true },
  { path: '/profile', name: 'Profile', requiresAuth: true },
  { path: '*', name: 'NotFound' }
];

// Mock navigation function
const navigateTo = (path, isAuthenticated = false) => {
  const route = routes.find(r => r.path === path) || routes.find(r => r.path === '*');
  
  if (route.requiresAuth && !isAuthenticated) {
    return { allowed: false, redirect: '/login', name: route.name };
  }
  
  return { allowed: true, name: route.name };
};

describe('Navigation', () => {
  test('should allow access to public routes when not authenticated', () => {
    const publicRoutes = ['/', '/about', '/professionals', '/login', '/register'];
    
    publicRoutes.forEach(path => {
      const result = navigateTo(path, false);
      expect(result.allowed).toBe(true);
      expect(result.redirect).toBeUndefined();
    });
  });

  test('should redirect to login when accessing protected routes while not authenticated', () => {
    const protectedRoutes = ['/dashboard', '/profile'];
    
    protectedRoutes.forEach(path => {
      const result = navigateTo(path, false);
      expect(result.allowed).toBe(false);
      expect(result.redirect).toBe('/login');
    });
  });

  test('should allow access to protected routes when authenticated', () => {
    const protectedRoutes = ['/dashboard', '/profile'];
    
    protectedRoutes.forEach(path => {
      const result = navigateTo(path, true);
      expect(result.allowed).toBe(true);
      expect(result.redirect).toBeUndefined();
    });
  });

  test('should redirect to 404 for unknown routes', () => {
    const result = navigateTo('/nonexistent-route', false);
    expect(result.name).toBe('NotFound');
  });
});

// Mock authentication functions
const auth = {
  login: async (email, password) => {
    if (email === 'test@example.com' && password === 'password123') {
      return {
        success: true,
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          type: 'user'
        },
        token: 'mock-jwt-token'
      };
    }
    return {
      success: false,
      message: 'Invalid credentials'
    };
  },
  
  logout: () => {
    localStorage.removeItem('token');
    return { success: true };
  },
  
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (token === 'mock-jwt-token') {
      return {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        type: 'user'
      };
    }
    return null;
  }
};

describe('Authentication', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('successful login', async () => {
    const response = await auth.login('test@example.com', 'password123');
    expect(response.success).toBe(true);
    expect(response.user).toBeDefined();
    expect(response.token).toBeDefined();
    
    // Verify token is stored
    localStorage.setItem('token', response.token);
    const user = auth.getCurrentUser();
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  test('failed login with wrong credentials', async () => {
    const response = await auth.login('wrong@example.com', 'wrongpassword');
    expect(response.success).toBe(false);
    expect(response.message).toBe('Invalid credentials');
    
    // Verify no token is stored
    const token = localStorage.getItem('token');
    expect(token).toBeNull();
  });

  test('logout clears user session', async () => {
    // First log in
    const loginResponse = await auth.login('test@example.com', 'password123');
    localStorage.setItem('token', loginResponse.token);
    
    // Then log out
    const logoutResponse = auth.logout();
    expect(logoutResponse.success).toBe(true);
    
    // Verify token is cleared
    const token = localStorage.getItem('token');
    expect(token).toBeNull();
    
    // Verify no user is returned
    const user = auth.getCurrentUser();
    expect(user).toBeNull();
  });
});

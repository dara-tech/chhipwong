// Form validation functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

const validateRequired = (value) => {
  return value.trim() !== '';
};

const validateForm = (formData) => {
  const errors = {};
  
  if (!validateRequired(formData.name)) {
    errors.name = 'Name is required';
  }
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

describe('Form Validation', () => {
  test('should validate required fields', () => {
    const formData = {
      name: '',
      email: 'test@example.com',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!'
    };
    
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Name is required');
  });
  
  test('should validate email format', () => {
    const formData = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!'
    };
    
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Please enter a valid email address');
  });
  
  test('should validate password strength', () => {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'weak',
      confirmPassword: 'weak'
    };
    
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toContain('Password must be at least 8 characters');
  });
  
  test('should validate password confirmation', () => {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'ValidPass123!',
      confirmPassword: 'DifferentPass123!'
    };
    
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.confirmPassword).toBe('Passwords do not match');
  });
  
  test('should pass validation with valid data', () => {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!'
    };
    
    const result = validateForm(formData);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });
});

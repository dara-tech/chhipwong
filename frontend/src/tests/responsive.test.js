// Mock window dimensions
const getWindowDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  isMobile: window.innerWidth < 768,
  isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: window.innerWidth >= 1024
});

// Mock responsive hook
const useResponsive = () => {
  const [dimensions, setDimensions] = React.useState(getWindowDimensions());

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};

describe('Responsive Design', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  afterEach(() => {
    // Reset window dimensions after each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight
    });
    window.dispatchEvent(new Event('resize'));
  });

  test('should detect mobile viewport', () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375 }); // iPhone X width
    window.dispatchEvent(new Event('resize'));
    
    const dimensions = getWindowDimensions();
    expect(dimensions.isMobile).toBe(true);
    expect(dimensions.isTablet).toBe(false);
    expect(dimensions.isDesktop).toBe(false);
  });

  test('should detect tablet viewport', () => {
    // Set tablet viewport
    Object.defineProperty(window, 'innerWidth', { value: 768 }); // iPad width
    window.dispatchEvent(new Event('resize'));
    
    const dimensions = getWindowDimensions();
    expect(dimensions.isMobile).toBe(false);
    expect(dimensions.isTablet).toBe(true);
    expect(dimensions.isDesktop).toBe(false);
  });

  test('should detect desktop viewport', () => {
    // Set desktop viewport
    Object.defineProperty(window, 'innerWidth', { value: 1440 }); // Desktop width
    window.dispatchEvent(new Event('resize'));
    
    const dimensions = getWindowDimensions();
    expect(dimensions.isMobile).toBe(false);
    expect(dimensions.isTablet).toBe(false);
    expect(dimensions.isDesktop).toBe(true);
  });
});

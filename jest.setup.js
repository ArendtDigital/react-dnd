require('@testing-library/jest-dom');

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  x: 0,
  y: 0,
}));

// Mock mouse events
Object.defineProperty(window, 'MouseEvent', {
  value: class MouseEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.clientX = options.clientX || 0;
      this.clientY = options.clientY || 0;
      this.button = options.button || 0;
      this.preventDefault = jest.fn();
      this.stopPropagation = jest.fn();
    }
  },
});

// Mock touch events
Object.defineProperty(window, 'TouchEvent', {
  value: class TouchEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.touches = options.touches || [];
      this.changedTouches = options.changedTouches || [];
      this.preventDefault = jest.fn();
      this.stopPropagation = jest.fn();
    }
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 0);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('Deprecation'))
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

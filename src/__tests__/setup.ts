import { vi, beforeEach } from 'vitest';

// Mock global fetch
global.fetch = vi.fn();

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
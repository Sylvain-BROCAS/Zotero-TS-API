import { vi } from 'vitest';

/**
 * Crée un mock Response complet
 */
export const createMockResponse = (data: any, options: Partial<Response> = {}): Response => {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    redirected: false,
    type: 'basic',
    url: '',
    clone: vi.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: vi.fn(),
    blob: vi.fn(),
    formData: vi.fn(),
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn(),
    ...options,
  } as Response;
};

/**
 * Configure fetch mock to return success response
 */
export const mockFetchSuccess = (data: any) => {
  vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(data));
};

/**
 * Configure fetch mock to return error response
 */
export const mockFetchError = (status: number, statusText: string) => {
  vi.mocked(fetch).mockResolvedValueOnce(createMockResponse(null, {
    ok: false,
    status,
    statusText
  }));
};

/**
 * Configure fetch mock to throw network error
 */
export const mockFetchNetworkError = (message: string = 'Network error') => {
  vi.mocked(fetch).mockRejectedValueOnce(new Error(message));
};

/**
 * Configure fetch mock with malformed JSON response
 */
export const mockFetchMalformedJSON = () => {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
  } as any);
};
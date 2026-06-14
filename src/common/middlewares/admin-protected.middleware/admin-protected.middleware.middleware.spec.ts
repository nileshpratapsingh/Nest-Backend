import { AdminProtectedMiddlewareMiddleware } from './admin-protected.middleware.middleware';

describe('AdminProtectedMiddlewareMiddleware', () => {
  it('should be defined', () => {
    expect(new AdminProtectedMiddlewareMiddleware()).toBeDefined();
  });
});

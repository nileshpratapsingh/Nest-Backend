import { LoginProtectedMiddlewareMiddleware } from './login-protected.middleware.middleware';

describe('LoginProtectedMiddlewareMiddleware', () => {
  it('should be defined', () => {
    expect(new LoginProtectedMiddlewareMiddleware()).toBeDefined();
  });
});

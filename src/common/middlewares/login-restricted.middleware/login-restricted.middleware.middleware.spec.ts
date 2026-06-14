import { LoginRestrictedMiddlewareMiddleware } from './login-restricted.middleware.middleware';

describe('LoginRestrictedMiddlewareMiddleware', () => {
  it('should be defined', () => {
    expect(new LoginRestrictedMiddlewareMiddleware()).toBeDefined();
  });
});

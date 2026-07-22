import { LoginProtectedGuard } from './login-protected.guard';

describe('LoginProtectedGuard', () => {
  it('should be defined', () => {
    expect(new LoginProtectedGuard()).toBeDefined();
  });
});

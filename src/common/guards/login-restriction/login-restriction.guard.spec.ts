import { LoginRestrictionGuard } from './login-restriction.guard';

describe('LoginRestrictionGuard', () => {
  it('should be defined', () => {
    expect(new LoginRestrictionGuard()).toBeDefined();
  });
});

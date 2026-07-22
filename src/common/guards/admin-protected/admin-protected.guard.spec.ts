import { AdminProtectedGuard } from './admin-protected.guard';

describe('AdminProtectedGuard', () => {
  it('should be defined', () => {
    expect(new AdminProtectedGuard()).toBeDefined();
  });
});

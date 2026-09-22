import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminProtectedGuard } from './admin-protected.guard';
import { Role } from '@enums/auth.enum';

describe('AdminProtectedGuard', () => {
  let guard: AdminProtectedGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as Reflector;

    guard = new AdminProtectedGuard(reflector);
  });

  const createExecutionContext = (
    role?: string,
  ): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'user-role': role,
          },
        }),
      }),
    }) as unknown as ExecutionContext;

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(undefined);

    const context = createExecutionContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access when user-role header is missing', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN]);

    const context = createExecutionContext();

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should allow access when role matches', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN]);

    const context = createExecutionContext(Role.ADMIN);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access when role does not match', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.ADMIN]);

    const context = createExecutionContext(Role.USER);

    expect(guard.canActivate(context)).toBe(false);
  });
});

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { LoginRestrictionGuard } from './login-restriction.guard';
import { TokenUtility } from '@utils/token.utility';
import { Role } from '@enums/auth.enum';

describe('LoginRestrictionGuard', () => {
    let guard: LoginRestrictionGuard;
    let tokenUtility: jest.Mocked<TokenUtility>;

    beforeEach(() => {
        tokenUtility = {
            verifyToken: jest.fn(),
        } as unknown as jest.Mocked<TokenUtility>;

        guard = new LoginRestrictionGuard(tokenUtility);
    });

    const createExecutionContext = (
        cookies: Record<string, any> = {},
        headers: Record<string, any> = {},
    ): ExecutionContext =>
        ({
            switchToHttp: () => ({
                getRequest: () => ({
                    cookies,
                    headers,
                }),
            }),
        }) as ExecutionContext;

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should throw UnauthorizedException when no token is provided', () => {
        const context = createExecutionContext();

        expect(() => guard.canActivate(context)).toThrow(
            UnauthorizedException,
        );
    });

    it('should allow access with a valid refresh token cookie', () => {
        tokenUtility.verifyToken.mockReturnValue({
            userId: '123',
            email: 'test@example.com',
            role: Role.ADMIN,
        });

        const context = createExecutionContext({
            refreshToken: 'valid-token',
        });

        expect(guard.canActivate(context)).toBe(true);
        expect(tokenUtility.verifyToken).toHaveBeenCalledWith('valid-token');
    });

    it('should allow access with a valid authorization header', () => {
        tokenUtility.verifyToken.mockReturnValue({
            userId: '123',
            email: 'test@example.com',
            role: Role.ADMIN,
        });

        const context = createExecutionContext(
            {},
            {
                authorization: 'valid-token',
            },
        );

        expect(guard.canActivate(context)).toBe(true);
        expect(tokenUtility.verifyToken).toHaveBeenCalledWith('valid-token');
    });

    it('should deny access when the token is invalid', () => {
        tokenUtility.verifyToken.mockReturnValue({
            userId: '123',
            email: 'test@example.com',
            role: Role.ADMIN,
        });

        const context = createExecutionContext({
            refreshToken: 'invalid-token',
        });

        expect(guard.canActivate(context)).toBe(false);
        expect(tokenUtility.verifyToken).toHaveBeenCalledWith('invalid-token');
    });

    it('should prefer the refreshToken cookie over the authorization header', () => {
        tokenUtility.verifyToken.mockReturnValue({
            userId: '123',
            email: 'test@example.com',
            role: Role.ADMIN,
        });

        const context = createExecutionContext(
            {
                refreshToken: 'cookie-token',
            },
            {
                authorization: 'header-token',
            },
        );

        guard.canActivate(context);

        expect(tokenUtility.verifyToken).toHaveBeenCalledWith('cookie-token');
    });
});

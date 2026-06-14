import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoginProtectedGuard } from '@guards/login-protected/login-protected.guard';
import { AdminProtectedGuard } from '@guards/admin-protected/admin-protected.guard';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    signUp: jest.fn(),
    login: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(LoginProtectedGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AdminProtectedGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { AuthController } from './auth.controller';
import { Context } from '../../common/global/context';
import { Role } from '@repo/shared-types';
import { Test } from '@nestjs/testing';

describe('AuthoController', () => {
  let controller: AuthController;
  const mockCtx = new Context({
    user: {
      scope: 'openid profile email',
      roles: [Role.USER],
      name: 'John Doe',
      preferred_username: 'johndoe',
      given_name: 'John',
      family_name: 'Doe',
      email: 'john.doe@example.com',
      email_verified: true,
    },
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get(AuthController);
  });

  it('should return user', () => {
    const user = controller.me(mockCtx);

    expect(user).toEqual(mockCtx.user);
  });
});

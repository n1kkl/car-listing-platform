import { ProfileService } from './profile.service';
import { Context } from '../../common/global/context';
import { Role } from '@repo/shared-types';
import { CreateProfileDto } from './dto/create-profile.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { type Mocked, TestBed } from '@suites/unit';
import { ProfileRepository } from './profile.repository';
import { Profile } from './profile.entity';
import { createId } from '@paralleldrive/cuid2';

describe('ProfileService', () => {
  let mockCtx: Context;
  let profileService: ProfileService;
  let profileRepository: Mocked<ProfileRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(ProfileService).compile();

    profileService = unit;
    profileRepository = unitRef.get(ProfileRepository);
    mockCtx = new Context({
      user: {
        sub: '1234567890',
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
  });

  it('should throw an error if user is not in context', async () => {
    await expect(
      profileService.create({ displayName: 'John Doe' }, new Context({})),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create a profile', async () => {
    const createProfileDto: CreateProfileDto = {
      displayName: 'John Doe',
    };
    const profile = new Profile();
    profile.id = createId();

    profileRepository.create.mockImplementation(() => profile);
    profileRepository.findOneOrFail.mockImplementation(
      () => new Promise((resolve) => resolve(profile)),
    );

    const result = profileService.create(createProfileDto, mockCtx);

    await expect(result).resolves.toBeDefined();
    expect(profileRepository.create).toHaveBeenCalledWith({
      displayName: createProfileDto.displayName,
      keycloakId: mockCtx.user.sub,
    });
  });

  it('should throw an error if the user already has a profile', async () => {
    const createProfileDto: CreateProfileDto = {
      displayName: 'John Doe',
    };
    const profile = new Profile();
    profile.id = createId();

    profileRepository.create.mockImplementation(() => profile);
    profileRepository.findOne.mockImplementation(
      () => new Promise((resolve) => resolve(profile)),
    );

    const result = profileService.create(createProfileDto, mockCtx);

    await expect(result).rejects.toThrow(BadRequestException);
  });

  it('should retrieve a profile', async () => {
    const profile = new Profile();
    profile.id = createId();

    profileRepository.findOneOrFail.mockImplementation(
      () => new Promise((resolve) => resolve(profile)),
    );

    const result = profileService.retrieve({ id: profile.id }, mockCtx);

    await expect(result).resolves.toBeDefined();
  });

  it('should update a profile', async () => {
    const profile = new Profile();
    profile.id = createId();
    profile.keycloakId = mockCtx.user.sub;

    profileRepository.assign.mockImplementation((_, data) => {
      Object.assign(profile, data);
      return profile;
    });

    profileRepository.findOneOrFail.mockImplementation(
      () => new Promise((resolve) => resolve(profile)),
    );

    const result = profileService.update(
      { id: profile.id },
      { displayName: 'Doe John' },
      mockCtx,
    );

    await expect(result).resolves.toMatchObject({ displayName: 'Doe John' });
  });

  it('should throw an error if the user is not the owner of the profile to be updated', async () => {
    const profile = new Profile();
    profile.id = createId();
    profile.keycloakId = '0987654321';

    profileRepository.findOneOrFail.mockImplementation(
      () => new Promise((resolve) => resolve(profile)),
    );

    const result = profileService.update(
      { id: profile.id },
      { displayName: 'Doe John' },
      mockCtx,
    );

    await expect(result).rejects.toThrow(ForbiddenException);
  });

  it('should delete a profile', async () => {
    const profile = new Profile();
    profile.id = createId();
    profile.keycloakId = mockCtx.user.sub;

    profileRepository.findOneOrFail.mockImplementation(
      () => new Promise((resolve) => resolve(profile)),
    );

    const result = profileService.delete({ id: profile.id }, mockCtx);

    await expect(result).resolves.toEqual(profile);
  });

  it('should throw an error if the user is not the owner of the profile to be deleted', async () => {
    const profile = new Profile();
    profile.id = createId();
    profile.keycloakId = '0987654321';

    profileRepository.findOneOrFail.mockImplementation(
      () => new Promise((resolve) => resolve(profile)),
    );

    const result = profileService.delete({ id: profile.id }, mockCtx);

    await expect(result).rejects.toThrow(ForbiddenException);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user without error', async () => {
    await expect(
      service.create({
        name: 'Tetste',
        email: 'asdf@asdf.com',
        password: 'asjdf',
      }),
    ).resolves.not.toThrowError();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('should generate a hash password and compare', async () => {
    const password = 'test123';

    const hash = await service.hasher(10, password);

    expect(hash).toBeDefined();
    expect(await service.compareHash(password, hash)).toBe(true);
  });
});

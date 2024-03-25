import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from './pg-promise.service';

describe('PgPromiseService', () => {
  let service: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PgPromiseService],
    }).compile();

    service = module.get<PgPromiseService>(PgPromiseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be connected on dev schema', async () => {
    const result = await service.db.one('select CURRENT_SCHEMA');
    expect(result.current_schema).toEqual('dev')
  });
});

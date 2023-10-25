import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { ContactPageService } from './contact-page.service';

describe('ContactPageService', () => {
  let service: ContactPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactPageService, PgPromiseService],
    }).compile();

    service = module.get<ContactPageService>(ContactPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

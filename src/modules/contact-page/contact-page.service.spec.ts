import { Test, TestingModule } from '@nestjs/testing';
import { DbModule } from 'src/infra/db/pg/db.module';
import { ContactPageService } from './contact-page.service';

describe('ContactPageService', () => {
  let service: ContactPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule],
      providers: [ContactPageService],
    }).compile();

    service = module.get<ContactPageService>(ContactPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

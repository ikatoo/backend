import { Test, TestingModule } from '@nestjs/testing';
import { ContactPageService } from './contact-page.service';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import config from 'src/infra/db/pg/config';

describe('ContactPageService', () => {
  let service: ContactPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestPgpromiseModule.register({
          isGlobal: false,
          connection: config,
        }),
      ],
      providers: [ContactPageService],
    }).compile();

    service = module.get<ContactPageService>(ContactPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

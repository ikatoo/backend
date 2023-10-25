import { Test, TestingModule } from '@nestjs/testing';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import config from 'src/infra/db/pg/config';
import { AboutPageService } from './about-page.service';

describe('AboutPageService', () => {
  let service: AboutPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestPgpromiseModule.register({
          isGlobal: false,
          connection: config,
        }),
      ],
      providers: [AboutPageService],
    }).compile();

    service = module.get<AboutPageService>(AboutPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

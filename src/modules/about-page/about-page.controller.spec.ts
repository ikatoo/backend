import { Test, TestingModule } from '@nestjs/testing';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import config from 'src/infra/db/pg/config';

describe('AboutPageController', () => {
  let controller: AboutPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestPgpromiseModule.register({
          isGlobal: false,
          connection: config,
        }),
      ],
      controllers: [AboutPageController],
      providers: [AboutPageService],
    }).compile();

    controller = module.get<AboutPageController>(AboutPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

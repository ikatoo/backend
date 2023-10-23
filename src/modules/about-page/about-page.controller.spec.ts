import { Test, TestingModule } from '@nestjs/testing';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';
import { PgService } from 'src/infra/db/pg/pg.service';

describe('AboutPageController', () => {
  let controller: AboutPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutPageController],
      providers: [AboutPageService, PgService],
    }).compile();

    controller = module.get<AboutPageController>(AboutPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

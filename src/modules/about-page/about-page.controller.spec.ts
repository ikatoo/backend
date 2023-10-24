import { Test, TestingModule } from '@nestjs/testing';
import { DbModule } from 'src/infra/db/pg/db.module';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';

describe('AboutPageController', () => {
  let controller: AboutPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule],
      controllers: [AboutPageController],
      providers: [AboutPageService],
    }).compile();

    controller = module.get<AboutPageController>(AboutPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

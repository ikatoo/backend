import { Test, TestingModule } from '@nestjs/testing';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';

describe('AboutPageController', () => {
  let controller: AboutPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutPageController],
      providers: [AboutPageService],
    }).compile();

    controller = module.get<AboutPageController>(AboutPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

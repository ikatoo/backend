import { Test, TestingModule } from '@nestjs/testing';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

describe('AboutPageController', () => {
  let controller: AboutPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutPageController],
      providers: [AboutPageService, PrismaService],
    }).compile();

    controller = module.get<AboutPageController>(AboutPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

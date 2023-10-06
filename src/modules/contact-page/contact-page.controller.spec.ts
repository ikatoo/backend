import { Test, TestingModule } from '@nestjs/testing';
import { ContactPageController } from './contact-page.controller';
import { ContactPageService } from './contact-page.service';
import { PrismaService } from '../../infra/db/prisma/prisma.service';

describe('ContactPageController', () => {
  let controller: ContactPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactPageController],
      providers: [ContactPageService, PrismaService],
    }).compile();

    controller = module.get<ContactPageController>(ContactPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

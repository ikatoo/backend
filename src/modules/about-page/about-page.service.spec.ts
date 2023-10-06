import { Test, TestingModule } from '@nestjs/testing';
import { AboutPageService } from './about-page.service';
import { PrismaService } from '../../infra/db/prisma/prisma.service';

describe('AboutPageService', () => {
  let service: AboutPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboutPageService, PrismaService],
    }).compile();

    service = module.get<AboutPageService>(AboutPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

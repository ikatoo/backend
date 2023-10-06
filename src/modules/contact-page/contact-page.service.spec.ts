import { Test, TestingModule } from '@nestjs/testing';
import { ContactPageService } from './contact-page.service';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';

describe('ContactPageService', () => {
  let service: ContactPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactPageService, PrismaService],
    }).compile();

    service = module.get<ContactPageService>(ContactPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

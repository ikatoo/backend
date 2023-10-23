import { Test, TestingModule } from '@nestjs/testing';
import { PgService } from 'src/infra/db/pg/pg.service';
import { ContactPageController } from './contact-page.controller';
import { ContactPageService } from './contact-page.service';

describe('ContactPageController', () => {
  let controller: ContactPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactPageController],
      providers: [ContactPageService, PgService],
    }).compile();

    controller = module.get<ContactPageController>(ContactPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

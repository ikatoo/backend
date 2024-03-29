import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { ContactPageController } from './contact-page.controller';
import { ContactPageService } from './contact-page.service';

describe('ContactPageController', () => {
  let controller: ContactPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactPageController],
      providers: [ContactPageService, PgPromiseService],
      imports: [AppModule],
    }).compile();

    controller = module.get<ContactPageController>(ContactPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

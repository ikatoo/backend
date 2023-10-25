import { Test, TestingModule } from '@nestjs/testing';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import config from 'src/infra/db/pg/config';
import { ContactPageController } from './contact-page.controller';
import { ContactPageService } from './contact-page.service';

describe('ContactPageController', () => {
  let controller: ContactPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestPgpromiseModule.register({
          isGlobal: false,
          connection: config,
        }),
      ],
      controllers: [ContactPageController],
      providers: [ContactPageService],
    }).compile();

    controller = module.get<ContactPageController>(ContactPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

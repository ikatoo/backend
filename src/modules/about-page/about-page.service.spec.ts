import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { aboutPageFactory } from 'src/test-utils/about_page-factory';
import { userFactory } from 'src/test-utils/user-factory';
import { AboutPageService } from './about-page.service';

describe('AboutPageService', () => {
  let aboutPageService: AboutPageService;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboutPageService, PgPromiseService],
    }).compile();

    aboutPageService = module.get<AboutPageService>(AboutPageService);
    pgp = module.get<PgPromiseService>(PgPromiseService);
  });

  it('should be defined', () => {
    expect(aboutPageService).toBeDefined();
  });

  it('should get about page', async () => {
    const createdUser = await userFactory();
    const createdAboutPage = await aboutPageFactory(createdUser.id);
    const expected = {
      id: createdAboutPage.id,
      title: createdAboutPage.title,
      description: createdAboutPage.description,
      image: {
        url: createdAboutPage.image_url,
        alt: createdAboutPage.image_alt,
      },
    };

    const result = await aboutPageService.findByUser(createdUser.id);

    expect(result).toEqual(expected);
  });

  it('should create the about page', async () => {
    const createdUser = await userFactory();
    const aboutPageMock = {
      title: 'title',
      description: 'description',
      image: {
        imageUrl: 'image_url',
        imageAlt: 'image_alt',
      },
      userId: createdUser.id,
    };

    await aboutPageService.create(aboutPageMock);

    const result = await pgp.db
      .one('select * from about_pages where user_id=$1', [createdUser.id])
      .then((page) => ({
        id: page.id,
        title: page.title,
        description: page.description,
        image: {
          imageUrl: page.image_url,
          imageAlt: page.image_alt,
        },
        userId: page.user_id,
      }));
    const expected = { id: result.id, ...aboutPageMock };

    expect(result).toEqual(expected);
  });
});

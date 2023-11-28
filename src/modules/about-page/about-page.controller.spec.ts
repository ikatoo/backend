import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { AppModule } from 'src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { aboutPageFactory } from 'src/test-utils/about_page-factory';
import { userFactory } from 'src/test-utils/user-factory';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';

describe('AboutPageController', () => {
  let aboutPageController: AboutPageController;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutPageController],
      providers: [AboutPageService, PgPromiseService],
      imports: [AppModule],
    }).compile();

    aboutPageController = module.get<AboutPageController>(AboutPageController);
    pgp = module.get<PgPromiseService>(PgPromiseService);
  });

  it('should be defined', () => {
    expect(aboutPageController).toBeDefined();
  });

  it('should be create the about page', async () => {
    const { id: userId } = await userFactory();
    const randomTestId = randomBytes(10).toString('hex');
    const pageMock = {
      title: `title ${randomTestId}`,
      description: `description ${randomTestId}`,
      imageUrl: `image_url_${randomTestId}`,
      imageAlt: `image_alt_${randomTestId}`,
    };
    await aboutPageController.create(
      { user: { sub: { id: userId } } },
      {
        title: pageMock.title,
        description: pageMock.description,
        image: {
          imageUrl: pageMock.imageUrl,
          imageAlt: pageMock.imageAlt,
        },
      },
    );
    const createdPage = await pgp.db.one(
      'select * from about_pages where user_id=$1',
      [userId],
    );
    const expected = {
      id: createdPage.id,
      title: pageMock.title,
      description: pageMock.description,
      image_url: pageMock.imageUrl,
      image_alt: pageMock.imageAlt,
      user_id: userId,
    };

    expect(createdPage).toEqual(expected);
  });

  it('should update the about page', async () => {
    const randomTestId = randomBytes(10).toString('hex');

    const { id: user_id } = await userFactory();
    const createdPage = await aboutPageFactory(user_id);

    const newValues = {
      image: {
        imageUrl: `https://new_image_url.com/${randomTestId}.jpg`,
        imageAlt: `${randomTestId} new image alt`,
      },
    };
    await aboutPageController.update(
      { user: { sub: { id: user_id } } },
      newValues,
    );

    const updatedPage = await pgp.db.one(
      'select * from about_pages where user_id=$1;',
      [user_id],
    );
    const expected = {
      id: createdPage.id,
      title: createdPage.title,
      description: createdPage.description,
      image_url: newValues.image.imageUrl,
      image_alt: newValues.image.imageAlt,
      user_id,
    };

    expect(updatedPage).toEqual(expected);
  });

  it('should get the about page of the user', async () => {
    const { id: user_id } = await userFactory();
    const createdPage = await aboutPageFactory(user_id);

    const result = await aboutPageController.findByUser(user_id + '');
    const expected = {
      id: createdPage.id,
      title: createdPage.title,
      description: createdPage.description,
      image: { url: createdPage.image_url, alt: createdPage.image_alt },
    };

    expect(result).toEqual(expected);
  });

  it('should delete page of the user', async () => {
    const { id: user_id } = await userFactory();
    await aboutPageFactory(user_id);

    await aboutPageController.remove({ user: { sub: { id: user_id } } });

    const deletedPage = await pgp.db.oneOrNone(
      'select * from about_pages where user_id=$1',
      [user_id],
    );

    expect(deletedPage).toBeNull();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { userFactory } from 'src/test-utils/user-factory';
import { AboutPageController } from './about-page.controller';
import { AboutPageService } from './about-page.service';
import { AppModule } from 'src/app.module';

describe('AboutPageController', () => {
  let aboutPageController: AboutPageController;
  let pgp: PgPromiseService;

  const pageMock = {
    title: 'Title test',
    description: 'Desc test',
    image_url: 'alsdkfj',
    image_alt: 'llajsdf',
  };

  const pageFactory = async (user_id: number) =>
    await pgp.db.one<{ id: number }>(
      `insert into about_pages(
        user_id, 
        title, 
        description,
        image_url,
        image_alt
      ) values(
        ${user_id}, 
        '${pageMock.title}', 
        '${pageMock.description}',
        '${pageMock.image_url}',
        '${pageMock.image_alt}'
      ) returning id;`,
    );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutPageController],
      providers: [AboutPageService, PgPromiseService],
      imports: [AppModule],
    }).compile();

    aboutPageController = module.get<AboutPageController>(AboutPageController);
    pgp = module.get<PgPromiseService>(PgPromiseService);

    await pgp.db.none('delete from about_pages;');
    await pgp.db.none('delete from users;');
  });

  it('should be defined', () => {
    expect(aboutPageController).toBeDefined();
  });

  it('should be create the about page', async () => {
    const { id: userId } = await userFactory();
    const { image_alt: imageAlt, image_url: imageUrl, ...data } = pageMock;
    await aboutPageController.create(
      { user: { sub: { id: userId } } },
      {
        ...data,
        image: { imageAlt, imageUrl },
      },
    );
    const createdPage = await pgp.db.one(
      'select * from about_pages where user_id=$1',
      [userId],
    );
    const expected = {
      id: createdPage.id,
      ...pageMock,
      user_id: userId,
    };

    expect(createdPage).toEqual(expected);
  });

  it('should update the about page', async () => {
    const { id: user_id } = await userFactory();
    const { id: page_id } = await pageFactory(user_id);

    const newValues = {
      image: {
        imageUrl: pageMock.image_url,
        imageAlt: pageMock.image_alt,
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
      id: page_id,
      ...pageMock,
      image_url: newValues.image.imageUrl,
      image_alt: newValues.image.imageAlt,
      user_id,
    };

    expect(updatedPage).toEqual(expected);
  });

  it('should get the about page of the user', async () => {
    const { id: user_id } = await userFactory();
    await pageFactory(user_id);

    const page = await aboutPageController.findByUser(user_id + '');
    const { image_alt, image_url, ...expected } = pageMock;

    expect(page).toEqual({
      id: page.id,
      ...expected,
      image: { url: image_url, alt: image_alt },
    });
  });

  it('should delete page of the user', async () => {
    const { id: user_id } = await userFactory();
    await pageFactory(user_id);

    await aboutPageController.remove({ user: { sub: { id: user_id } } });

    const deletedPage = await pgp.db.oneOrNone(
      'select * from about_pages where user_id=$1',
      [user_id],
    );

    expect(deletedPage).toBeNull();
  });
});

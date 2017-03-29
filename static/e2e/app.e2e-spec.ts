import { MdStaticPage } from './app.po';

describe('md-static App', () => {
  let page: MdStaticPage;

  beforeEach(() => {
    page = new MdStaticPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

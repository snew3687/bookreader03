import { Bookreader03Page } from './app.po';

describe('bookreader03 App', () => {
  let page: Bookreader03Page;

  beforeEach(() => {
    page = new Bookreader03Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('br03 works!');
  });
});

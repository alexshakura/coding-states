import { CodingStatesPage } from './app.po';

describe('coding-states App', () => {
  let page: CodingStatesPage;

  beforeEach(() => {
    page = new CodingStatesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

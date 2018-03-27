import { DataVisD3Page } from './app.po';

describe('data-vis-d3 App', () => {
  let page: DataVisD3Page;

  beforeEach(() => {
    page = new DataVisD3Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

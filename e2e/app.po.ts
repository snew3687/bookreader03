import { browser, element, by } from 'protractor';

export class Bookreader03Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('br03-root h1')).getText();
  }
}

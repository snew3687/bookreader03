import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

export class PageParagraphInfo {
  constructor(
    readonly firstParagraphIndex: number,
    readonly lastParagraphIndex: number) {}
}

@Injectable()
export class ReaderStateService {
  private emitChapterIndexChangeSource = new Subject<number>();
  private emitPageParagraphsChangeSource = new Subject<PageParagraphInfo>();
  chapterIndexChangeEmitted$ = this.emitChapterIndexChangeSource.asObservable();
  pageParagraphsChangeEmitted$ = this.emitPageParagraphsChangeSource.asObservable();
  currentChapterContentAsDocument: HTMLDocument;
  private _currentChapterIndex: number;
  private _currentParagraphFirstIndex: number;
  private _currentParagraphLastIndex: number;

  constructor() { }

  get currentChapterIndex(): number {
    return this._currentChapterIndex;
  }

  set currentChapterIndex(chapterIndex: number) {
    this._currentChapterIndex = chapterIndex;
    this.emitChapterIndexChange(chapterIndex);
  }

  get currentChapterParagraphCount(): number {
    if (!this.currentChapterContentAsDocument) {
      return 0;
    }

    const htmlNode = this.currentChapterContentAsDocument.children[0];
    const bodyNode = htmlNode.children[1]; // Skip past <html> node
    return bodyNode.children.length;
  }

  setParagraphIndexes(indexParagraphFirst: number, indexParagraphLast: number) {
    this._currentParagraphFirstIndex = indexParagraphFirst;
    this._currentParagraphLastIndex = indexParagraphLast;
    this.emitPageParagraphsChange();
  }

  emitChapterIndexChange(chapterIndex: number) {
    this.emitChapterIndexChangeSource.next(chapterIndex);
  }

  emitPageParagraphsChange() {
    this.emitPageParagraphsChangeSource.next(
      new PageParagraphInfo(this._currentParagraphFirstIndex, this._currentParagraphLastIndex));
  }
}

import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ReaderStateService {
  private emitChapterIndexChangeSource = new Subject<number>();
  private emitIndexParagraphFirstChangeSource = new Subject<number>();
  private emitIndexParagraphLastChangeSource = new Subject<number>();
  chapterIndexChangeEmitted$ = this.emitChapterIndexChangeSource.asObservable();
  indexParagraphFirstChangeEmitted$ = this.emitIndexParagraphFirstChangeSource.asObservable();
  indexParagraphLastChangeEmitted$ = this.emitIndexParagraphLastChangeSource.asObservable();
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
    if (!this.currentChapterContentAsDocument) return 0;
    
    const htmlNode = this.currentChapterContentAsDocument.children[0];
    const bodyNode = htmlNode.children[1]; // Skip past <html> node
    return bodyNode.children.length;
  }

  setParagraphIndexes(indexParagraphFirst: number, indexParagraphLast: number) {
    this._currentParagraphFirstIndex = indexParagraphFirst;
    this._currentParagraphLastIndex = indexParagraphLast;
    this.emitParagraphFirstIndexChange(indexParagraphFirst);
    this.emitParagraphLastIndexChange(indexParagraphLast);
  }

  emitChapterIndexChange(chapterIndex: number) {
    this.emitChapterIndexChangeSource.next(chapterIndex);
  }

  emitParagraphFirstIndexChange(paragraphIndex: number) {
    this.emitIndexParagraphFirstChangeSource.next(paragraphIndex);
  }

  emitParagraphLastIndexChange(paragraphIndex: number) {
    this.emitIndexParagraphLastChangeSource.next(paragraphIndex);
  }
}

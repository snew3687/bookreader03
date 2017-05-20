import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ReaderStateService {
  private emitChapterIndexChangeSource = new Subject<number>();
  chapterIndexChangeEmitted$ = this.emitChapterIndexChangeSource.asObservable();
  currentChapterContentAsDocument: HTMLDocument;
  private _currentChapterIndex: number;

  constructor() { }

  get currentChapterIndex(): number {
    return this._currentChapterIndex;
  }

  set currentChapterIndex(chapterIndex: number) {
    this._currentChapterIndex = chapterIndex;
    this.emitChapterIndexChange(chapterIndex);
  }

  emitChapterIndexChange(chapterIndex: number) {
    this.emitChapterIndexChangeSource.next(chapterIndex);
  }
}

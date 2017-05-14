import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReaderStateService {
  private emitChapterIndexChangeSource = new Subject<number>();
  chapterIndexChangeEmitted$ = this.emitChapterIndexChangeSource.asObservable();

  constructor() { }

  emitChapterIndexChange(chapterIndex: number) {
    this.emitChapterIndexChangeSource.next(chapterIndex);
  }
}

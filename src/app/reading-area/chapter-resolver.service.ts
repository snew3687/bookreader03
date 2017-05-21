import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { BookReaderClasses } from "../BookReaderClasses/bookClasses";
import { BookLibraryService } from "../book-library.service";
import { ReaderStateService } from "../reader/reader-state.service";

@Injectable()
export class ChapterResolver implements Resolve<boolean> {
  constructor(
    private router: Router,
    private bookLibraryService: BookLibraryService,
    private readerStateService: ReaderStateService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const bookUri = route.parent.params['bookUri'];
    const chapterIndex = +route.params['chapterIndex'];

    if (this.readerStateService.currentChapterIndex === chapterIndex
    && !this.readerStateService.currentChapterContentAsDocument) {
      return Observable.of(true);
    }

    return this.bookLibraryService.findBookChapter(bookUri, chapterIndex)
      .map(chapterContent => {
        if (chapterContent) {
          this.storeChapterData(chapterIndex, chapterContent);
          return true;
        }
        console.log(`Chapter content was not found: ${bookUri}, Chapter: ${chapterIndex}`);
        this.router.navigate(['/dashboard']);
        return false;
      })
      .catch(error => {
        console.log(`Retrieval error: ${error}`);
        this.router.navigate(['/dashboard']);
        return Observable.of(false);
      });
  }

  private storeChapterData(chapterIndex: number, chapterContentHtmlAsText: string) {
    const parser = new DOMParser();
    this.readerStateService.currentChapterIndex = chapterIndex;
    this.readerStateService.currentChapterContentAsDocument =
      parser.parseFromString(chapterContentHtmlAsText, "text/html");
  }

}

import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { BookReaderClasses } from "../BookReaderClasses/bookClasses";
import { BookLibraryService } from "../book-library.service";

@Injectable()
export class ChapterResolver implements Resolve<string> {
  constructor(
    private bookLibraryService: BookLibraryService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    const bookUri = route.parent.params['bookUri'];
    const chapterNumber = route.params['chapterNumber'];

    return this.bookLibraryService.findBookChapter(bookUri, chapterNumber)
      .map(chapterContent => {
        if (chapterContent) {
          return chapterContent;
        }
        console.log(`Chapter content was not found: ${bookUri}, Chapter: ${chapterNumber}`);
        this.router.navigate(['/dashboard']);
        return null;
      })
      .catch(error => {
        console.log(`Retrieval error: ${error}`);
        this.router.navigate(['/dashboard']);
        return Observable.of(null);
      });
  }

}

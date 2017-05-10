import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { BookReaderClasses } from "../BookReaderClasses/bookClasses";
import { BookLibraryService } from "../book-library.service";


@Injectable()
export class BookResolver implements Resolve<BookReaderClasses.BookDescriptor> {
  constructor(
    private bookLibraryService: BookLibraryService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BookReaderClasses.BookDescriptor> {
    const bookUri = route.params['bookUri'];

    return this.bookLibraryService.findBookDescriptor(bookUri)
      .map(descriptor => {
        if (descriptor) {
          return descriptor;
        }
        console.log(`BookDescriptor was not found: ${bookUri}`);
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

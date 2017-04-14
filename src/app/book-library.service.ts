import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { BookReaderClasses } from "./BookReaderClasses/bookClasses";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BookLibraryService {
  private bookmarksUrl = 'books/bookmarked';

  constructor(private http: Http) { }

  findBookmarks(): Promise<BookReaderClasses.BookDescriptor[]> {
    return this.http.get(this.bookmarksUrl)
      .toPromise()
      .then(response => response.json().data as BookReaderClasses.BookDescriptor[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}

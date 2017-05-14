import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { BookReaderClasses } from "./BookReaderClasses/bookClasses";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class BookLibraryService {
  readonly baseUrl = 'http://localhost:8080/';
  readonly bookmarksUrl = this.baseUrl + 'books/bookmarked';
  readonly topRatedUrl = this.baseUrl + 'books/toprated';

  constructor(private     http: Http) { }

  findBookmarks(): Observable<BookReaderClasses.BookDescriptor[]> {
    return this.http.get(this.bookmarksUrl)
      .map(this.extractArrayData)
      .catch(this.handleError);
  }

  findTopRated(): Observable<BookReaderClasses.BookDescriptor[]> {
    return this.http.get(this.topRatedUrl)
      .map(this.extractArrayData)
      .catch(this.handleError);
  }

  findBookDescriptor(currentBookUri: string): Observable<BookReaderClasses.BookDescriptor> {
    const bookDescriptorUrl =  this.baseUrl + "books/" + currentBookUri + "?chapterTitles=true";
    return this.http.get(bookDescriptorUrl)
      .map(this.extractObjectData)
      .catch(this.handleError);
  }

  findBookChapter(currentBookUri: string, chapterIndex: number): Observable<string> {
    const bookChapterUrl = this.baseUrl + "books/" + currentBookUri + "/chapter/" + chapterIndex;
    return this.http.get(bookChapterUrl)
      .map(res => res.text())
      .catch(this.handleError);
  }

  private extractObjectData(res: Response) {
    const body = res.json();
    return body.data || body || {};
  }

  private extractArrayData(res: Response) {
    const body = res.json();
    return body.data || body || [];
  }

  // private extractData(res: Response, defaultNoResultValue: any) {
  //   const body = res.json();
  //   return body.data || body || defaultNoResultValue;
  // }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}

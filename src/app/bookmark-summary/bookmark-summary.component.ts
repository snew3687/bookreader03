import { Component, OnInit } from '@angular/core';

import { BookReaderClasses } from "../BookReaderClasses/bookClasses";

import { BookLibraryService } from "../book-library.service";

@Component({
  selector: 'br03-bookmark-summary',
  templateUrl: './bookmark-summary.component.html',
  styleUrls: ['./bookmark-summary.component.css'],
  providers: [ BookLibraryService ]
})
export class BookmarkSummaryComponent implements OnInit {
  bookmarkedDescriptors: BookReaderClasses.BookDescriptor[];

  constructor(private bookLibraryService: BookLibraryService) { }

  ngOnInit() {
    this.bookLibraryService.findBookmarks()
      .subscribe(bookmarks => this.bookmarkedDescriptors = bookmarks);
  }

}

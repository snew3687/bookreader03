import { Component, OnInit } from '@angular/core';

import { BookReaderClasses } from "../BookReaderClasses/bookClasses";

import { BookLibraryService } from "../book-library.service";

@Component({
  selector: 'br03-top-rated-summary',
  templateUrl: './top-rated-summary.component.html',
  styleUrls: ['./top-rated-summary.component.css'],
  providers: [ BookLibraryService ]
})
export class TopRatedSummaryComponent implements OnInit {
  topRatedDescriptors: BookReaderClasses.BookDescriptor[];

  constructor(private bookLibraryService: BookLibraryService) { }

  ngOnInit() {
    this.bookLibraryService.findTopRated()
      .subscribe(descriptors => this.topRatedDescriptors = descriptors);
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { BookReaderClasses } from "../BookReaderClasses/bookClasses";
import { BookLibraryService } from "../book-library.service";

@Component({
  selector: 'br03-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css'],
  providers: [ BookLibraryService ]
})
export class ReaderComponent implements OnInit {
  bookUri: string;
  bookDescriptor: BookReaderClasses.BookDescriptor;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private bookLibraryService: BookLibraryService) { }

  ngOnInit() {
    // TODO: Is it really a good idea to have a subscription within a subscription? Cannot these be chained somehow?
    this.route.params
      .subscribe(params => {
        this.bookUri = params['bookUri'];
        this.bookLibraryService.findBookDescriptor(this.bookUri)
          .subscribe(descriptor => this.bookDescriptor = descriptor);
      });
  }

}

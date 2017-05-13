import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BookReaderClasses } from "../BookReaderClasses/bookClasses";
import { BookLibraryService } from "../book-library.service";

@Component({
  selector: 'br03-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css'],
  providers: [BookLibraryService]
})
export class ReaderComponent implements OnInit {
  bookDescriptor: BookReaderClasses.BookDescriptor;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookLibraryService: BookLibraryService) { }

  ngOnInit() {
    this.bookDescriptor = this.route.snapshot.data['bookDescriptor'];
  }

  handleSelectChapter(chapterIndex: number) {
    this.router.navigate(['chapter', chapterIndex], { relativeTo: this.route });
  }
}

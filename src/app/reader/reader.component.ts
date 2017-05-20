import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BookReaderClasses } from "../BookReaderClasses/bookClasses";
import { BookLibraryService } from "../book-library.service";
import { ReaderStateService } from "./reader-state.service";

@Component({
  selector: 'br03-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css'],
  providers: [BookLibraryService]
})
export class ReaderComponent implements OnInit {
  bookDescriptor: BookReaderClasses.BookDescriptor;
  currentChapterIndex = 0;
  currentFirstParagraphIndex = 0;
  currentLastParagraphIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookLibraryService: BookLibraryService,
    private readerStateService: ReaderStateService) { }

  ngOnInit() {
    this.bookDescriptor = this.route.snapshot.data['bookDescriptor'];
    this.currentChapterIndex = this.readerStateService.currentChapterIndex;
    this.readerStateService.chapterIndexChangeEmitted$.subscribe(chapterIndex =>
      this.currentChapterIndex = chapterIndex);
    this.readerStateService.indexParagraphFirstChangeEmitted$.subscribe(paragraphIndex =>
      this.currentFirstParagraphIndex = paragraphIndex);
    this.readerStateService.indexParagraphLastChangeEmitted$.subscribe(paragraphIndex =>
      this.currentLastParagraphIndex = paragraphIndex);
  }

  get bookUri(): string {
    return this.bookDescriptor.bookUri;
  }

  handleSelectChapter(chapterIndex: number) {
    this.router.navigate(['chapter', chapterIndex], { relativeTo: this.route });
  }
}

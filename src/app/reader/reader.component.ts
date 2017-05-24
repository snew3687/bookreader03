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
  private _currentChapterIndex: number;
  currentFirstParagraphIndex: number;
  currentLastParagraphIndex: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookLibraryService: BookLibraryService,
    private readerStateService: ReaderStateService) {
      this._currentChapterIndex = 0;
      this.currentFirstParagraphIndex = 0;
      this.currentLastParagraphIndex = 0;
    }

  ngOnInit() {
    this.bookDescriptor = this.route.snapshot.data['bookDescriptor'];
    this._currentChapterIndex = this.readerStateService.currentChapterIndex;

    this.readerStateService.chapterIndexChangeEmitted$.subscribe(chapterIndex =>
      this._currentChapterIndex = chapterIndex);

    this.readerStateService.pageParagraphsChangeEmitted$.subscribe(paragraphInfo => {
      this.currentFirstParagraphIndex = paragraphInfo.firstParagraphIndex;
      this.currentLastParagraphIndex = paragraphInfo.lastParagraphIndex;
    });
  }

  get bookUri(): string {
    return this.bookDescriptor.bookUri;
  }

  get currentChapterIndex(): number {
    return this._currentChapterIndex;
  }

  set currentChapterIndex(chapterIndex: number) {
    this.router.navigate(['chapter', chapterIndex], { relativeTo: this.route });
  }

  handleClickPreviousPage() {
    const prevPageLastParagraphIndex = this.currentFirstParagraphIndex - 1;
    if (prevPageLastParagraphIndex < 0) {
      if (this._currentChapterIndex === 0) {
        // Do nothing. Cannot navigate back from start of book
      } else {
        this.navigateToPreviousChapterFinalPage();
      }
    } else {
      this.navigateToPageEndingWithParagraph(prevPageLastParagraphIndex);
    }
  }

  handleClickNextPage() {
    const nextPageFirstParagraphIndex = this.currentLastParagraphIndex + 1;

    if (nextPageFirstParagraphIndex < this.currentChapterParagraphCount()) {
      this.navigateToParagraph(nextPageFirstParagraphIndex);
    } else if (this._currentChapterIndex + 1 < this.bookDescriptor.chapterCount) {
      this.navigateToNextChapterStart();
    } else {
      // Do nothing. Cannot navigate further
    }
  }

  private navigateToPreviousChapterFinalPage() {
    const chapterFinalParagraphIndex = this.readerStateService.IndexIndicatingChapterFinalParagraph;
    this.router.navigate(
        ['reader', this.bookUri, 'chapter', this._currentChapterIndex - 1, 'para', chapterFinalParagraphIndex, 'paging', 'backward' ]);
  }

  private navigateToPageEndingWithParagraph(paragraphIndex: number) {
    this.router.navigate(
        ['reader', this.bookUri, 'chapter', this._currentChapterIndex, 'para', paragraphIndex, 'paging', 'backward' ]);
  }

  private navigateToParagraph(paragraphIndex: number) {
    this.router.navigate(
        ['reader', this.bookUri, 'chapter', this._currentChapterIndex, 'para', paragraphIndex ]);
  }

  private navigateToNextChapterStart() {
    const nextChapterIndex = this._currentChapterIndex + 1;
    this.router.navigate(['chapter', nextChapterIndex], { relativeTo: this.route });
  }

  private currentChapterParagraphCount(): number {
    return this.readerStateService.currentChapterParagraphCount;
  }
}

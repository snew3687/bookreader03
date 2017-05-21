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
  currentChapterIndex: number;
  currentFirstParagraphIndex: number;
  currentLastParagraphIndex: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookLibraryService: BookLibraryService,
    private readerStateService: ReaderStateService) { 
      this.currentChapterIndex = 0;
      this.currentFirstParagraphIndex = 0;
      this.currentLastParagraphIndex = 0;
    }

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

  handleClickNextPage() {
    const nextPageFirstParagraphIndex = this.currentLastParagraphIndex + 1;
    
    if (nextPageFirstParagraphIndex < this.currentChapterParagraphCount()) {
      this.navigateToParagraph(nextPageFirstParagraphIndex);
    } else if (this.currentChapterIndex + 1 < this.bookDescriptor.chapterCount) {
      this.navigateToNextChapterStart();
    } else {
      // Do nothing. Cannot navigate further
    }
  }

  private navigateToParagraph(paragraphIndex: number) {
    this.router.navigate(
        ['reader', this.bookUri, 'chapter', this.currentChapterIndex, 'para', paragraphIndex ]);
  }

  private navigateToNextChapterStart() {
    const nextChapterIndex = this.currentChapterIndex + 1;
    this.router.navigate(['chapter', nextChapterIndex], { relativeTo: this.route });
  }

  private currentChapterParagraphCount(): number {
    return this.readerStateService.currentChapterParagraphCount;
  }
}

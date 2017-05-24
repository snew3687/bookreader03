import { Component, OnInit, ApplicationRef } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';

import { BookLibraryService } from "../book-library.service";
import { ReaderStateService } from "../reader/reader-state.service";

@Component({
  selector: 'br03-reading-area',
  templateUrl: './reading-area.component.html',
  styleUrls: ['./reading-area.component.css'],
  providers: [BookLibraryService]
})
export class ReadingAreaComponent implements OnInit {
  pageContent: string;
  areaScrollHeight = 0;
  areaHeight = 0;
  indexParagraphFirst = 0;
  indexParagraphLast = 0;

  @ViewChild('readingAreaContainer') readingAreaContainer: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private bookLibraryService: BookLibraryService,
    private readerStateService: ReaderStateService) { }

  ngOnInit() {
    this.route.params.subscribe(params => this.handleRouteParamsChange(params));
  }

  private handleRouteParamsChange(params) {
    const pagingDirection = params['pagingDirection'] || 'forward';

    if (pagingDirection === 'backward') {
      this.indexParagraphLast = +params['paragraphIndex'] || 0;
      if (this.isIndicatingChapterFinalParagraph(this.indexParagraphLast)) {
        this.pageThroughToChapterUpToFinalPage();
      } else {
        this.buildPageContentForPreviousParagraphs();
      }
    } else {
      this.indexParagraphFirst = +params['paragraphIndex'] || 0;
      this.buildPageContentForNextParagraphs();
    }
  }

  private pageThroughToChapterUpToFinalPage() {
    const chapterFinalParagraphIndex = this.readerStateService.currentChapterParagraphCount - 1;
    this.indexParagraphFirst = 0;
    this.indexParagraphLast = 0;
    while (this.indexParagraphLast < chapterFinalParagraphIndex) {
      this.indexParagraphFirst = this.indexParagraphLast ? this.indexParagraphLast + 1 : 0;
      this.buildPageContentForNextParagraphs();
    }
  }

  private isIndicatingChapterFinalParagraph(paragraphIndex: number) {
    return paragraphIndex === this.readerStateService.IndexIndicatingChapterFinalParagraph;
  }

  get chapterContentAsDocument(): HTMLDocument { return this.readerStateService.currentChapterContentAsDocument; }

  private getChapterHtmlParagraphs(): HTMLCollection {
    const htmlNode = this.chapterContentAsDocument.children[0];
    const bodyNode = htmlNode.children[1]; // Skip past <html> node
    return bodyNode.children;
  }

  private buildPageContentForPreviousParagraphs() {
    const htmlParagraphs = this.getChapterHtmlParagraphs();
    this.pageContent = "";

    this.indexParagraphFirst = this.indexParagraphLast;
    for (let index = this.indexParagraphLast; index >= 0; index--) {
      const chapterContentWithoutPreviousParagraph = this.pageContent;
      const element = htmlParagraphs[index];
      this.pageContent = element.outerHTML + this.pageContent;
      this.indexParagraphFirst--;

      this.ref.detectChanges();

      if (this.isReadingContainerLargerThanPage()) {
        this.pageContent = chapterContentWithoutPreviousParagraph;
        this.indexParagraphFirst++;
        break;
      }
    }
    this.readerStateService.setParagraphIndexes(this.indexParagraphFirst, this.indexParagraphLast);
  }

  private buildPageContentForNextParagraphs() {
    const htmlParagraphs = this.getChapterHtmlParagraphs();
    this.pageContent = "";

    this.indexParagraphLast = this.indexParagraphFirst - 1;
    for (let index = this.indexParagraphFirst; index < htmlParagraphs.length; index++) {
      const chapterContentWithoutNextParagraph = this.pageContent;
      const element = htmlParagraphs[index];
      this.pageContent += element.outerHTML;
      this.indexParagraphLast++;

      this.ref.detectChanges();

      if (this.isReadingContainerLargerThanPage()) {
        this.pageContent = chapterContentWithoutNextParagraph;
        this.indexParagraphLast--;
        break;
      }
    }
    this.readerStateService.setParagraphIndexes(this.indexParagraphFirst, this.indexParagraphLast);
  }

  private isReadingContainerLargerThanPage(): boolean {
    const div = this.readingAreaContainer.nativeElement;
    const divOffsetBottom = div.offsetTop + div.clientHeight;
    return divOffsetBottom > document.body.clientHeight;
  }
}

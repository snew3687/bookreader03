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
  pageFirstParaIndex = 0;
  pageLastParaIndex = 0;

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
      this.pageLastParaIndex = +params['paragraphIndex'] || 0;
      if (this.isIndicatingChapterFinalParagraph(this.pageLastParaIndex)) {
        this.pageThroughToChapterUpToFinalPage();
      } else {
        this.buildPageContentForPreviousParagraphs();
      }
    } else {
      this.pageFirstParaIndex = +params['paragraphIndex'] || 0;
      this.buildPageContentForNextParagraphs();
    }
  }

  private pageThroughToChapterUpToFinalPage() {
    const chapterFinalParagraphIndex = this.readerStateService.currentChapterParagraphCount - 1;
    this.pageFirstParaIndex = 0;
    this.pageLastParaIndex = 0;
    while (this.pageLastParaIndex < chapterFinalParagraphIndex) {
      this.pageFirstParaIndex = this.pageLastParaIndex ? this.pageLastParaIndex + 1 : 0;
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

    this.pageFirstParaIndex = this.pageLastParaIndex;
    for (let index = this.pageLastParaIndex; index >= 0; index--) {
      const chapterContentWithoutPreviousParagraph = this.pageContent;
      const element = htmlParagraphs[index];
      this.pageContent = element.outerHTML + this.pageContent;
      this.pageFirstParaIndex--;

      this.ref.detectChanges();

      if (this.isReadingContainerLargerThanPage()) {
        this.pageContent = chapterContentWithoutPreviousParagraph;
        this.pageFirstParaIndex++;
        break;
      }
    }
    this.readerStateService.setParagraphIndexes(this.pageFirstParaIndex, this.pageLastParaIndex);
  }

  private buildPageContentForNextParagraphs() {
    const htmlParagraphs = this.getChapterHtmlParagraphs();
    this.pageContent = "";

    this.pageLastParaIndex = this.pageFirstParaIndex - 1;
    for (let index = this.pageFirstParaIndex; index < htmlParagraphs.length; index++) {
      const chapterContentWithoutNextParagraph = this.pageContent;
      const element = htmlParagraphs[index];
      this.pageContent += element.outerHTML;
      this.pageLastParaIndex++;

      this.ref.detectChanges();

      if (this.isReadingContainerLargerThanPage()) {
        this.pageContent = chapterContentWithoutNextParagraph;
        this.pageLastParaIndex--;
        break;
      }
    }
    this.readerStateService.setParagraphIndexes(this.pageFirstParaIndex, this.pageLastParaIndex);
  }

  private isReadingContainerLargerThanPage(): boolean {
    const div = this.readingAreaContainer.nativeElement;
    const divOffsetBottom = div.offsetTop + div.clientHeight;
    return divOffsetBottom > document.body.clientHeight;
  }
}

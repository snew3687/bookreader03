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
  chapterContent: string;
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
    this.indexParagraphFirst = params['paragraphIndex'] || 0;

    this.displayChapterContent();
  }

  get chapterContentAsDocument(): HTMLDocument { return this.readerStateService.currentChapterContentAsDocument; }

  private displayChapterContent() {
    const htmlNode = this.chapterContentAsDocument.children[0];
    const bodyNode = htmlNode.children[1]; // Skip past <html> node
    this.chapterContent = "";

    this.indexParagraphLast = this.indexParagraphFirst - 1;
    for (let index = this.indexParagraphFirst; index < bodyNode.children.length; index++) {
      const chapterContentWithoutNextParagraph = this.chapterContent;
      const element = bodyNode.children[index];
      this.chapterContent += element.outerHTML;
      this.indexParagraphLast++;

      this.ref.detectChanges();

      if (this.isReadingContainerLargerThanPage()) {
        this.chapterContent = chapterContentWithoutNextParagraph;
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

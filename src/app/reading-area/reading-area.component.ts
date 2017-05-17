import { Component, OnInit, ApplicationRef } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core";
//import { NgZone } from "@angular/core";
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
  chapterContentAsDocument: HTMLDocument;

  @ViewChild('readingAreaContainer') readingAreaContainer: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    //private zone: NgZone,
    private bookLibraryService: BookLibraryService,
    private readerStateService: ReaderStateService) { }

  ngOnInit() {
    this.route.params.subscribe(params =>
      this.readerStateService.emitChapterIndexChange(+params['chapterIndex']));
    this.route.data.subscribe(data => this.storeAndDisplayChapterContent(data['chapterContent']));
  }

  private storeAndDisplayChapterContent(chapterContentHtmlAsText: string) {
    const parser = new DOMParser();
    this.chapterContentAsDocument = parser.parseFromString(chapterContentHtmlAsText, "text/html");

    const htmlNode = this.chapterContentAsDocument.children[0];
    const bodyNode = htmlNode.children[1]; // Skip past <html> node
    this.chapterContent = "";

    for (let index = 0; index < bodyNode.children.length; index++) {
      const chapterContentWithoutNextParagraph = this.chapterContent;
      const element = bodyNode.children[index];
      this.chapterContent += element.outerHTML;

      this.ref.detectChanges();

      if (this.isReadingContainerLargerThanPage()) {
        this.chapterContent = chapterContentWithoutNextParagraph;
        break;
      }
    }
  }

  private isReadingContainerLargerThanPage(): boolean {
    let div = this.readingAreaContainer.nativeElement;
    let divOffsetBottom = div.offsetTop + div.clientHeight;
    return divOffsetBottom > document.body.clientHeight;
  } 
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ViewChild, ViewChildren, QueryList, ElementRef} from '@angular/core'

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

  @ViewChild('readingAreaContainer') readingAreaContainer:ElementRef; 
  
  constructor(
    private route: ActivatedRoute,
    private bookLibraryService: BookLibraryService,
    private readerStateService: ReaderStateService) {}

  ngOnInit() {
    this.route.params.subscribe(params =>
      this.readerStateService.emitChapterIndexChange(+params['chapterIndex']));
    this.route.data.subscribe(data => this.chapterContent = data['chapterContent']);
  }

  // areaScrollHeight(): number {
  //   return this.readingAreaContainer.nativeElement.scrollHeight;
  // }
  
  // areaHeight(): number {
  //   return this.readingAreaContainer.nativeElement.height;
  // }

  onClickMe() {
    this.areaScrollHeight = this.currentScrollHeight;
    this.areaHeight = this.currentHeight;
  }

  get currentScrollHeight(): number { return this.readingAreaContainer.nativeElement.scrollHeight; }

  get currentHeight(): number { return this.readingAreaContainer.nativeElement.clientHeight; }
}

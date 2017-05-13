import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BookLibraryService } from "../book-library.service";

@Component({
  selector: 'br03-reading-area',
  templateUrl: './reading-area.component.html',
  styleUrls: ['./reading-area.component.css'],
  providers: [BookLibraryService]
})
export class ReadingAreaComponent implements OnInit {
  chapterContent: string;

  constructor(
    private route: ActivatedRoute,
    private bookLibraryService: BookLibraryService) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.chapterContent = data['chapterContent']);
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'br03-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit {
  bookUri: string;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => this.bookUri = params['bookUri']);
  }

}

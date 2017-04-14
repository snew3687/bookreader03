import { Injectable } from '@angular/core';

import { BookReaderClasses } from "./BookReaderClasses/bookClasses";

const BOOKMARKS: BookReaderClasses.BookDescriptor[] = [
  {
    Title: "Dracula",
    Author: "Bram Stoker",
    ReleaseDate: "August 16, 2013 [EBook #345]",
    Language: "English",
    chapterCount: 0,
    chapterTitles: [],
    bookUri: "",
    bookmark: new BookReaderClasses.BookMark(0, 0),
    rating: 0
  },
  {
    Title: "Grimms' Fairy Tales",
    Author: "The Brothers Grimm",
    ReleaseDate: "April, 2001",
    Language: "English",
    chapterCount: 0,
    chapterTitles: [],
    bookUri: "",
    bookmark: new BookReaderClasses.BookMark(0, 0),
    rating: 0
  },
  {
    Title: "Pride and Prejudice",
    Author: "Jane Austen",
    ReleaseDate: "June, 1998",
    Language: "English",
    chapterCount: 0,
    chapterTitles: [],
    bookUri: "",
    bookmark: new BookReaderClasses.BookMark(0, 0),
    rating: 0
  },
  {
    Title: "War and Peace II",
    Author: "Leo Tolstoy",
    ReleaseDate: "--",
    Language: "English",
    chapterCount: 0,
    chapterTitles: [],
    bookUri: "",
    bookmark: new BookReaderClasses.BookMark(0, 0),
    rating: 0
  }
];

@Injectable()
export class BookLibraryService {

  constructor() { }

  findBookmarks(): Promise<BookReaderClasses.BookDescriptor[]> {
    return Promise.resolve(BOOKMARKS);
  }

}

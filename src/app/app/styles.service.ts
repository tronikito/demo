import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StylesService {

    classMain: string = "main";
    classMain$: Subject<string> = new Subject<string>();
    classHeader: string = "header";
    classHeader$: Subject<string> = new Subject<string>();

  constructor() { }

  public changeStyle(from) {
    this.classMain = "main" + from;
    this.classMain$.next(this.classMain);
    this.classHeader = "header" + from;
    this.classHeader$.next(this.classHeader);
  }
}



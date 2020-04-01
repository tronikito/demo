import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StylesService } from '../app/styles.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {

  classMain: string;
  classMain$: Subscription;

  constructor(public StylesService: StylesService) {
}

  ngOnInit() {
    this.classMain$ = this.StylesService.classMain$.subscribe(Ask => {
      this.classMain = Ask;
    });
  }
}
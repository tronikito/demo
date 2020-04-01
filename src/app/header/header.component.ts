import { Component, OnInit } from '@angular/core';
import { StylesService } from '../app/styles.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  classHeader: string;
  classHeader$: Subscription;
  
  constructor(public StylesService: StylesService) { }

  ngOnInit() {
    this.classHeader$ = this.StylesService.classHeader$.subscribe(Ask => {
      this.classHeader = Ask;
    });
  }

  getBackGround(type) {
    if (type == "memory") {
      return "../../../assets/images/0black.png";
    }
    if (type == "home") {
      return "../../../assets/images/home.png";
    }
    if (type == "crucigrama") {
      return "../../../assets/images/crucigrama.png";
    }
    if (type == "sopa") {
      return "../../../assets/images/sopa.png";
    }
  }
 /* setTimeGame() {
    setInterval((evt) => {

      this.clockTime += 1000;
      const time = new Date(this.clockTime);
      this.timeLabel.string = time.getMinutes().toString().padStart(2, "0") + ':' + time.getSeconds().toString().padStart(2, "0");

    }, 1000);
  }*/
}

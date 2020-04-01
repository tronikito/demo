import { Component, OnInit } from '@angular/core';
import { gameList } from '../../assets/model/all.model';
import { StylesService } from '../app/styles.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {

  games: gameList;
  
  constructor(public StylesService: StylesService) {
  }

  ngOnInit() {
    try {
      this.games = require("../../assets/json/gameList.json");
    }
    catch(error) {
      console.log("Cannot load gameList");
    }
    this.StylesService.changeStyle("Home");
  }
}

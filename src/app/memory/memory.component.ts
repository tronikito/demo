import { Component, OnInit } from '@angular/core';
import { question } from '../../assets/model/memory.model';
import { Subscription } from 'rxjs';
import { MemoryService } from './memory.service';
import { StylesService } from '../app/styles.service';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html'
})

export class MemoryComponent implements OnInit {

  public botom: boolean = true;
  public endGame: boolean;
  public endGame$: Subscription;
  public reciveQuestionData: question;
  public reciveQuestionData$: Subscription;
  public sendQuestion: boolean;
  public sendQuestion$: Subscription;
  public subscription: Subscription;
  public generateQuestion: question[] = [];

  constructor(public MemoryService: MemoryService,
              public StylesService: StylesService) {
  }

  add() {
    this.MemoryService.generateQuestions(10,12); //cantidad preguntas,total preguntas json
    this.botom = false;
  }
  
  ngOnInit() {
      this.subscription = this.MemoryService.generateQuestion$.subscribe(Ask => {
      this.generateQuestion = Ask;
      this.subscription.unsubscribe();
    });
      this.sendQuestion$ = this.MemoryService.sendQuestion$.subscribe(Ask => {
      this.sendQuestion = Ask;
    });
    this.reciveQuestionData$ = this.MemoryService.sendQuestionData$.subscribe(Ask => {
      this.reciveQuestionData = Ask;
    });
      this.endGame$ = this.MemoryService.endGame$.subscribe(Ask => {
      this.endGame = Ask;
   });
    // Parche
    this.MemoryService.question = require("../../assets/json/questions.json");
    /*rutaimagen ../assets/images/memory.jpg **/
    this.StylesService.changeStyle("Memory");
    this.MemoryService.generateQuestions(10,12); //cantidad preguntas,total preguntas json
    this.botom = false;
  }
}
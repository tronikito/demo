import { Component, OnInit, Input } from '@angular/core';
import { MemoryService } from '../memory.service'
import { question } from '../../../assets/model/memory.model'
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
})
export class CartaComponent implements OnInit {
  public subscription: Subscription;
  public generateQuestion: Array<question> = [];
  public findCard: question;

  constructor(private MemoryService: MemoryService) { }

  @Input() question: question;

  boxOff() {
    this.MemoryService.questionOff(this.question.qID,this.question.status,this.question.box);
  }
  ngOnInit() {
    this.subscription = this.MemoryService.generateQuestion$.subscribe(Ask => {
      this.generateQuestion = Ask;
    });
  }
  getBackground() {
    this.findCard = this.generateQuestion.find(question => question.qID === this.question.qID && question.box === this.question.box);
    if (this.findCard.status && !this.findCard.success) {
      return "../assets/images/0" + this.findCard.qID + ".png";
    } else if (!this.findCard.status && !this.findCard.success) {
      return "../assets/images/0black.png";
    } else if (this.findCard.success) {
      return "../assets/images/0" + this.findCard.qID + ".png";
    }
  }
}
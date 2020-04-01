import { Component, OnInit, Input } from '@angular/core';
import { question } from '../../../assets/model/all.model';
import { MemoryService } from '../memory.service'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  @Input() question: question;s
  constructor(public MemoryService: MemoryService) { }

  ngOnInit() {
  }

  qselect(qnumber) {
    if (qnumber == this.question.rcorrect) {
      this.MemoryService.rcorrect += 20;
      this.MemoryService.desactiveQuestionFrame();
    }
    else {
      this.MemoryService.rcorrect += 5;
      this.MemoryService.desactiveQuestionFrame();
    }
  }
}
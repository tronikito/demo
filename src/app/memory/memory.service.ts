import { Injectable } from '@angular/core';
import { question } from '../../assets/model/memory.model'
import { ReplaySubject, Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  //questions watcher "solo start"
  
  public generateQuestion: Array<question> = [];
  public generateQuestion$: ReplaySubject<question[]> = new ReplaySubject<question[]>();

  //generateQuestions dependencias

  private count: number = 1;
  private repe: boolean;
  public question: Array<question>;
  private randQ: number;
  private randA: Array<number> = [];
  private randB: Array<number> = [];

  // questionOff fuction

  public sendQuestion$: Subject<boolean> = new Subject<boolean>();
  public endGame: boolean = false;
  public endGame$: Subject<boolean> = new Subject<boolean>();
  public sendQuestionData: question;
  public sendQuestionData$: Subject<question> = new Subject<question>();

  public rcorrect: number = 0; //puntuacion
  public lastQuestion: question;
  public sendQuestion: boolean = false;
  public qmax: number;
  public qtomax: number = 0;
  private encontrados: question;
  private firstID: number;
  private secondID: number;
  private fail: boolean;
  private encontrado: boolean;
  private firstBox: number;
  private secondBox: number;

  constructor() {
  }

  private generateRandoms(quantity, max) {

    this.repe = false;
    this.count = 0;
    this.generateQuestion = [];

    for (var i = 1; i <= quantity; i++) {
      //genera numeros unicos. Sobre 20.
      this.randQ = Math.round(Math.random() * (max - 1)); //max random siempre da un rango de numeros mayor.
      this.count = 0;
      while (this.count < this.randA.length && !this.repe) {
        //comprueba que no esté repetido.
        if (this.randQ == this.randA[this.count]) {
          this.repe = true;
        }
        this.count++;
      }
      if (!this.repe) {
        //si no es repe lo añade al array
        this.randA.push(this.randQ);
      } else {
        //si lo es vuelve a empezar, resta posición
        this.repe = false;
        i--;
      }
    }
  }

  generateQuestions(quantity, max) {

    this.generateRandoms(quantity, max) //coger array con quantity de numeros aleatorios
    this.encontrado = false;
    this.count = 0;
    this.qmax = quantity;

    for (var i = 1; i <= quantity * 2; i++) {
      //introduce las questions a un array nuevo
      //2 veces por cada una de forma aleatoria
      this.encontrado = false;
      this.count = 0;
      this.randQ = Math.round(Math.random() * (max - 1)); //max random siempre da un rango de numeros mayor.
      while (this.count < this.randA.length && !this.encontrado) {
        if (this.randQ == this.randA[this.count] && this.randQ != this.randB[this.count]) {
          this.randB[this.count] = this.randQ;
          this.randA[this.count] = -1;
          this.encontrado = true;
          this.question[this.randQ].box = 1;
          //la introduce por primera vez
          this.generateQuestion.push({ ...this.question[this.randQ] });
        } else if (this.randQ != this.randA[this.count] && this.randQ == this.randB[this.count]) {
          this.randB[this.count] = -1;
          this.encontrado = true;
          this.question[this.randQ].box = 2;
          //la introduce por segunda vez
          this.generateQuestion.push({ ...this.question[this.randQ] });

        }
        this.count++;
      }
      if (!this.encontrado) {
        i--;
      }
    }
    this.generateQuestion$.next(this.generateQuestion);
    this.count = 0;
    this.encontrado = false;
    this.repe = false;
  }

  //questionOff getter/setter

  private questionSuccessTrue(id, box) {
    this.encontrados = this.generateQuestion.find(question => question.qID === id && question.box === box);
    this.encontrados.success = true;
  }
  private questionStatusTrue(id, box) {
    this.encontrados = this.generateQuestion.find(question => question.qID === id && question.box === box);
    this.encontrados.status = true;
  }
  private questionStatusFalse(id, box) {
    this.encontrados = this.generateQuestion.find(question => question.qID === id && question.box === box);
    this.encontrados.status = false;
  }
  private activarQuestionFrame(question) {
    this.sendQuestion = true;
    this.sendQuestionData = question;
    this.sendQuestion$.next(this.sendQuestion);
    this.sendQuestionData$.next(this.sendQuestionData);
  }
  public desactiveQuestionFrame() {
    this.sendQuestion = false;
    this.sendQuestion$.next(this.sendQuestion);
    this.endThisGame();
  }
  private endThisGame() {
    if (this.qtomax === this.qmax) {
      this.endGame = true;
      this.endGame$.next(this.endGame);
    }
  }

  questionOff(id, status, box) {
    if (!this.sendQuestion) {
      this.count++;
      if (this.fail) { //resetear cajas
        this.questionStatusFalse(this.firstID, this.firstBox);
        this.questionStatusFalse(this.secondID, this.secondBox);
        this.firstID = 0;
        this.firstBox = 0;
        this.secondID = 0;
        this.secondBox = 0;
        this.fail = false;
        status = false;
      }
      if (this.count == 1 && status == false) { //primer pick
        this.firstBox = box;
        this.firstID = id;
        this.questionStatusTrue(id, box);
      }
      if (this.count == 2 && status == false && id == this.firstID && box != this.firstBox) { //acierto
        this.questionSuccessTrue(this.firstID, this.firstBox);
        this.questionStatusTrue(id, box);
        this.questionSuccessTrue(id, box);
        this.activarQuestionFrame(this.question[this.firstID]); //lanzar pregunta
        this.firstID = 0;
        this.firstBox = 0;
        this.count = 0;
        this.qtomax++;
      }
      if (this.count == 2 && this.firstID != id && !this.fail) { //fail
        this.questionStatusTrue(id, box);
        this.secondID = id;
        this.secondBox = box;
        this.count = 0;
        this.fail = true;
      }
      if (this.count == 2 && this.firstID === id && box === this.firstBox && !this.fail) { //clicar la misma no hace nada
        this.count--;
      }
      //if (this.qtomax === this.qmax){ //final }
    }
  }
}
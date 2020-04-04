import { Component, OnInit } from '@angular/core';
import { tablero, casilla, palabra } from '../../assets/model/crucigrama.model';
import { CrucigramaService } from './crucigrama.service';
import { StylesService } from '../app/styles.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-crucigrama',
  templateUrl: './crucigrama.component.html',
  styleUrls: ['./crucigrama.component.css']
})
export class CrucigramaComponent implements OnInit {

  palabras: Array<string>;
  datos: Array<Array<casilla>>;
  crucigrama: tablero = new tablero;
  tiempoR: any;
  tiempoR$: Subject<any> = new Subject<any>();
  lista: Array<palabra>;

  constructor(public CrucigramaService: CrucigramaService,
              public StylesService: StylesService) {
                this.crucigrama.tamanox = 640;
                this.crucigrama.tamanoy = 640;
                this.crucigrama.columnas = 35;
                this.crucigrama.margen = 0;
                this.crucigrama.palabrasSopa = 0;
                this.crucigrama.margenLateral = 15;
                this.crucigrama.colorBorde = "Red";
                this.crucigrama.colorCasillaLetra = "white";
                this.crucigrama.borderC = "gray";
                this.crucigrama.colorCasillaVacia = "none"; /* "#343434" "#5d6770" "#496063" */
               }

  ngOnInit() {
    
    this.tiempoR$.subscribe(Ask => {
      this.tiempoR = Ask;
    });

    this.StylesService.changeStyle("Crucigrama"); //cambiar tema

    this.palabras = require("../../assets/json/palabras.json"); //generar array palabras

    this.crearTablero(); //crear tablero
    
  }

  crearTablero() {

    let tiempoI = new Date();
    tiempoI.getTime();
    this.datos = new Array<Array<casilla>>();
    this.datos = this.CrucigramaService.crearTablero(this.crucigrama);
    let palabras = new Array<string>();

    for (var i = 0; i < this.palabras.length; i++) {
      palabras.push(this.palabras[i]);
    }
    this.crucigrama.palabrasSopa = this.palabras.length;

    if (this.datos) {
      this.lista = this.CrucigramaService.generarRespuestas(this.crucigrama.palabrasSopa,palabras,this.datos,this.crucigrama);
    }

    let tiempoE = new Date();
    tiempoE.getTime();
    this.tiempoR = (tiempoE - tiempoI) + "ms";
    this.tiempoR$.next(this.tiempoR);

  }
  info(letra) {
    console.log(letra);
  }
}
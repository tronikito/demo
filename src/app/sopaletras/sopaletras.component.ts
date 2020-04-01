import { Component, OnInit } from '@angular/core';
import { SopaService } from './sopa.service';
import { StylesService } from '../app/styles.service';
import { letra, palabra, sopaForm, listaP } from '../../assets/model/sopa.model';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-sopaletras',
  templateUrl: './sopaletras.component.html',
})
export class SopaletrasComponent implements OnInit {
  palabras: Array<palabra>;
  datos: Array<Array<letra>>;
  letras: boolean;
  palabros: Array<palabra>;
  empezar: boolean = false;
  form: boolean = true;
  tamanox: FormControl;
  tamanoy: FormControl;
  columnas: FormControl;
  palabrasSopa: FormControl;
  margen: FormControl;
  margenLateral: FormControl;
  colorBorde: FormControl;
  propiedades: sopaForm = new sopaForm;
  lista: Array<listaP>;
  fontsize: number;


  constructor(public SopaService: SopaService,
    public StylesService: StylesService) {
    this.tamanox = new FormControl(640);
    this.tamanoy = new FormControl(640);
    this.columnas = new FormControl(15);
    this.margen = new FormControl(0);
    this.palabrasSopa = new FormControl(15);
    this.margenLateral = new FormControl(0);
    this.colorBorde = new FormControl("Red");
  }

  sendForm() {
    this.propiedades.tamanox = this.tamanox.value;
    this.propiedades.tamanoy = this.tamanoy.value;
    this.propiedades.columnas = this.columnas.value;
    this.propiedades.palabrasSopa = this.palabrasSopa.value;
    this.propiedades.margen = this.margen.value;
    this.propiedades.margenLateral = this.margenLateral.value;
    this.propiedades.colorBorde = this.colorBorde.value;
    this.crearTablero(this.propiedades);
    this.generarRespuestas(this.propiedades.palabrasSopa);
    this.form = false;
    this.empezar = true;
  }
  ngOnInit() {
    //this.palabras = require("../../../assets/json/palabras.json");
    this.StylesService.changeStyle("Sopa");
    try {
      this.palabros = require("../../assets/json/palabras.json");
    }
    catch (error) {
      console.log("Cannot load palabros");
    }
  }


  crearTablero(propiedades) {
    this.datos = this.SopaService.crearTablero(propiedades);
    this.SopaService.palabros = this.palabros;
  }
  generarRespuestas(p) {
    this.SopaService.generarRespuestas(p);
    this.lista = this.SopaService.listaPalabras;
    this.fontsize = this.SopaService.fontsize;
  }
  comprobar(rpos) {
    let resolver = this.SopaService.comprobar(rpos);
    if (resolver != null) {
      for (var i = 0; i < this.lista.length; i++) {
        if(this.lista[i].palabra == resolver) {
          this.lista[i].estado = "line-through";
        }
      }
    }
  }
}

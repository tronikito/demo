import { Injectable } from '@angular/core';
import { letra, palabra, listaP } from '../../assets/model/sopa.model';

@Injectable({
  providedIn: 'root'
})
export class SopaService {

  constructor() { }

  letraN = new letra;
  letra = new letra;
  tamano: number;
  letras = new Array<letra>();
  datos = new Array<Array<letra>>();
  sizeLetra: number;
  columnas: number;
  filas: number;
  marcoLateral: number;
  marcoVertical: number;
  margen: number;
  fontsize: number;
  borderRadius: number;
  border: number;
  color: string;
  palabra: string;
  pos: Array<number> = [0, 0];
  orientacion: number;
  ocupado: boolean;
  contador: number;
  palabros: Array<palabra>;
  lista: Array<string> = [];
  contadorLista: number = 0;
  exitos: number = 0;
  fails: number = 0;
  listaPalabras: Array<listaP> = [];

  public crearTablero(p): Array<Array<letra>> { //importante ---------------------------------------------------------------------------------------
    this.columnas = p.columnas; //define cuantas columnas
    this.margen = p.margen; //define margen entre casillas
    this.marcoLateral = p.margenLateral; //define margen lateral aprox (se recalcula)
    this.color = p.colorBorde; //define color border

    this.calcularC(p.tamanox); //calcular tamaño letra según anchura, y recalcular margen
    this.calcularF(p.tamanoy); //calcular filas, intenta dejar un margen parecido, centrando las cuadriculas.
    this.calcularStyle(); //calcular tamaño fuente, border radius, border

    this.letraN.posX = this.marcoLateral; //define por donde empieza la tabla;
    this.letraN.posY = this.marcoVertical; //define por donde empieza la tabla;
    this.letra.posX = this.letraN.posX; //memoria
    this.letra.posY = this.letraN.posY; //memoria

    for (var y = 1; y <= this.filas; y++) {
      this.letras = new Array; //crear nueva letra

      for (var x = 1; x <= this.columnas; x++) {

        this.generarNuevaLetra(x, y); //genera nueva letra
        this.letras.push(this.letraN); //pushea primera letra, despues NuevaLetra

      }
      this.datos.push(this.letras); //añade fila completada
      this.siguienteFila(); //cambia posY, resetea PosX

    }
    return this.datos;
  }

  //dependencias crearTablero;

  private calcularC(sizeW) {
    this.marcoLateral = (sizeW / 100) * this.marcoLateral;
    this.tamano = Math.floor((sizeW - (this.marcoLateral + (this.margen * (this.columnas - 1)))) / this.columnas);
    this.marcoLateral = Math.floor((sizeW - ((this.tamano * this.columnas) + (this.margen * (this.columnas - 1)))) / 2);
  }
  private calcularF(sizeH) {
    this.filas = Math.floor((((sizeH - (this.marcoLateral * 2)) + this.margen) / (this.tamano + this.margen)));
    this.marcoVertical = Math.floor((sizeH - ((this.tamano * this.filas) + (this.margen * (this.filas - 1)))) / 2);
  }
  private calcularStyle() {
    this.fontsize = Math.round(this.tamano / 1.2);
    this.borderRadius = Math.floor((this.tamano / 100) * 7);
    this.border = this.borderRadius * 2;
  }

  private generarNuevaLetra(x, y) {
    this.letraN = new letra;
    this.letraN.valor = this.generarLetras(1);
    this.letraN.fontsize = this.fontsize;
    this.letraN.borderRadius = this.borderRadius;
    this.letraN.border = this.border;
    this.letraN.tamano = this.tamano;
    this.letraN.rpos = [y - 1, x - 1]; //el array funciona por filas
    this.letraN.uso = false;
    this.letraN.posIni = [-1, -1];
    this.letraN.posEnd = [-1, -1];
    if (x - 1 == 0) {
      this.letraN.posX = this.marcoLateral;
      this.letraN.posY = this.letra.posY;
    }
    else {
      this.letraN.posX = this.letra.posX + this.tamano + this.margen;
      this.letraN.posY = this.letra.posY;
      this.letra.posX = this.letraN.posX; //memoria
    }

  }
  private siguienteFila() {
    this.letra.posX = this.marcoLateral; //memoria
    this.letra.posY = this.letra.posY + this.tamano + this.margen; //memoria
  }
  private generarLetras(tamano) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNÑOPQRSTUVXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < tamano; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  public generarRespuestas(n) { //importante ------------------------------------------------------------------------------------------------------------------------------------------------------------

    for (var nump = 0; nump <= n; nump++) {
      let trying = 0;
      let encontrado = false;
      let margenError = 15;
      this.palabra = this.generarPalabras().toUpperCase();

      if (this.palabra != "ACABADO") {
        this.generarPosicion();

        while (!encontrado && trying < margenError) {
          trying++;
          if (trying == margenError) {
            this.fails++;
          }

          if (this.orientacion == 0 && this.columnas - this.pos[1] >= this.palabra.length) {

            //horizontal

            this.contador = 0;
            this.ocupado = false;

            while (!this.ocupado && this.contador < this.palabra.length) {
              if (this.datos[this.pos[0]][this.pos[1] + this.contador].uso) {
                this.ocupado = true;
              }
              this.contador++;
            }

            if (!this.ocupado) {
              this.exitos++;
              let transformar = new listaP;
              transformar.palabra = this.palabra;
              transformar.estado = "none";
              this.listaPalabras.push(transformar);
              for (var i = 0; i < this.palabra.length; i++) {
                encontrado = true;
                this.generarPalabraHorizontal(i);
              }
            } else {
              this.orientacion = 1;
            }
          }

          if (this.orientacion == 1 && this.filas - this.pos[0] >= this.palabra.length) {

            //vertical

            this.contador = 0;
            this.ocupado = false;

            while (!this.ocupado && this.contador < this.palabra.length) {
              if (this.datos[this.pos[0] + this.contador][this.pos[1]].uso) {
                this.ocupado = true;
              }
              this.contador++;
            }

            if (!this.ocupado) {
              this.exitos++;
              let transformar = new listaP;
              transformar.palabra = this.palabra;
              transformar.estado = "none";
              this.listaPalabras.push(transformar);
              for (var i = 0; i < this.palabra.length; i++) {
                encontrado = true;
                this.generarPalabraVertical(i);
              }
            } else {
              this.orientacion = 0;
            }
          }
          if (!encontrado) {
            this.generarPosicion();
          }
        }
      }
    }
    console.log("fails", this.fails);
    console.log("exitos", this.exitos);
  }

  //dependencia generarRespuestas()

  private generarPalabras() {
    if (this.contadorLista < this.palabros.length) {
      let random = Math.round(Math.random() * (this.palabros.length - 1));
      let palabra = this.palabros[random].palabra;
      while (this.lista.includes(palabra)) {
        random = Math.round(Math.random() * (this.palabros.length - 1));
        palabra = this.palabros[random].palabra;
      }
      this.lista.push(palabra);
      this.contadorLista++;
      return palabra;
    } else {
      console.log("Limite de palabras en la base de datos", this.palabros.length);
      return "acabado";
    }
  }

  private generarPosicion() {
    this.pos[1] = Math.round(Math.random() * (this.columnas - 1));
    this.pos[0] = Math.round(Math.random() * (this.filas - 1));
    this.orientacion = Math.round(Math.random() * 1);
  }
  private cambiarBordeHorizontal(top, right, bottom, left, rpos) {
    this.datos[rpos[0]][rpos[1]].btop = top;
    this.datos[rpos[0]][rpos[1]].bright = right;
    this.datos[rpos[0]][rpos[1]].bbot = bottom;
    this.datos[rpos[0]][rpos[1]].bleft = left;
    this.datos[rpos[0]][rpos[1]].bcolor = this.color;
  }
  private cambiarBordeVertical(top, right, bottom, left, rpos) {
    this.datos[rpos[0]][rpos[1]].btop = top;
    this.datos[rpos[0]][rpos[1]].bright = right;
    this.datos[rpos[0]][rpos[1]].bbot = bottom;
    this.datos[rpos[0]][rpos[1]].bleft = left;
    this.datos[rpos[0]][rpos[1]].bcolor = this.color;
  }

  private generarPalabraHorizontal(i) {
    this.datos[this.pos[0]][this.pos[1] + i].valor = this.palabra[i];
    this.datos[this.pos[0]][this.pos[1] + i].uso = true;
    this.datos[this.pos[0]][this.pos[1] + i].palabra = this.palabra;
    this.datos[this.pos[0]][this.pos[1] + i].orientacion = this.orientacion;
    this.datos[this.pos[0]][this.pos[1] + i].posIni[0] = this.pos[0];
    this.datos[this.pos[0]][this.pos[1] + i].posIni[1] = this.pos[1];
    this.datos[this.pos[0]][this.pos[1] + i].posEnd[0] = this.pos[0];
    this.datos[this.pos[0]][this.pos[1] + i].posEnd[1] = this.pos[1] + this.palabra.length - 1;
  }
  private generarPalabraVertical(i) {
    this.datos[this.pos[0] + i][this.pos[1]].valor = this.palabra[i];
    this.datos[this.pos[0] + i][this.pos[1]].uso = true;
    this.datos[this.pos[0] + i][this.pos[1]].palabra = this.palabra;
    this.datos[this.pos[0] + i][this.pos[1]].orientacion = this.orientacion;
    this.datos[this.pos[0] + i][this.pos[1]].posIni[0] = this.pos[0];
    this.datos[this.pos[0] + i][this.pos[1]].posIni[1] = this.pos[1];
    this.datos[this.pos[0] + i][this.pos[1]].posEnd[0] = this.pos[0] + this.palabra.length - 1;
    this.datos[this.pos[0] + i][this.pos[1]].posEnd[1] = this.pos[1];
  }


  public comprobar(rpos) { //importante-----------------------------------------------------------------------------------------------------------------------

    let letra = this.datos[rpos[0]][rpos[1]];

    if (letra.uso) {
      if (letra.posIni[0] == letra.rpos[0] && letra.posIni[1] === letra.rpos[1]) {      //cabecera

        if (letra.orientacion === 0) {
          //horizontal
          this.cambiarBordeHorizontal(letra.border, 0, letra.border, letra.border, letra.rpos);
        }
        if (letra.orientacion === 1) {
          //vertical
          this.cambiarBordeVertical(letra.border, letra.border, 0, letra.border, letra.rpos);
        }
      } else if (letra.posEnd[0] == letra.rpos[0] && letra.posEnd[1] === letra.rpos[1]) { //final

        if (letra.orientacion === 0) {
          //horizontal
          this.cambiarBordeHorizontal(letra.border, letra.border, letra.border, 0, letra.rpos);
        }
        if (letra.orientacion === 1) {
          //vertical
          this.cambiarBordeVertical(0, letra.border, letra.border, letra.border, letra.rpos);
        }
      } else {                                                                           //medio
        if (letra.orientacion === 0) {
          //horizontal
          this.cambiarBordeHorizontal(letra.border, 0, letra.border, 0, letra.rpos);
        }
        if (letra.orientacion === 1) {
          //vertical
          this.cambiarBordeVertical(0, letra.border, 0, letra.border, letra.rpos);
        }
      }
    }
    return this.comprobarCompleta(letra);
  }
  comprobarCompleta(letra) {
    let ini = letra.posIni;
    let ori = letra.orientacion
    let completa = true;
    let cont = 0;
    if (ori == 0) {
      while (cont < letra.palabra.length && completa) {
        if (this.datos[ini[0]][ini[1] + cont].bcolor != this.color) {
          completa = false;
        }
        cont++;
      }
    }
    if (ori == 1) {
      while (cont < letra.palabra.length && completa) {
        if (this.datos[ini[0] + cont][ini[1]].bcolor != this.color) {
          completa = false;
        }
        cont++;
      }
    }
    if (completa && letra.bcolor == this.color) {
      return letra.palabra;
    }
  }
}



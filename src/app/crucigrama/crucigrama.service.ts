import { Injectable } from '@angular/core';
import { casilla, palabra, coincidencia, listaP } from '../../assets/model/crucigrama.model';

@Injectable({
  providedIn: 'root'
})
export class CrucigramaService {

  constructor() { }

  //dependencias crearTablero;
  //comentario

  private calcularC(t) {
    t.marcoLateral = (t.tamanox / 100) * t.marcoLateral;
    t.tamano = Math.floor((t.tamanox - (t.margenLateral + (t.margen * (t.columnas - 1)))) / t.columnas);
    t.marcoLateral = Math.floor((t.tamanox - ((t.tamano * t.columnas) + (t.margen * (t.columnas - 1)))) / 2);
    return t;
  }
  private calcularF(t) {
    t.filas = Math.floor((((t.tamanoy - (t.marcoLateral * 2)) + t.margen) / (t.tamano + t.margen)));
    t.marcoVertical = Math.floor((t.tamanoy - ((t.tamano * t.filas) + (t.margen * (t.filas - 1)))) / 2);
    return t;
  }
  private calcularStyle(t) {
    t.fontsize = Math.round(t.tamano / 1.2);
    t.borderRadius = Math.floor((t.tamano / 100) * 7);
    t.border = t.borderRadius * 2;
    return t;
  }

  private generarNuevaLetra(x, y, t, oldln) {
    let ln = new casilla;

    if (x - 1 == 0) {
      ln.posX = t.marcoLateral;
      ln.posY = oldln.posY;
    }
    else {
      ln.posX = oldln.posX + t.tamano + t.margen;
      ln.posY = oldln.posY;
      oldln.posX = ln.posX; //memoria
    }
    ln.valor = "";
    //style
    ln.tamano = t.tamano;
    ln.fontsize = t.fontsize;
    ln.borderRadius = t.borderRadius;
    ln.border = t.border;
    ln.background = t.colorCasillaVacia;
    //info palabra
    ln.uso = false;
    ln.posIni = [-1, -1];
    ln.posEnd = [-1, -1];

    return ln;
  }
  private siguienteFila(t, oldln) {
    oldln.posX = t.marcoLateral; //memoria
    oldln.posY = oldln.posY + t.tamano + t.margen; //memoria
  }

  public crearTablero(t): Array<Array<casilla>> { //importante ---------------------------------------------------
    let datos = new Array<Array<casilla>>();
    t = this.calcularC(t); //calcular tamaño casilla según anchura, y recalcular margen
    t = this.calcularF(t); //calcular filas, intenta dejar un margen parecido, centrando las cuadriculas.
    t = this.calcularStyle(t); //calcular tamaño fuente, border radius, border

    let ln = new casilla;
    ln.posX = t.marcoLateral; //define por donde empieza la tabla;
    ln.posY = t.marcoVertical; //define por donde empieza la tabla;
    let oldln = new casilla;
    oldln.posX = ln.posX; //memoria
    oldln.posY = ln.posY; //memoria

    for (var y = 1; y <= t.filas; y++) {
      let letras = new Array<casilla>(); //crear nueva fila

      for (var x = 1; x <= t.columnas; x++) {
        ln = this.generarNuevaLetra(x, y, t, oldln); //genera nueva casilla
        letras.push(ln); //pushea primera casilla, despues NuevaLetra
        ln = new casilla;
      }
      datos.push(letras); //añade fila completada
      this.siguienteFila(t, oldln); //cambia posY, resetea posX

    }
    return datos;
  }

  //###########################################################################################################
  //################################################ datos ####################################################
  //###########################################################################################################



  public generarRespuestas(n, palabros, datos, t) { //importante ------------------------------------------------------------------------

    let lista = new Array<listaP>();
    let contador = this.generarIslas(n, palabros, t, datos, lista);
    let trying = 0;

    while (contador < n && trying <= 100) {
      let coincidencias = Array<Array<coincidencia>>();
      let p = new palabra;
      let nPalabra = Math.round(Math.random() * (palabros.length - 1));

      p.palabra = palabros[nPalabra].palabra.toUpperCase();
      p.orientacion = Math.round(Math.random());

      coincidencias = this.listarCoincidencias(t, p, datos);

      let mayor = 0;
      for (var i = 0; i < coincidencias.length; i++) {//buscar la posicion con mayor coincidencias
        if (coincidencias[i].length > mayor) {
          mayor = i;
        }
      }
      let encontrado = false;
      while (!encontrado && coincidencias.length > 0) {

        encontrado = this.buscarEspacio(coincidencias[mayor], p, t, datos)
        if (!encontrado) {
          coincidencias.splice(mayor, 1);
        }

        if (!encontrado && coincidencias.length > 0) {
          mayor = 0;
          for (var i = 0; i < coincidencias.length; i++) {//buscar la posicion con mayor coincidencias
            if (coincidencias[i].length > mayor) {
              mayor = i;
            }
          }
        }
        if (!encontrado && coincidencias.length == 0) {
        }
        if (encontrado) {
          p.posX = coincidencias[mayor][0].posXcheck;
          p.posY = coincidencias[mayor][0].posYcheck;
          contador++;
          this.colocarPalabra(p, t, datos, contador);
          palabros.splice(nPalabra, 1);//borrar de la lista
          let palabra = new listaP;
          palabra.palabra = p.palabra;
          palabra.numero = contador;
          lista.push(palabra);
          trying = 0;
        }
      }
      trying++;
    }
    console.log(lista);
    return lista;
  }

  //dependencias de generarRespuestas

  private generarIslas(n, palabros, t, datos, lista) {

    
    let islas = 0;
    if (n > t.columnas) {
      islas = Math.ceil(t.columnas / 10);
    } else {
      islas = Math.ceil(n / 10);
    }
    let contador = 0;
    for (var u = 0; u < islas; u++) {
      let p = new palabra;
      let nPalabra = Math.round(Math.random() * (palabros.length - 1));
      p.palabra = palabros[nPalabra].palabra.toUpperCase();
      p.orientacion = Math.round(Math.random());

      let encontrado = false;
      let trying = 0;
      while (!encontrado && trying <= 100) {

        if (p.orientacion == 0) {
          p.posX = Math.round(Math.random() * ((t.columnas - 1) - p.palabra.length) +1);
          p.posY = Math.round(Math.random() * (t.filas - 1));
          console.log(p.posX,p.posY,p.palabra);
        }
        if (p.orientacion == 1) {
          p.posX = Math.round(Math.random() * (t.columnas - 1));
          p.posY = Math.round(Math.random() * ((t.filas - 1) - p.palabra.length) +1);
          console.log(p.posX,p.posY,p.palabra);
        }
        let coin = new coincidencia;
        let ArrC = new Array;
        coin.posXcheck = p.posX
        coin.posYcheck = p.posY
        coin.posX = 0;
        coin.posY = 0;
        ArrC.push(coin);

        encontrado = this.buscarEspacio(ArrC, p, t, datos)

        if (encontrado) {
          contador++;
          this.colocarPalabra(p, t, datos, contador);
          palabros.splice(nPalabra, 1);//borrar de la lista
          let palabra = new listaP;
          palabra.palabra = p.palabra;
          palabra.numero = contador;
          lista.push(palabra);
          trying = 0;
        }
        trying++;
      }
    }
    return contador;
  }

  private listarCoincidencias(t, p, datos) { //busca todas las posiciones y lista coincidencias en un array

    let coincidenciaList = Array<Array<coincidencia>>();

    if (p.orientacion == 0) {
      for (var y = 1; y < t.filas; y++) { // estoy en la fila
        for (var x = 1; x < t.columnas - p.palabra.length + 1; x++) {// estoy en la columna
          let coin = new Array<coincidencia>();
          coin = this.buscarCoincidencia(x, y, p, datos);
          if (coin.length > 0) {
            coincidenciaList.push(coin);
          }
        }
      }
    }

    if (p.orientacion == 1) {
      for (var y = 1; y < t.filas - p.palabra.length + 1; y++) { // estoy en la fila
        for (var x = 1; x < t.columnas; x++) {// estoy en la columna
          let coin = new Array<coincidencia>();
          coin = this.buscarCoincidencia(x, y, p, datos);
          if (coin.length > 0) {
            coincidenciaList.push(coin);
          }
        }
      }
    }

    return coincidenciaList;
  }

  private buscarCoincidencia(x, y, p, datos) {// mandas ubicacion y te busca las coincidencias con la palabra

    let resultado = new Array<coincidencia>();
    let contador = 0;
    let fallo = false;

    if (p.orientacion == 0) {
      for (var xcoin = x; xcoin < x + p.palabra.length; xcoin++) {
        if (datos[y][xcoin].valor === p.palabra[contador] && datos[y][xcoin].orientacion != p.orientacion) {
          let coin = new coincidencia;
          coin.posX = xcoin;
          coin.posY = y;
          coin.valor = p.palabra[contador];
          coin.posXcheck = x;
          coin.posYcheck = y;
          resultado.push(coin);
          //datos[y][xcoin].background = "blue"; //debugg
        } else if (datos[y][xcoin].valor === p.palabra[contador] && datos[y][xcoin].orientacion == p.orientacion) {
          fallo = true;
        } else if (datos[y][xcoin].valor != p.palabra[contador] && datos[y][xcoin].valor != "") {
          fallo = true;
        }
        contador = contador + 1;
      }
      if (!fallo) {
        return resultado;
      } else {
        resultado = new Array<coincidencia>();
        return resultado;
      }
    }

    if (p.orientacion == 1) {
      for (var ycoin = y; ycoin < y + p.palabra.length; ycoin++) {
        if (datos[ycoin][x].valor === p.palabra[contador] && datos[ycoin][x].orientacion != p.orientacion) {
          let coin = new coincidencia;
          coin.posX = x;
          coin.posY = ycoin;
          coin.valor = p.palabra[contador];
          coin.posXcheck = x;
          coin.posYcheck = y;
          resultado.push(coin);
          //datos[y][xcoin].background = "blue"; //debugg
        } else if (datos[ycoin][x].valor === p.palabra[contador] && datos[ycoin][x].orientacion == p.orientacion) {
          fallo = true;
        } else if (datos[ycoin][x].valor != p.palabra[contador] && datos[ycoin][x].valor != "") {
          fallo = true;
        }
        contador = contador + 1;
      }
      if (!fallo) {
        return resultado;
      } else {
        resultado = new Array<coincidencia>();
        return resultado;
      }
    }

  }

  private buscarEspacio(coin, p, t, datos) { //entras posicion y busca si la palabra cabe

    let ok = true;
    let x = coin[0].posXcheck;
    let y = coin[0].posYcheck;
    let xlimite0 = 1;
    let xlimite1 = 1;
    let ylimite0 = 1;
    let ylimite1 = 1;

    if (p.orientacion == 0) {
      if (x == 0) {
        xlimite0 = 0
      }
      if (x == t.columnas - p.palabra.length) {
        xlimite1 = 0
      }
      if (y == 0) {
        ylimite0 = 0;
      }
      if (y == t.filas - 1) {
        ylimite1 = 0;
      }
      for (var xpalabra = x - xlimite0; xpalabra <= x + p.palabra.length - 1 + xlimite1; xpalabra++) {

        let seguir = true;
        for (var i = 0; i < coin.length; i++) {//comprobar que no sea coincidencia
          if (xpalabra == coin[i].posX) {
            seguir = false;
          }
        }
        if (seguir) {
          for (var ycheck = y - ylimite0; ycheck <= y + ylimite1; ycheck++) {//comprobar espacio en columnas de 3

            if (xpalabra == x - 1) {
              if (ycheck == y) {
                if (datos[ycheck][xpalabra].uso) {
                  ok = false;
                }
              }
            } else if (xpalabra == x + p.palabra.length) {
              if (ycheck == y) {
                if (datos[ycheck][xpalabra].uso) {
                  ok = false;
                }
              }
            }
            if (xpalabra != x - 1 && xpalabra != x + p.palabra.length) {
              if (datos[ycheck][xpalabra].uso) {
                ok = false;
              }
            }
          }
        }
      }
    }
    if (p.orientacion == 1) {

      if (x == 0) {
        xlimite0 = 0
      }
      if (x == t.columnas - 1) {
        xlimite1 = 0
      }
      if (y == 0) {
        ylimite0 = 0;
      }
      if (y == t.filas - p.palabra.length) {
        ylimite1 = 0;
      }
      for (var ypalabra = y - ylimite0; ypalabra <= y + p.palabra.length - 1 + ylimite1; ypalabra++) {

        let seguir = true;
        for (var i = 0; i < coin.length; i++) {//comprobar que no sea coincidencia
          if (ypalabra == coin[i].posY) {
            seguir = false;
          }
        }
        if (seguir) {
          for (var xcheck = x - xlimite0; xcheck <= x + xlimite1; xcheck++) {

            if (ypalabra == y - 1) {
              if (xcheck == x) {
                if (datos[ypalabra][xcheck].uso) {
                  ok = false;
                }
              }
            } else if (ypalabra == y + p.palabra.length) {
              if (xcheck == x) {
                if (datos[ypalabra][xcheck].uso) {
                  ok = false;
                }
              }
            }
            if (ypalabra != y - 1 && ypalabra != y + p.palabra.length) {
              if (datos[ypalabra][xcheck].uso) {
                ok = false;
              }
            }
          }
        }
      }
    }
    return ok;
  }

  private colocarPalabra(p, t, datos, contador) {

    if (p.orientacion == 0) {
      for (var i = -1; i < p.palabra.length; i++) {
        if (i == -1) {
          datos[p.posY][p.posX + i].valor = "";
          datos[p.posY][p.posX + i].numero = contador;
          datos[p.posY][p.posX + i].background = t.colorCasillaVacia;
          datos[p.posY][p.posX + i].color = "white";
          datos[p.posY][p.posX + i].fontsize = t.fontsize / 1.4;
        } else {
          datos[p.posY][p.posX + i].valor = p.palabra[i];
          datos[p.posY][p.posX + i].numbero = 0;
          datos[p.posY][p.posX + i].background = t.colorCasillaLetra;
          datos[p.posY][p.posX + i].pborde = "2px black";
        }
        datos[p.posY][p.posX + i].uso = true;
        datos[p.posY][p.posX + i].palabra = p.palabra;
        datos[p.posY][p.posX + i].orientacion = p.orientacion;

        datos[p.posY][p.posX + i].posIni[0] = p.posX;
        datos[p.posY][p.posX + i].posIni[1] = p.posY;
        datos[p.posY][p.posX + i].posEnd[0] = p.posX;
        datos[p.posY][p.posX + i].posEnd[1] = p.posY + p.palabra.length - 1;
      }
    }
    if (p.orientacion == 1) {
      for (var i = -1; i < p.palabra.length; i++) {
        if (i == -1) {
          datos[p.posY + i][p.posX].valor = "";
          datos[p.posY + i][p.posX].numero = contador;
          datos[p.posY + i][p.posX].background = t.colorCasillaVacia;
          datos[p.posY + i][p.posX].color = "white";
          datos[p.posY + i][p.posX].fontsize = t.fontsize / 1.4;
        }
        else {
          datos[p.posY + i][p.posX].valor = p.palabra[i];
          datos[p.posY + i][p.posX].numbero = 0;
          datos[p.posY + i][p.posX].background = t.colorCasillaLetra;
          datos[p.posY + i][p.posX].pborde = "2px black";
        }
        datos[p.posY + i][p.posX].uso = true;
        datos[p.posY + i][p.posX].palabra = p.palabra;
        datos[p.posY + i][p.posX].orientacion = p.orientacion;

        datos[p.posY + i][p.posX].posIni[0] = p.posX;
        datos[p.posY + i][p.posX].posIni[1] = p.posY;
        datos[p.posY + i][p.posX].posEnd[0] = p.posX + p.palabra.length - 1;
        datos[p.posY + i][p.posX].posEnd[1] = p.posY;
      }
    }
  }

}
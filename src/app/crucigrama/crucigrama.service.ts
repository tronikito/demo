import { Injectable } from '@angular/core';
import { casilla, palabra, coincidencia } from '../../assets/model/crucigrama.model';

@Injectable({
  providedIn: 'root'
})
export class CrucigramaService {

  constructor() { }

  //######################################### CREAR TABLERO

  public crearTablero(t): Array<Array<casilla>> { //importante ---------------------------------------------------
    let datos = new Array<Array<casilla>>();

    this.calcularC(t); //calcular tamaño casilla según anchura, y recalcular margen
    this.calcularF(t); //calcular filas, intenta dejar un margen parecido, centrando las cuadriculas.
    this.calcularStyle(t); //calcular tamaño fuente, border radius, border

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

  //dependencias crearTablero;

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
    t.border = t.borderRadius;
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
    ln.valor = null; //<---------------VALOR CASILLAS DEFECTO
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

  //###########################################################################################################
  //################################################ datos ####################################################
  //###########################################################################################################



  public generarRespuestas(n, palabros, datos, t) { // El main (ejecutor de todos los metodos)

    let contador = 0;
    let lista = new Array<palabra>();
    let islas;
    let trying;
    let encontrado;

    
    if (n > t.columnas) islas = Math.ceil(t.columnas / 10); //cuantas generar islas
    else islas = Math.ceil(n / 10);

    encontrado = false;
    trying = 0;
    while (contador < islas && trying <= 10) {//generar un par de islas //si falla 10 palabras diferentes de la lista abandona
      encontrado = this.generarIslas(contador+1, palabros, t, datos, lista);
      if (encontrado) contador++, trying = 0;
      else trying++
    }
    
    encontrado = false;
    trying = 0;
    while (contador < n && trying <= 10) {//generar palabras cruzadas //si falla 10 palabras diferentes de la lista abandona
      encontrado = this.generarPalabras(contador+1, palabros, t, datos, lista);
      if (encontrado) contador++, trying = 0;
      else trying++;
    }
    
    for (var i = 0; i < islas; i++) { //comprobar islas existentes que no esten solas para ocultar
      this.checkIslas(t, datos, lista[i]);
    }

    if (contador < n) { //generar mas islas para los huecos vacios. //si falla 10 palabras diferentes de la lista abandona
      encontrado = false;
      trying = 0;
      while (contador < n && trying <= 10) { 
        encontrado = this.generarIslas(contador+1, palabros, t, datos, lista);
          if (encontrado) {
            contador++, trying = 0;
            this.checkIslas(t, datos, lista[contador-1]);
          }
          else trying++;
          if (trying == 100) n -= 1;
        }
      }
    return lista;
  }

  //######################################### PALABRAS CRUZADAS

  private generarPalabras(contador,palabros, t, datos, lista) {//genera palabras cruzadas

    let encontrado = false;
    let trying = 0;

    let end = palabros.length/2;
    while (!encontrado && trying <= end) {//comprueba la mitad de palabras que quedan por poner
      let coincidencias = Array<Array<coincidencia>>();
      let p = new palabra;
      let nPalabra = Math.round(Math.random() * (palabros.length - 1));

      p.palabra = palabros[nPalabra].palabra.toUpperCase();
      p.orientacion = Math.round(Math.random());
      p.vista = false;

      coincidencias = this.listarCoincidencias(t, p, datos);

      let mayor = 0;
      for (var i = 0; i < coincidencias.length; i++) {//buscar la posicion con mayor coincidencias
        if (coincidencias[i].length > mayor) {
          mayor = i;
        }
      }
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
        if (encontrado) {
          p.posX = coincidencias[mayor][0].posXcheck;
          p.posY = coincidencias[mayor][0].posYcheck;
          this.colocarPalabra(p, t, datos, contador);
          palabros.splice(nPalabra, 1);//borrar de la lista
          p.numero = contador;
          lista.push(p);
          trying = 0;
        }
      }
      trying++;
      }
      return encontrado;
    }
    
  //dependencias de generarPalabras

  private listarCoincidencias(t, p, datos) {//busca todas las posiciones y lista coincidencias en un array

    let coincidenciaList = Array<Array<coincidencia>>();
    let posicion1;
    let posicion2;

    if (p.orientacion == 0) {
      posicion1 = t.filas;
      posicion2 = t.columnas - p.palabra.length + 1;
    }
    if (p.orientacion == 1) {
      posicion1 = t.filas - p.palabra.length + 1;
      posicion2 = t.columnas;
    }
    for (var y = 1; y < posicion1; y++) { // estoy en la fila
      for (var x = 1; x < posicion2; x++) {// estoy en la columna
        let coin = new Array<coincidencia>();
        coin = this.buscarCoincidencia(x, y, p, datos);
        if (coin.length > 0) {
          coincidenciaList.push(coin);
        }
      }
    }

    return coincidenciaList;
  }

  private buscarCoincidencia(x, y, p, datos) {//mandas ubicacion y te busca las coincidencias con la palabra

    let resultado = new Array<coincidencia>();
    let contador = 0;
    let fallo = false;

    if (p.orientacion == 0) {
      for (var xcoin = x; xcoin < x + p.palabra.length; xcoin++) {
        if (datos[y][xcoin].valor === p.palabra[contador] && datos[y][xcoin].orientacion != p.orientacion) {
          resultado.push(this.crearCoincidencia(xcoin, x, y, p, contador));
        } else if (datos[y][xcoin].valor === p.palabra[contador] && datos[y][xcoin].orientacion == p.orientacion) {
          fallo = true;
        } else if (datos[y][xcoin].valor != p.palabra[contador] && datos[y][xcoin].valor != null) {
          fallo = true;
        }
        contador = contador + 1;
      }
    }

    if (p.orientacion == 1) {
      for (var ycoin = y; ycoin < y + p.palabra.length; ycoin++) {
        if (datos[ycoin][x].valor === p.palabra[contador] && datos[ycoin][x].orientacion != p.orientacion) {
          resultado.push(this.crearCoincidencia(ycoin, x, y, p, contador));
        } else if (datos[ycoin][x].valor === p.palabra[contador] && datos[ycoin][x].orientacion == p.orientacion) {
          fallo = true;
        } else if (datos[ycoin][x].valor != p.palabra[contador] && datos[ycoin][x].valor != null) {
          fallo = true;
        }
        contador = contador + 1;
      }
    }
    if (!fallo) {
      return resultado;
    } else {
      resultado = new Array<coincidencia>();
      return resultado;
    }
  }

  private crearCoincidencia(pcoin, x, y, p, contador) {//crea coincidencia para añadirla al array de la posicion
    let coin = new coincidencia;
    if (p.orientacion == 0) {
      coin.posX = pcoin;
      coin.posY = y;
    }
    if (p.orientacion == 1) {
      coin.posX = x;
      coin.posY = pcoin;
    }
    coin.valor = p.palabra[contador];
    coin.posXcheck = x;
    coin.posYcheck = y;
    return coin;
  }

  //######################################### ISLAS

  private generarIslas(contador, palabros, t, datos, lista) {

    let p = new palabra;
    let nPalabra = Math.round(Math.random() * (palabros.length - 1));
    p.palabra = palabros[nPalabra].palabra.toUpperCase();
    p.orientacion = Math.round(Math.random());
    p.vista = true;

    let limit;
    let encontrado = false;
    let trying = 0;
    if (t.columnas >= t.filas) limit = Math.ceil(t.columnas/2);
    if (t.filas >= t.columnas) limit = Math.ceil(t.filas/2);
    while (!encontrado && trying <= limit) {//limite por palabra generada

      if (p.orientacion == 0) {
        p.posX = Math.round(Math.random() * ((t.columnas - 1) - p.palabra.length) + 1);
        //p.posY = Math.round(Math.random() * (t.filas - 1));
        p.posY = Math.round(Math.random() * (t.filas - 2) + 1);  //generar islas mas interior para que pueda crearse coincidencias
      }
      if (p.orientacion == 1) {
        //p.posX = Math.round(Math.random() * (t.columnas - 1));
        p.posX = Math.round(Math.random() * (t.columnas - 2) + 1); //generar islas mas interior para que pueda crearse coincidencias
        p.posY = Math.round(Math.random() * ((t.filas - 1) - p.palabra.length) + 1);
      }

      encontrado = this.buscarEspacio(null, p, t, datos);

      if (encontrado) {
        this.colocarPalabra(p, t, datos, contador);
        palabros.splice(nPalabra, 1);//borrar de la lista
        p.numero = contador;
        lista.push(p);
        trying = 0;
      }//añadir descuento si fail
      trying++;
    }
    return encontrado;
  }

  //dependencias de generarIslas

  private checkIslas(t, datos, p) {
    let orden = true;
    this.modificarUso(p, datos, null);
    if (!this.buscarEspacio(null, p, t, datos)) {
      this.modificarUso(p, datos, !orden);
    } else {
      this.modificarUso(p, datos, orden);
    }
  }


  private modificarUso(p, datos, orden) {
    let posX;
    let posY;
    for (var i = -1; i < p.palabra.length; i++) {
      if (p.orientacion == 0) {
        posX = p.posX + i;
        posY = p.posY;
      }
      if (p.orientacion == 1) {
        posX = p.posX;
        posY = p.posY + i;
      }
      if (orden == null) {
        datos[posY][posX].uso = false;
        datos[posY][posX].vista = false;
      }
      if (orden == true) {
        datos[posY][posX].uso = true;
        datos[posY][posX].vista = false;
      }
      if (orden == false) {
        datos[posY][posX].uso = true;
        datos[posY][posX].vista = true;
      }
    }
  }

  private buscarEspacio(coin, p, t, datos) { //entras posicion y busca si la palabra cabe

    let ok = true;
    let x;
    let y;
    let xlimite0 = 1;
    let xlimite1 = 1;
    let ylimite0 = 1;
    let ylimite1 = 1;

    if (!coin) {
      x = p.posX;
      y = p.posY;
    } else {
      x = coin[0].posXcheck;
      y = coin[0].posYcheck;
    }

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

        if (coin) {//si existe coincidencia array, executa la comprobación
          for (var i = 0; i < coin.length; i++) {//comprobar si es coincidencia
            if (xpalabra == coin[i].posX) {
              seguir = false;
            }
          }
        }
        if (seguir) {
          for (var ycheck = y - ylimite0; ycheck <= y + ylimite1; ycheck++) {//comprobar espacio en columnas de 3

            if (xpalabra == x - 1) {
              if (ycheck == y) {
                if (datos[ycheck][xpalabra].uso) {//modifica
                  ok = false;
                }
              }
            } else if (xpalabra == x + p.palabra.length) {
              if (ycheck == y) {
                if (datos[ycheck][xpalabra].uso && datos[ycheck][xpalabra].valor != null) {//modificado
                  ok = false;
                }
              }
            }
            if (xpalabra != x - 1 && xpalabra != x + p.palabra.length) {
              if (datos[ycheck][xpalabra].uso && datos[ycheck][xpalabra].valor != null) {//modificado
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
        if (coin) {//si existe coincidencia array, executa la comprobación
          for (var i = 0; i < coin.length; i++) {//comprobar si es coincidencia
            if (ypalabra == coin[i].posY) {
              seguir = false;
            }
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
                if (datos[ypalabra][xcheck].uso && datos[ypalabra][xcheck].valor != null) {//modificado
                  ok = false;
                }
              }
            }
            if (ypalabra != y - 1 && ypalabra != y + p.palabra.length) {
              if (datos[ypalabra][xcheck].uso && datos[ypalabra][xcheck].valor != null) {//modificado
                ok = false;
              }
            }
          }
        }
      }
    }
    return ok;
  }

  //######################################### Dependencia de generarPalabras y generarIslas

  private colocarPalabra(p, t, datos, contador) {
    let posX = p.posX;
    let posY = p.posY;

    for (var i = -1; i < p.palabra.length; i++) {
      if (p.orientacion == 0) posX = p.posX + i;
      if (p.orientacion == 1) posY = p.posY + i;
      if (i == -1) {
        datos[posY][posX].vista = true;
        datos[posY][posX].valor = null
        datos[posY][posX].numero = contador;
        datos[posY][posX].background = t.colorCasillaVacia;
        datos[posY][posX].color = "white";
        datos[posY][posX].fontsize = t.fontsize / 1.4;
      } else {
        if (p.vista) datos[posY][posX].vista = true;
        if (!p.vista && datos[posY][posX].vista != true) datos[posY][posX].vista = false;
        datos[posY][posX].valor = p.palabra[i];
        datos[posY][posX].numero = null;
        datos[posY][posX].background = t.colorCasillaLetra;
        datos[posY][posX].pborde = "2px black";
        datos[posY][posX].bcolor = t.borderC;
        datos[posY][posX].border = t.border;
      }
      datos[posY][posX].uso = true;
      datos[posY][posX].palabra = p.palabra;
      datos[posY][posX].orientacion = p.orientacion;
      datos[posY][posX].posIni[0] = p.posX;
      datos[posY][posX].posIni[1] = p.posY;

      if (p.orientacion == 0) {
        datos[posY][posX].posEnd[0] = p.posX;
        datos[posY][posX].posEnd[1] = p.posY + p.palabra.length - 1;
      }
      if (p.orientacion == 1) {
        datos[posY][posX].posEnd[0] = p.posX + p.palabra.length - 1;
        datos[posY][posX].posEnd[1] = p.posY;
      }
    }
  }
}
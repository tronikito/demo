export class casilla {
  posX: number;
  posY: number;
  valor: string;
  number: number;
  //style
  tamano: number;
  fontsize: number;
  borderRadius: number;
  border: number;
  background: string;
  color: string;
  //borde
  btop: number;
  bbot: number;
  bleft: number;
  bright: number;
  bcolor: string;
  pborde: string;
  //informacion palabra pertenece
  uso: boolean;
  palabra: string;
  posIni: Array<number>;
  posEnd: Array<number>;
  orientacion: number;
}

export class tablero {
  tamano: number;
  tamanox: any;
  tamanoy: number;
  columnas: number;
  filas: number;
  palabrasSopa: number;
  margen: number;
  margenLateral: number;
  colorBorde: string;
  fontsize: number;
  borderRadius: number;
  border: number;
  borderC: string;
  colorCasillaLetra: string;
  colorCasillaVacia: string;
}

export class palabra {
  posX: number;
  posY: number;
  palabra: string;
  orientacion: number;
}
export class coincidencia {
  posXcheck: number;
  posYcheck: number;
  posX: number;
  posY: number;
  valor: string;
}
export class listaP {
  palabra: string;
  numero: number;
  orientacion: number;
}
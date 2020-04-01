export class question { 
  qID: number;
  ask: string;
  answers: Array <string>;
  rcorrect: number;
  box: number;
  status: boolean;
  success: boolean;
}
export class images {
  arriba: string;
  abajo: string;
  correcto: string;
}
export class gameList { 
  qID: number;
  tittle: string;
  status: string;
  success: boolean;
  preview: string;
}
export class palabra {
  palabra: string;
}
export class listaP {
  palabra: string;
  estado: string;
}
export class letra {
  posX: number;
  posY: number;
  valor: string;
  tamano: number;
  fontsize: number;
  borderRadius: number;
  border: number;
  rcorrect: boolean;
  background: string;
  end: boolean;
  rpos: Array<number>;
  uso: boolean;
  btop: number;
  bbot: number;
  bleft: number;
  bright: number;
  bcolor: string;
  palabra: string;
  posIni: Array<number>;
  posEnd: Array<number>;
  orientacion: number;
}

export class sopaForm {
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
}
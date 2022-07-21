import { query } from '@angular/animations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private _historial: string[] = [];
  private apiKey: string = 'SjTlOHpOQORjc0VlrFG9MArT6aAkI5Lv';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  // Todo: cambiar any por su tipo
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

    // Una alternativa
    /*if( localStorage.getItem('historial')){
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }*/
  }

  buscarGifs(query: string = '') {
    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      // Limita el numero de busquedas a 10
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));

      // Este codigo funciona casi de la misma forma tanto aqui como en otro lugar 
      // localStorage.setItem('resultados', JSON.stringify(this.resultados));
    }

    const params = new HttpParams().set('api_key', this.apiKey).set('limit', '10').set('q', query).set('lang', 'es').set('rating', 'g');

    // console.log(params.toString());

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((resp) => {
        //console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}

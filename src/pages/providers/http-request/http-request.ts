import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the HttpRequestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpRequestProvider {

  url:string='https://pokeapi.co/api/v2/'

  constructor(public http: HttpClient) {
   // console.log('Hello HttpRequestProvider Provider');
  }

  getPokemon(offset: any): Observable<any> {
    return this.http.get<any>(`${this.url+'pokemon/?limit=20&offset'}=${offset}`);
  }

  searchPokemon(pokemonNameorId: any){
    return this.http.get<any>(`${this.url+'pokemon/'}${pokemonNameorId+'/'}`);
  }
}

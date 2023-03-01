import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pokemon } from '../models/pokemon.model';
import { Data } from '../models/data.model';
import { SessionUtil } from '../utils/session.util';
const {apiPokemon}= environment;
 
@Injectable({
  providedIn: 'root'
})
export class PokemonCatalogueService {
private _pokemons: Pokemon[]= [];
private _error: string="";
private _loading: boolean =false;
get pokemons(): Pokemon[]{
  return this._pokemons;
}
get error(): string{
  return this._error;
}
get loading():boolean{
  return this._loading;
}
  constructor(private readonly http: HttpClient) { }
  /**
   * findAllPokemons
   */
  public findAllPokemons(): void {
    this._loading=true;
    this.http.get<Data>(apiPokemon)
    .pipe(
     finalize(()=>{
      this._loading=false;
     }
     )
    )
    .subscribe({
      next: (data: Data) => {
        
        this._pokemons = data.results; //passing the pokemon list
        
        SessionUtil.storageSave("pokemons", data.results); //saving the pokemon list into session storage

      },
      error: (error: HttpErrorResponse) => {
        this._error=error.message;
        

      }
    })
  }

  public pokemonsFromSession(data: Pokemon[] | undefined): void {
    this._loading=true;

    if (data !== undefined){
      this._pokemons = data;
    }

    this._loading=false;
  }

  public pokemonByName(name: string): Pokemon | undefined{
    return this.pokemons.find((pokemon: Pokemon)=> pokemon.name)
  }
}

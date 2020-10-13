import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { HttpRequestProvider } from "../providers/http-request/http-request";
import { PokemonInfo } from '../home/home';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  pokemonName: string = "";
  items : Array<any> = [];
  loading: any;

  constructor(public navCtrl: NavController,
    private requestProvider: HttpRequestProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
  
  }

  lookForPokemon(){
   if(this.pokemonName.length > 0){
     this.displayLoading();
    this.items = [];
    console.log(this.pokemonName);
    
    this.requestProvider.searchPokemon(this.pokemonName.toLowerCase()).subscribe(res =>{

    this.searchPokemon(this.pokemonName.toLowerCase());
    
    },err => {
      console.log(err);
      console.log(err.detail); 
      if(err.error.detail === "Not found."){
        this.loading.dismiss();
        this.PopMg("Not Found",this.pokemonName+" isn't a pokemon name or ID!")
      } else {
        this.PopMg("Error", "please check your network!");
        this.loading.dismiss();
      }
    });
  }else {

  }
  }

  searchPokemon(pokemon: any){
    console.log("hi, "+pokemon);

    this.requestProvider.searchPokemon(pokemon).subscribe(res =>{
      console.log(res);
      let pokeModal = this.modalCtrl.create(PokemonInfo, {
        cssClass: "modal-fullscreen",
        name: res.name, 
        sprite_f: res.sprites.front_default,
        sprite_b: res.sprites.back_default,
        sprite_fs: res.sprites.front_shiny,
        sprite_bs: res.sprites.back_shiny,
        abilities: res.abilities,
        height: res.height,
        weight: res.weight,
        stats: res.stats,
        types: res.types,
        fav: false
      });
      pokeModal.present();
      this.loading.dismiss();
    },err =>{
      console.log(err);
      this.PopMg("Error", "Please check your network!");
      this.loading.dismiss();
    
    });
 
  }

  PopMg(title: string, subtitle: string){
    
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();

  }

  displayLoading(){
    this.loading  = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }


}

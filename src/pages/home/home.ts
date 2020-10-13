import { Component } from '@angular/core';
import { HttpRequestProvider } from "../providers/http-request/http-request";
import { ModalController, NavParams, NavController, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  constructor(
    public navCtrl: NavController, 
    private requestProvider: HttpRequestProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ){}
    items = [];
    index : number = 20;
    loading: any;
    retry: boolean = false;
  
  ionViewDidLoad() {
    this.presentLoadingDefault();
    this.requestProvider.getPokemon(0).subscribe(res =>{
      console.log(res);
      this.retry = false;
      for(let i = 0; i< res.results.length; i++){
        this.items.push(res.results[i].name)
      }
      this.loading.dismiss();
      console.log(this.items);
    },err => {
      console.log(err);
      this.PopMg("Error", "Please check your network!");
      this.loading.dismiss();
      this.retry = true;
    });
  }

  doInfinite(infiniteScroll) {
    console.log("Begin async operation");

    this.requestProvider.getPokemon(this.index).subscribe(res => {
      console.log(res);
      for(let i = 0; i< res.results.length; i++){
        this.items.push(res.results[i].name)
      }
      this.index = this.index + 20
      console.log(this.index);
      infiniteScroll.complete();

    }, err =>{
      console.log(err);
      this.PopMg("Error", "Please check your network!");
      this.loading.dismiss();
    })
  }
  
  tryAgain(){
    this.ionViewDidLoad();
  }

  searchPokemon(pokemon: any){
      console.log("hi, "+pokemon);
      this.presentLoadingDefault();
      this.requestProvider.searchPokemon(pokemon).subscribe(res =>{
        console.log(res);
        let pokeModal = this.modalCtrl.create(PokemonInfo, {
          cssClass: "modal-fullscreen",
          name: pokemon, 
          sprite_f: res.sprites.front_default,
          sprite_b: res.sprites.back_default,
          sprite_fs: res.sprites.front_shiny,
          sprite_bs: res.sprites.back_shiny,
          abilities: res.abilities,
          height: res.height,
          weight: res.weight,
          stats: res.stats,
          types: res.types,
          fav: false,
        }); 
        pokeModal.present();
        this.loading.dismiss();
      },err =>{
        console.log(err);
        this.PopMg("Error", "Please check your network!");
        this.loading.dismiss();
      })
   
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
    
    
  }

  PopMg(title: string, subtitle: string){
    
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();

  }

}

@Component({
  selector: 'page-pokemonInfo',
  templateUrl: 'pokemonInfo.html'
})
 export class PokemonInfo {
   sprite_f: any;
   sprite_b: any;
   sprite_fs: any;
   sprite_bs: any;
   name: any;
   abilities: any;
   height: any;
   weight: any;
   stats: any;
   types: any;
   fav: boolean;
   

  constructor(public params: NavParams, 
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private storage: Storage
  ){
    this.sprite_f = params.get('sprite_f');
    this.sprite_b = params.get('sprite_b');
    this.sprite_fs = params.get('sprite_fs');
    this.sprite_bs = params.get('sprite_bs');
    this.name = params.get('name');
    this.height = params.get('height')/10;
    this.weight = params.get('weight')/10;
    this.stats = params.get('stats');
    this.abilities = params.get('abilities');
    this.types = params.get('types');
    this.fav = params.get('fav');
  }

  IonViewDidLoad(){
    
  }

  close(){
    this.viewCtrl.dismiss();
  }

  add(pokemon: any){
    let username;
    let poke = [];
    let name = pokemon.charAt(0).toUpperCase() + pokemon.slice(1);
    this.storage.get("user").then(val =>{
      console.log(val);
      username = val;
      if(username != null || username != undefined){
        this.storage.get(username+"pokemonList").then(val =>{
          console.log(val);
          if(val == "" || val == null){
            poke.push(pokemon);
            console.log(poke);
            this.storage.set(username+"pokemonList",poke);
            this.PopMg("Pokemon Added!", "Now "+name+" can be found in your favorites list!");
            this.viewCtrl.dismiss();
          }else {
            let search = val.find(function(elm) {
              return elm == pokemon
            });
            console.log(search);
            if(search == undefined){
              val.push(pokemon)
              console.log(poke);
              this.storage.set(username+"pokemonList",val);
              this.PopMg("Pokemon Added!", "Now "+name+" can be found in your favorites list!");
              this.viewCtrl.dismiss();
            } else {
              this.PopMg("Can't Add Pokemon", name+" is already in your favorites list!");
            }
          }
        }).catch(err =>{
          console.log("Ups,"+err);
        })
    }else {
      console.log("no username");
    }
    }).catch(err =>{
      console.log(err);
    });
    

  }

  remove(pokemon: string){
    console.log("bye," +pokemon)
    let username;
    let name = pokemon.charAt(0).toUpperCase() + pokemon.slice(1);
    let index;
    this.storage.get("user").then(val =>{
      console.log(val);
      username = val;
      if(username != null || username != undefined){
        this.storage.get(username+"pokemonList").then(val =>{
            index = val.indexOf(pokemon);
            console.log(index);
            if(index !== -1){
              val.splice(index, 1);
              console.log(val);
              this.storage.set(username+"pokemonList",val);
              this.PopMg("Pokemon Removed", name+"has been removed from your favorites list");
              this.viewCtrl.dismiss();
            }else {
              console.log("errror");
            }
          }).catch(err =>{
            console.log(err);
          })
            //this.PopMg(pokemon, true)
      }
    }).catch(err =>{
      console.log(err);
    })
  }


  PopMg(title: string, subtitle: string){
    
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();

  }
}
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { HttpRequestProvider } from "../providers/http-request/http-request";
import { Storage } from '@ionic/storage';
import { PokemonInfo } from '../home/home';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  username : any;
  items : Array<any> = [];
  index: number = 20;
  exist: boolean = true;
  poke: Object;

  constructor(public navCtrl: NavController,
    private requestProvider: HttpRequestProvider,
    public modalCtrl: ModalController,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  
  ){
    this.items = [];
  }
  ionViewDidLoad() {
    this.items = [];
    //this.requestProvider.getPokemon(0).subscribe(res =>{
      /*if(this.items.length > -1){
        this.exist = true;
      }else {
        this.exist = false;
      }*/
    //})
  }

  ionViewDidEnter() {

    this.storage.get("user").then(val =>{
      this.username = val;
      console.log(this.username);
      this.storage.get(this.username+"pokemonList").then(val =>{
        console.log(val);
        if(val == null){

        this.exist = false;
        
      }else{
        this.items = val;
        console.log(this.items);
        if(this.items.length == 0){
          this.exist = false;
        } else{ 
          this.exist = true;
        }

      }
      });
    });

    
      
  
  }

  refresh(){
    this.storage.get(this.username+"pokemonList").then(val =>{
      console.log(val);
      this.items = val;
      console.log(this.items);
      if(this.items.length == 0){
        this.exist = false;
      }else {
        this.exist = true;
      }
    });
  }

  

  doInfinite(infiniteScroll) {
    /*console.log("Begin async operation");

    this.requestProvider.getPokemon(this.index).subscribe(res => {
      console.log(res);
      for(let i = 0; i< res.results.length; i++){
        this.items.push(res.results[i].name)
      }
      this.index =+20
      infiniteScroll.complete();

    })*/
  }

  searchPokemon(pokemon: any){
    console.log("hi, "+pokemon);
   let loading  = this.loadingCtrl.create({
    content: 'Please wait...'
  });
  loading.present();
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
        fav: true
      });
      pokeModal.onDidDismiss(() => this.refresh());
      pokeModal.present();
      loading.dismiss();
    },err =>{
      console.log(err);
      this.PopMg("Error", "Please check your network!");
      loading.dismiss();
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


}

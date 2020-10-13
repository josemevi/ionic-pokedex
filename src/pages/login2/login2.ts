import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-login2',
  templateUrl: 'login2.html',
})
export class Login2Page {
  username: string;
  password: string;
  Cusername: string;
  Cpassword: string;
  register: boolean = false;
  pass: boolean = false;
  user: boolean = false;
  Cuser: boolean = false;
  fields: boolean = false;
  success: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login2Page');
  }

  login(){
    let validation = (this.username != undefined && this.username !=  "") && 
    (this.password != undefined && this.password != "");
    if(validation){
      this.storage.get(this.username).then(val => {
        console.log(val);
        if(val == this.username){
          this.storage.get(this.username+"pass").then(val => {
            if(val == this.password){
              this.presentLoadingDefault();
              this.storage.set("user",this.username);
              setTimeout(()=> {
                this.navCtrl.setRoot(TabsPage);
              },2000)
              
            }else {
              this.pass = true;
            }
          }).catch(err =>{
            console.log(err);
          })
        }else {
          this.user = true;
        }
      }).catch(err =>{
        console.log(err);
      })
    }else {
      this.fields = true;
    }
  }

    create(){
      console.log(this.Cusername);
      console.log(this.Cpassword);
      let validation = (this.Cusername != undefined && this.Cusername !=  "") && 
      (this.Cpassword != undefined && this.Cpassword != "");
      if(validation){
        this.storage.get(this.Cusername).then(val => {
          if(val != this.Cusername){
            
              this.storage.set(this.Cusername, this.Cusername);
              this.storage.set(this.Cusername+"pass", this.Cpassword);
              this.success = true;
              this.register = false;
          
          }else {
            this.Cuser = true;
          }
        }).catch(err =>{
          console.log(err);
        })
      }else{
        this.fields = true;
      }   
  }

  registrar(){
    this.register = true;
    this.clear();
  }

  clear(){
    this.success = false;
    this.fields = false;
    this.pass = false;
    this.user = false;
    this.Cuser = false;
    /*this.storage.clear().then(val =>{
      console.log(val);
    }).catch(err =>{
      console.log(err);
    })*/
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 1000);
  }

}

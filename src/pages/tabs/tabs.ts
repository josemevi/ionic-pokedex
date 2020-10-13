import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { Login2Page } from '../login2/login2';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'tabs.html',
  selector: 'page-tabs' })



export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor(public navCtrl: NavController, public storage: Storage, public alertCtrl: AlertController) {

  }

  logout(){
    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Do you want logout now?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          role: 'cancel',
          handler: () => {
            this.storage.remove("user");
            this.navCtrl.setRoot(Login2Page);
          }
        }
      ]
    });
    alert.present();
  }
}

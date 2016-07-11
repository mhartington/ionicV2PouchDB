import {Component, NgZone} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {PouchDb} from '../../providers/pouch-db/pouch-db'
import {NewItemPage} from '../new-item/new-item';
@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  public items = [];
  constructor(
    private navController: NavController,
    private platform: Platform,
    private zone: NgZone,
    private db: PouchDb
  ) {

  }

  ionViewLoaded() {
    this.platform.ready().then(() => {
      this.db.initDB();
      this.db.getAll()
        .then(data => {
          this.zone.run(() => {
            console.log(data)
            this.items = data;
          });
        })
        .catch(console.error.bind(console));
    });
  }

  addItem(){
    this.navController.push(NewItemPage)
  }
}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {PouchDb} from '../../providers/pouch-db/pouch-db'
import {
  FORM_DIRECTIVES,
  FormBuilder,
  Validators
} from '@angular/common';

@Component({
  templateUrl: 'build/pages/new-item/new-item.html',
})
export class NewItemPage {
  private form = this.fb.group({
    'title': ['', Validators.required],
  })

  constructor(
    private nav: NavController,
    private fb: FormBuilder,
    private db: PouchDb
  ) { }

  saveItem() {
    console.log(this.form.value)
    this.db.saveData(this.form.value);
    this.nav.pop();
  }

}

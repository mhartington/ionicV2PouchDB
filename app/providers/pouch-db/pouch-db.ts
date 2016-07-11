import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as pouch from 'pouchdb';

@Injectable()
export class PouchDb {
  public db = null;
  public items;
  constructor() { }

  initDB() {
    this.db = new pouch('myTestDB', {})
  }

  getAll() {
    if (!this.items) {
      return this.db.allDocs({ include_docs: true })
        .then(docs => {

          // Each row has a .doc object and we just want to send an
          // array of birthday objects back to the calling controller,
          // so let's map the array to contain just the .doc objects.

          this.items = docs.rows.map(row => {
            // Dates are not automatically converted from a string.
            row.doc.Date = new Date(row.doc.Date);
            return row.doc;
          });

          // Listen for changes on the database.
          this.db.changes({ live: true, since: 'now', include_docs: true })
            .on('change', (change) => { this.onDatabaseChange(change) });
          return this.items;
        });
    } else {
      // Return cached data as a promise
      return Promise.resolve(this.items);
    }
  }

  onDatabaseChange(change) {
    console.log(this)
    let index = this.findIndex(this.items, change.id);
    let item = this.items[index];

    if (change.deleted) {
      if (item) {
        this.items.splice(index, 1); // delete
      }
    } else {
      if (item && item._id === change.id) {
        this.items[index] = change.doc; // update
      } else {
        this.items.splice(index, 0, change.doc) // insert
      }
    }
  }

  findIndex(array, id) {
    var low = 0,
      high = array.length,
      mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
  }


  saveData(data) {
    this.db.post(data)
  }

}

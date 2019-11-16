"use strict";

import DatabaseConnector from '../database/DatabaseConnector';
import "./add-new-entry.css";

class AddNewEntry {

    constructor(app){
        this.app = app;
        this.db = new DatabaseConnector();
    }

    async onShow() {
        let form = await this._importNewEntryForm();
        let data = this._loadData();


        form.querySelector('.save').addEventListener('click', () => {
            var newObj = {
              Name: document.getElementById('rezeptname').value,
              Ingredients: document.getElementById('zutaten').value,
              Instructions: document.getElementById('beschreibung').value,
              Like: false
            };
            const ref = firebase.storage().ref('images/');
            const file = $('#bild').get(0).files[0];
            const name = file.name;
            const metadata = { contentType: file.type };
            const task = ref.child(name).put(file, metadata);
task
  .then(snapshot => snapshot.ref.getDownloadURL())
  .then((url) => {
    console.log(url);
    document.querySelector('#someImageTagID').src = url;
  })

            data.push(newObj);
			var newPostRef = firebase.database().ref('Daten/').push();
			newPostRef.set(newObj);
            console.log(data);
            this.db.write(this.db.defaultKey(), data);
            this.app._router.navigate('overview');
        });

        return this._createContentObject(form);
    }


    async _importNewEntryForm() {
        const template = await import('./add-new-entry.html');
        let container = document.createElement('div');
        container.innerHTML = template.trim();
        return container;
    }

    _loadData(){
      return this.db.read(this.db.defaultKey());
  }

    _createContentObject(html) {
      let content = {
          className: "overview",
          main: html.querySelectorAll('section > *')
      };
      return content;
  }

    get title() {
        return "Neuer Eintrag";
    }
    _saveAndExit() {
      // Datensatz speichern
      this._dataset.rezeptname = $$REZEPTNAME$$;
      this._dataset.zutaten = $$ZUTATEN$$;
      this._dataset.beschreibung = $$BESCHREIBUNG$$;

      if (this._editIndex > -1) {
          this._app.updateDataByIndex(this._editIndex, this._dataset);
      } else {
          this._app.appendData(this._dataset);
      }

      // Zurück zur Übersicht
      this._app.showPage("overview");
  }
}
export default AddNewEntry;

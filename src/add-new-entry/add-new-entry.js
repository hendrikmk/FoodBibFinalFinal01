"use strict";

import "./add-new-entry.css";

class AddNewEntry {

    constructor(app){
        this.app = app;
    }

    async onShow() {
        let form = await this._importNewEntryForm();


        form.querySelector('.save').addEventListener('click', () => {

            //Jetzt wird das Bild gespeichert ausm Input, und der Storage wird initialisiert
            const ref = firebase.storage().ref('images/');
            const file = $('#bild').get(0).files[0];
            const name = this._uuidv4();
            const metadata = { contentType: file.type };
            const task = ref.child(name).put(file, metadata);
            //Jetzt wirds auf Firebase Storage geupdatet
task
  .then(snapshot => snapshot.ref.getDownloadURL())
  .then((url) => {
    console.log(url);
    this.fileURL = url;
    document.querySelector('#someImageTagID').src = url;
  })
  //Jetzt werden die Daten auf Firebase Database gespeichert
  var newObj = {
    Name: document.getElementById('rezeptname').value,
    Ingredients: document.getElementById('zutaten').value,
    Instructions: document.getElementById('beschreibung').value,
    Like: "false",
    ImageURL: this.fileURL,
    ImageID: name
  };
  var newPostRef = firebase.database().ref('Daten/').push();
  newPostRef.set(newObj);
            // console.log(data);
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


    _createContentObject(html) {
      let content = {
          className: "overview",
          main: html.querySelectorAll('section > *')
      };
      return content;
  }
  _uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )}

    get title() {
        return "Neuer Eintrag";
    }
}
export default AddNewEntry;

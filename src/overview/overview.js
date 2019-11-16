"use strict";

import "./overview.css";
import DatabaseConnector from '../database/DatabaseConnector';

class Overview {

    constructor(app){
        this.app = app;
        this.db = new DatabaseConnector();
        this.db.initMyDatabase();
    }

    async onShow() {
        let adressTemplate = await this._importAdressTemplate();
        let data = this._loadData();
        let htmlToRender = this._processData(data, adressTemplate);
        return this._createContentObject(htmlToRender);
    }

    _processData(data, template){
        let container = document.createElement('div');

        // im folgenden Abschnitt werden die Daten aus der firebase
        // in die overview-seite geschrieben. klappt nur noch nicht so ganz
        // (aber der foreach teil scheint zu funktionieren, zumindest haben wir
        // genauso viele Einträge auf der Website wie in der firebase)
        var database = firebase.database().ref('Daten/');
        database.on('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            let div = template.querySelector('.rezept-template').cloneNode(true);
            var childData = childSnapshot.val();
            div.innerHTML = div.innerHTML.replace('$$REZEPTNAME$$', childData.rezeptname);
            div.innerHTML = div.innerHTML.replace('$$ZUTATEN$$', childData.zutaten);
            div.innerHTML = div.innerHTML.replace('$$BESCHREIBUNG$$', childData.beschreibung);
            console.log(childData);
            container.appendChild(div);
          });
        });

// hier der alte shit, funktioniert wenigstens. nur halt ohne premium-firebase
        // data.forEach((obj) => {
        //     let div = template.querySelector('.rezept-template').cloneNode(true);
        //     div.innerHTML = div.innerHTML.replace('$$REZEPTNAME$$', obj.rezeptname);
        //     div.innerHTML = div.innerHTML.replace('$$ZUTATEN$$', obj.zutaten);
        //     div.innerHTML = div.innerHTML.replace('$$BESCHREIBUNG$$', obj.beschreibung);
        //     container.appendChild(div);
        // })

        return container;
    }


    async _importAdressTemplate() {
        const template = await import('./rezept-template.html');
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
            main: html.querySelectorAll('div > *')
        };
        return content;
    }

    get title() {
        return "Übersicht";
    }


}

export default Overview;

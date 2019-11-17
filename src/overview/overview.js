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
// in die overview-seite geschrieben. irgendwie muss man aber erst einmal auf
// die seite klicken, damit das ding auch geladen wird. das alte zeug (unten)
// war immer direkt da
        var database = firebase.database().ref('Daten/');
        database.on('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            let div = template.querySelector('.rezept-template').cloneNode(true);
            var childData = childSnapshot.val();
            let dieid = childSnapshot.key;  //key des datensatzes zum button registrieren
        console.log(dieid);
            var datavonbestimmtem = firebase.database().ref('Daten/'+ dieid);  //datenbank referenz zum datensatz
            div.innerHTML = div.innerHTML.replace('$$REZEPTNAME$$', childData.Name);
            div.innerHTML = div.innerHTML.replace('$$ZUTATEN$$', childData.Ingredients);
            div.innerHTML = div.innerHTML.replace('$$BESCHREIBUNG$$', childData.Instructions);
      //      div.innerHTML = div.innerHTML.replace('myImg', childData.ImageURL);
            var img = document.createElement('img');  //img wird erzeugt mit imageURL, danach angehängt an div
                  img.src =  childData.ImageURL;
                  img.style.height = '200px';
                  img.style.width = '200px';
                  div.appendChild(img);

                  var butten = document.createElement("input"); // button wird registriert
      butten.type = "button";
      butten.value = "Like";
      butten.name = "Likee";
      butten.onclick = function() { // Note this is a function
        if (childData.Like == false){
                  datavonbestimmtem.update({ Like: "true" });
                  butten.value = "Unlike";
                  console.log("geliket");
        } else {
          datavonbestimmtem.update({ Like: "false" });
          butten.value = "Like";
          console.log("unliked");
        }

      };
      div.appendChild(butten)
            console.log(childData); //gibt in der console vollständig alle geladenen Datensätze aus
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

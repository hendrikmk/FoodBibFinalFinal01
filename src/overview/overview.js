"use strict";

import "./overview.css";

class Overview {

    constructor(app){
        this.app = app;
    }

    async onShow() {
        let adressTemplate = await this._importAdressTemplate();
        let htmlToRender = this._processData(adressTemplate);
        return this._createContentObject(htmlToRender);
    }

    _processData(template){
        let container = document.createElement('div');

// im folgenden Abschnitt werden die Daten aus der firebase
// in die overview-seite geschrieben. irgendwie muss man aber erst einmal auf
// die seite klicken, damit das ding auch geladen wird.

        var database = firebase.database().ref('Daten/');
        database.on('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            let div = template.querySelector('.rezept-template').cloneNode(true);
            var childData = childSnapshot.val();
            let dieid = childSnapshot.key;  //key des datensatzes zum button registrieren
        // console.log(dieid);
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

                  let hilfslike = childData.Like;
                  var butten = document.createElement("input"); // button wird registriert
      butten.type = "button";
      if (hilfslike == "true"){
        butten.value = "Unlike";
      } else {
        butten.value = "Like";
      }
      butten.name = "Likee";
      butten.onclick = function() { // Note this is a function
        if (hilfslike == "false"){
                  datavonbestimmtem.update({ Like: "true" });
                  butten.value = "Unlike";
                  hilfslike = "true";
                  console.log("geliket");
        } else if (hilfslike =="true"){
          datavonbestimmtem.update({ Like: "false" });
          butten.value = "Like";
          hilfslike = "false";
          console.log("unliked");
        }
      };
      div.appendChild(butten);
    var buttenloeschen = document.createElement("input"); // button wird registriert
    buttenloeschen.type = "button";
      buttenloeschen.value = "Delete";
      buttenloeschen.name = "loschen";
      buttenloeschen.onclick = function(){
  //      datavonbestimmtem.remove();
  //      buttenloeschen.style.visibility = 'hidden';
        location.reload();
        // Create a reference to the file to delete
        var desertRef = firebase.storage().ref.child('images/').child(childData.ImageID);

        // Delete the file
        desertRef.delete().then(function() {
          // File deleted successfully
          alert("ey jo!");
        }).catch(function(error) {
          // Uh-oh, an error occurred!
        });
      }
        div.appendChild(buttenloeschen);
            // console.log(childData); //gibt in der console vollständig alle geladenen Datensätze aus
            container.appendChild(div);
          });
        });

        return container;
    }


    async _importAdressTemplate() {
        const template = await import('./rezept-template.html');
        let container = document.createElement('div');
        container.innerHTML = template.trim();
        return container;
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

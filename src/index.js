"use strict";

import "babel-core/register";
import "babel-polyfill";
import App from "./app.js";
import "./index.css";
import DatabaseConnector from './database/DatabaseConnector';


// Erst loslaufen, wenn das Document Object Modul bereit ist
window.addEventListener("load", () => {
    // Anwendung starten
    let app = new App();
    
    let db = new DatabaseConnector();
    if(!db.isDataObjectAlreadyPersisted()){
        db.initMyDatabase();
    }
    
    app.start();
});

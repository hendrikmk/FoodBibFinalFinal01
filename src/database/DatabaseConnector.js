
class DatabaseConnector {

  constructor(){

  }

  defaultKey(){
    return "myData";
  }

  write(key, json) {
    window.localStorage.setItem(key, JSON.stringify(json));
  }

  read(key){
    return JSON.parse(window.localStorage.getItem(key));
  }

    initMyDatabase(){
    let data = [
      {
        'id': 0,
        'rezeptname': 'Pfannkuchen',
        'zutaten': '500g Mehl, 3 Eier, Salz',
        'beschreibung': 'Alles Mischen und Ausbacken'
      },
      {
        'id': 1,
        'rezeptname': 'Fleischküchle',
        'zutaten': 'Hackfleisch, Ei, Semmelbrösel',
        'beschreibung': 'Alles mischen und in einer Pfanne gut durchbraten'
      },
      {
        'id': 2,
        'rezeptname': 'Pfannkuchen',
        'zutaten': 'Mehl, Eier',
        'beschreibung': 'Alles Mischen und Ausbacken'
      }
    ];

    const key = this.defaultKey();
    window.localStorage.setItem(key, JSON.stringify(data));
  }

  isDataObjectAlreadyPersisted(){
    return window.localStorage.getItem(this.defaultKey) != 'undefined';
  }
}

export default DatabaseConnector;

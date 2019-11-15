# test-project

## Funktionierender Stand
Die Anwendung Funktioniert nun ohne das neu-laden mit `Strg+F5`. Außerdem habe ich ein Beispiel zur Verwendung des LocalStorage eingebaut. Bitte schaut euch die änderungen in der Anwendung genau an.

### Babel

Babel ist ein Übersetzter, der neueren JavaScript Code so übersetzt, dass ihn alle browser lesen können.
Um Asyncrone Funktionen programmieren zu können müssen wir babel wie folgt konfigurieren.

#### Installation von Babel

* Babel ist bereits als abhängigkeit in `Parcel` beinhaltet. Um unsere anwendung korrekt konfigurieren zu können, mussen wir folgenden Befehl ausführen um weitere zusätzliche Abhängikeiten von babel hinzuzufügen.
  
`npm i -D babel-core babel-polyfill babel-preset-es2015 babel-preset-stage-0 babel-loader`

#### Konfiguration von Babel

* Babel wird konfiguriert indem wir eine `.babelrc`-Datei anlegen mit folgendem inhalt:

```json
{
  "presets": [ "latest" ]
}
```

#### Anpassungen in der index.js
* folgende importe müssen in der Datei `index.js` hinzugefügt werden.

`import "babel-core/register;`
`import "babel-polyfill";`

Nun sind wir in der Lage asyncrone funktionen zu programmieren.


### Navigo

#### initialisierung in der app.js
Die initialisierung des `Navigo` objekts wird nun wir folgt durchgeführt:

`this._router = new Navigo('http://localhost:1234/', false);`

Hier wird noch die Basis-Url mitgegeben. Dies ist nicht unbedingt notwändig, jeodch wird es empfohlen dies zu tun. Ich bitte euch, dies in eurer anwendung genau so abzuändern. Der zweite Parameter `false` sagt aus, ob der router eine `#` in die url schreiben soll, oder nicht. In diesem Fall wird nun keine `#` benutzt.

#### routen in der index.html
In der `index.html` gab es veränderungen an den Links in der Navigationsleiste.

`<a class="navbar-brand" href="/start/" data-navigo>HOME</a>`

Hier ist wichtig, dass nun keine `#` im `href`-Attribut steht. Zudem ist das `data-navigo`-Attribut dazu gekommen, welches bewirkt, dass diese route korrekt von Navigo-Router erfasst wird.

#### seitenwechsel in der app.js
Nachdem die seite gewechselt wurde, muss die funktion `this._router.updatePageLinks();` aufgerufen werden, um dem Router alle neuen Page-Links bekannt zu machen. Dieser Aufruf passiert in der mehtode `_switchVisibleContent()` in zeile 91.

#### Seitenwechsel aus dem JavaScript heraus anstoßen.

Wenn ihr mit hilfe eines Buttons die Seite wechseln wollt, müsst ihr die Funktion `_router.navigate('overview');` verwenden. Beispiele dazu findet ihr in den Dateien `src/start/start.js` und `src/add-new-entry/add-new-entry.js`

### Asyncrones laden der Inhalte

#### Module
In den einzelnen Modulen wurde die Funktion `onShow()` mit dem Keyword `async` versehen. dies ermöglicht eine asyncrone ausführung. Somit werden die inhalte nebenläufig geladen und erst dann angezeigt wenn alle Daten richtig aufbereitet wurden.

#### app.js

in der App.js hat sich der code der Methode `_switchVisibleView()` wie folgt geändert: 

```JavaScript
async _switchVisibleView(view) {
  // Alles klar, aktuelle View nun wechseln
  document.title = `${this._title} – ${view.title}`;

  this._currentView = view;
  console.log()
  var content =  await view.onShow();
  this._switchVisibleContent(content);
  return true;
}
```

Diese Mehtode wird ebenfalls asyncron ausgeführt. Somit wird der inhalt erst dann ausgetaust wenn alles richtig gerendert wurde. In dieser Mehtode ist folgender Code-Teil entscheident. 

`await view.onShow();`

Wie oben beschrieben ist die `onShow()` Methode ebenfalls asyncron. Dies ermöglicht uns die verwendung von `await`. Dieses Keyword sagt uns, dass wir so lange an dieser stelle des codes warten, bis wir ein ergebnis von der Mehtode `onShow()` zurück bekommen. erst dann machen wir weiter mit dem eigendlichen austauschen der Inhalte auf der `index.html`-Page.

### Grund für diese Lösung.

Mit dieser Lösung wird vermieden, dass man die seite mit `Strg+F5` aktualiseren muss um einen inhalt angeziegt zu bekommen. da wir so lange wie nötig warten. Dies beeinträchtigt die Performance der Anwendung nicht, da das Laden im Hintergrund ausgeführt wird.


## Verwendung vom LocalStorage.

Da mehrere Fragen bezüglich der verwendung des LocalStorage aufgekommen sind, habe ich in der Datei `src/database/DatabaseConnector.js` mal ein Beispiel gemacht, wie man den LocalStorage verwenden muss um in ihm ein JSON-Objekt zu speichern.

Ich habe zudem die anwendung so programmiert, dass in der datei `overview.js` daten geladen und in ein HTML-Template mit diesen daten befüllt wird.
In der datei `add-new-entry.js` werden die Daten in den LocalStorage gescrieben.

## Importe von HTML-Dateien
der statische import über `import html from './yourPath/yourHtml.html'` kann zu Fehlern führen. anstatt dess sollte `const html = await import('./yourPath/yourHtml.html')` aufgerufen werden. So wird das HTML erst zu der Laufzeit geladen und es können fehler in der Anwndung vermieden werden.

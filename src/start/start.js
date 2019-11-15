"use strict";

class StartPage {

    constructor(app){
        this.app = app;
    }

    async onShow() {
        let startPage = await this._importStartPageHtml();

        startPage.querySelector('.load-adresses').addEventListener('click', () => {
            this.app._router.navigate('overview');
        });
        startPage.querySelector('.add-new').addEventListener('click', () => {
            this.app._router.navigate('new');
        });

        return this._createContentObject(startPage);
    }

    async _importStartPageHtml() {
        const template = await import('./start.html');
        let container = document.createElement('div');
        container.innerHTML = template.trim();
        return container;
    }

    _createContentObject(html) {
      let content = {
          className: "start",
          main: html.querySelectorAll('div > *')
      };
      return content;
  }

    get title() {
        return "Startseite";
    }



}

export default StartPage;

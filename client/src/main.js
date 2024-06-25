//import { defineCustomElements as defineIonPhaser } from '@ion-phaser/core/loader';
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"

// Import Bootstrap and BootstrapVue CSS files (order is important)
//import 'bootstrap/dist/css/bootstrap.min.css'
// Import all of Bootstrap's JS
//import * as bootstrap from 'bootstrap'

const pinia = createPinia()
//Vue.config.productionTip = false
//App.config.ignoredElements = [/ion-\w*/];
 let wrapper = window.document.querySelector('#module-name-game')
 if (wrapper) {
  let app = window.document.createElement('div');
  app.setAttribute('id', 'client');
  app.setAttribute("class", "client");
  wrapper.insertBefore(app, wrapper.childNodes[0])
}

console.log('***************************Main ********************************');


//defineIonPhaser(window);
createApp(App).use(pinia).mount('#client');

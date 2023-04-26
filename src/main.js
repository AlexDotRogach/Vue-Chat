import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router/router.js";
import firebase from "./firebase/firebase.js";
// Toast
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// UI
import componentsUI from "./UI";

const vuetify = createVuetify({
  components,
  directives,
});

const pinia = createPinia();

const app = createApp(App);

componentsUI.forEach((componentUI) =>
  app.component(componentUI.name, componentUI)
);

const modules = [firebase.firebase, pinia, vuetify, router, ToastPlugin];

modules.forEach((module) => app.use(module));

app.mount("#app");

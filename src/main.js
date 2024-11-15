import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Router } from './router';

import './style.css';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia).use(Router).mount('#app');

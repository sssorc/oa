import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import App from './App.vue';
import router from './router';
import store from './store';
import VueGtag from 'vue-gtag';
import '@/assets/css/main.scss';
import './assets/css/style.css';

const app = createApp(App);
const head = createHead();

app.use(router);
app.use(store);
app.use(head);
app.use(VueGtag, {
    config: { id: 'G-LPV4BWE4E7' },
});

app.mount('#app');

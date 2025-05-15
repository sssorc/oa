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
    config: {
        id: 'G-LPV4BWE4E7', // Replace with your new GA4 measurement ID
        params: {
            send_page_view: true,
            anonymize_ip: true,
        },
    },
    appName: 'HedgeCalc',
    pageTrackerScreenviewEnabled: true,
});

app.mount('#app');

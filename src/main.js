import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import App from './App.vue';
import router from './router';
import store from './store';
import VueGtag from 'vue-gtag-next';
import '@/assets/css/main.scss';
import './assets/css/style.css';

const app = createApp(App);
const head = createHead();

app.use(router);
app.use(store);
app.use(head);

// Initialize Google Analytics
app.use(
    VueGtag,
    {
        property: {
            id: 'G-LPV4BWE4E7',
        },
        config: {
            send_page_view: true,
            anonymize_ip: true,
            debug_mode: true, // Enable debug mode temporarily
        },
    },
    router
); // Pass router instance for automatic page tracking

app.mount('#app');

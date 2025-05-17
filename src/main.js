import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import App from './App.vue';
import router from './router';
import store from './store';
import { configure } from 'vue-gtag';
import './assets/css/main.css';

// Initialize theme
const theme = localStorage.theme || 'system';
if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

const app = createApp(App);
const head = createHead();

app.use(router);
app.use(store);
app.use(head);

// Initialize Google Analytics only in production
if (import.meta.env.PROD) {
    configure({
        tagId: 'G-LPV4BWE4E7',
    });
}

app.mount('#app');

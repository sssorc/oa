import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import { routes } from './router';
import { trackPageView } from '@/utils/analytics';
import { configure } from 'vue-gtag';
// Self-hosted fonts. The variable fonts list every subset by unicode-range, so browsers only download Latin
import '@fontsource-variable/google-sans-flex/wght.css';
import '@fontsource-variable/google-sans-code/wght.css';
import '@fontsource-variable/google-sans-code/wght-italic.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import './assets/css/main.css';

export const createApp = ViteSSG(App, { routes }, ({ router, isClient }) => {
    if (!isClient) return;

    // Initialize Google Analytics only in production
    if (import.meta.env.PROD) {
        configure({
            tagId: 'G-LPV4BWE4E7',
        });
    }

    // Track page views on route changes
    router.afterEach((to) => {
        trackPageView(to.fullPath);
    });
});

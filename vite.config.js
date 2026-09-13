import { fileURLToPath, URL } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

const siteUrl = 'https://hedgecalc.com';
const sportsbooks = JSON.parse(readFileSync(new URL('./src/data/sportsbooks.json', import.meta.url), 'utf-8'));

// Legacy short paths; served as 301s by public/_redirects instead of being prerendered
const redirectPaths = ['/arbitrage', '/arb', '/hedge', '/bonus-bet', '/free-bet', '/free-bet-calculator', '/risk-free', '/devig'];

let renderedPaths = [];

// Only state pages carry a real last-modified date; a build date on every URL would be ignored by search engines
const stateUpdatedAt = Object.fromEntries(Object.entries(sportsbooks).map(([key, data]) => [`/sportsbooks/${key.replace(/_/g, '-')}`, data.updatedAt]));

function writeSitemap() {
    const urls = renderedPaths
        .filter((path) => path !== '/404')
        .map((path) => {
            const lastmod = stateUpdatedAt[path] ? `\n    <lastmod>${stateUpdatedAt[path]}</lastmod>` : '';
            return `  <url>\n    <loc>${siteUrl}${path}</loc>${lastmod}\n  </url>`;
        })
        .join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
    writeFileSync(new URL('./dist/sitemap.xml', import.meta.url), xml);
}

// Preload the Latin sans and mono faces used above the fold so text doesn't swap in after first paint
function preloadFonts() {
    return {
        name: 'preload-fonts',
        transformIndexHtml: {
            order: 'post',
            handler(html, { bundle }) {
                if (!bundle) return html;
                return Object.keys(bundle)
                    .filter((file) => /google-sans-(flex|code)-latin-wght-normal-.*\.woff2$/.test(file))
                    .map((file) => ({
                        tag: 'link',
                        attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
                        injectTo: 'head',
                    }));
            },
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), tailwindcss(), preloadFonts()],
    define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
    base: '/',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    ssgOptions: {
        script: 'async',
        formatting: 'minify',
        // Emit /hedge-calculator.html rather than /hedge-calculator/index.html so
        // Cloudflare Pages serves clean URLs without a trailing-slash redirect.
        dirStyle: 'flat',
        includedRoutes(paths) {
            const staticPaths = paths.filter((path) => !path.includes(':') && !redirectPaths.includes(path));
            const statePaths = Object.keys(sportsbooks).map((key) => `/sportsbooks/${key.replace(/_/g, '-')}`);
            renderedPaths = [...staticPaths, ...statePaths, '/404'];
            return renderedPaths;
        },
        onFinished: writeSitemap,
    },
});

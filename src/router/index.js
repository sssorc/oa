import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: { name: 'devig' },
        },
        {
            path: '/arbitrage',
            name: 'arbitrage',
            component: () => import('../pages/PageArbitrage.vue'),
        },
        {
            path: '/arb',
            redirect: { name: 'arbitrage' },
        },
        {
            path: '/bonus-bet',
            name: 'bonus-bet',
            component: () => import('../pages/PageBonusBet.vue'),
        },
        {
            path: '/free-bet',
            redirect: { name: 'bonus-bet' },
        },
        {
            path: '/risk-free',
            name: 'risk-free',
            component: () => import('../pages/PageRiskFree.vue'),
        },
        {
            path: '/devig',
            name: 'devig',
            component: () => import('../pages/PageDevig.vue'),
        },
    ],
});

export default router;

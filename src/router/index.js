import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: { name: 'arbitrage' },
        },
        {
            path: '/oa',
            redirect: { name: 'oa-arbitrage' },
            children: [
                {
                    path: '/arbitrage',
                    name: 'oa-arbitrage',
                    component: () => import('../pages/PageArbitrage.vue'),
                },
                {
                    path: '/arb',
                    redirect: { name: 'oa-arbitrage' },
                },
                {
                    path: '/free-bet',
                    name: 'oa-free-bet',
                    component: () => import('../pages/PageBonusBet.vue'),
                },
                {
                    path: '/risk-free',
                    name: 'oa-risk-free',
                    component: () => import('../pages/PageRiskFree.vue'),
                },
                {
                    path: '/devig',
                    name: 'oa-devig',
                    component: () => import('../pages/PageDevig.vue'),
                },
            ],
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
            path: '/free-bet',
            name: 'free-bet',
            component: () => import('../pages/PageBonusBet.vue'),
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

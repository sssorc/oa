import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: { name: 'arb' },
        },
        {
            path: '/oa',
            redirect: { name: 'oa-arb' },
            children: [
                {
                    path: '/arb',
                    name: 'oa-arb',
                    component: () => import('../pages/PageArbitrage.vue'),
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
            path: '/arb',
            name: 'arb',
            component: () => import('../pages/PageArbitrage.vue'),
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

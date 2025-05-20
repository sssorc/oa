import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../pages/PageHome.vue'),
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
            path: '/hedge',
            name: 'hedge',
            component: () => import('../pages/PageHedge.vue'),
        },
        {
            path: '/bonus-bet',
            name: 'bonus-bet',
            component: () => import('../pages/PageBonusBet.vue'),
        },
        {
            path: '/free-bet',
            name: 'free-bet',
            component: () => import('../pages/PageFreeBet.vue'),
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
        // Knowledge base routes
        {
            path: '/knowledge',
            name: 'knowledge-home',
            component: () => import('../pages/knowledge/PageKnowledgeHome.vue'),
        },
        {
            path: '/knowledge/when-to-hedge',
            name: 'when-to-hedge',
            component: () => import('../pages/knowledge/PageWhenToHedge.vue'),
        },
        {
            path: '/knowledge/when-to-cash-out',
            name: 'when-to-cash-out',
            component: () => import('../pages/knowledge/PageWhenToCashOut.vue'),
        },
        {
            path: '/knowledge/what-is-positive-ev',
            name: 'what-is-positive-ev',
            component: () => import('../pages/knowledge/PageWhatIsPlusEV.vue'),
        },
        {
            path: '/knowledge/what-is-a-zero-hold',
            name: 'what-is-a-zero-hold',
            component: () => import('../pages/knowledge/PageWhatIsZeroHold.vue'),
        },
        // Sportsbooks routes
        {
            path: '/sportsbooks',
            name: 'sportsbooks-index',
            component: () => import('../pages/sportsbooks/PageSportsbooksIndex.vue'),
        },
        {
            path: '/sportsbooks/:state',
            name: 'state-sportsbooks',
            component: () => import('../pages/sportsbooks/PageStateSportsbooks.vue'),
            props: true,
        },
    ],
});

export default router;

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
            path: '/arbitrage-calculator',
            name: 'arbitrage',
            component: () => import('../pages/PageArbitrage.vue'),
        },
        {
            path: '/arbitrage',
            redirect: { name: 'arbitrage' },
        },
        {
            path: '/arb',
            redirect: { name: 'arbitrage' },
        },
        {
            path: '/hedge-calculator',
            name: 'hedge',
            component: () => import('../pages/PageHedge.vue'),
        },
        {
            path: '/hedge',
            redirect: { name: 'hedge' },
        },
        {
            path: '/bonus-bet-calculator',
            name: 'bonus-bet',
            component: () => import('../pages/PageBonusBet.vue'),
        },
        {
            path: '/bonus-bet',
            redirect: { name: 'bonus-bet' },
        },
        {
            path: '/free-bet-calculator',
            name: 'free-bet',
            component: () => import('../pages/PageFreeBet.vue'),
        },
        {
            path: '/free-bet',
            redirect: { name: 'free-bet' },
        },
        {
            path: '/risk-free-calculator',
            name: 'risk-free',
            component: () => import('../pages/PageRiskFree.vue'),
        },
        {
            path: '/risk-free',
            redirect: { name: 'risk-free' },
        },
        {
            path: '/devig-calculator',
            name: 'devig',
            component: () => import('../pages/PageDevig.vue'),
        },
        {
            path: '/devig',
            redirect: { name: 'devig' },
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

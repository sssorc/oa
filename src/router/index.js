import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../views/Arb.vue'),
			redirect: { name: 'arb' }
		},
		{
			path: '/arb',
			name: 'arb',
			component: () => import('../views/Arb.vue')
		},
		{
			path: '/free-bet',
			name: 'free-bet',
			component: () => import('../views/FreeBet.vue')
		},
		{
			path: '/risk-free',
			name: 'risk-free',
			component: () => import('../views/RiskFree.vue')
		},
		{
			path: '/devig',
			name: 'devig',
			component: () => import('../views/Devig.vue')
		},
	]
})

export default router

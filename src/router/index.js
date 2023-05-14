import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			redirect: { name: 'arb' }
		},
		{
			path: '/oa',
			redirect: { name: 'oa-arb' },
			children: [
				{
					path: '/arb',
					name: 'oa-arb',
					component: () => import('../views/Arb.vue')
				},
				{
					path: '/free-bet',
					name: 'oa-free-bet',
					component: () => import('../views/FreeBet.vue')
				},
				{
					path: '/risk-free',
					name: 'oa-risk-free',
					component: () => import('../views/RiskFree.vue')
				},
				{
					path: '/devig',
					name: 'oa-devig',
					component: () => import('../views/Devig.vue')
				},
			]
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

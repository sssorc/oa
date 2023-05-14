<template>
		<nav>
			<router-link class="flex-center" :to="{ name: 'arb'}" tabindex="-1">Arbitrage</router-link>
			<router-link class="flex-center" :to="{ name: 'free-bet'}" tabindex="-1">Free bet</router-link>
			<router-link class="flex-center" :to="{ name: 'risk-free'}" tabindex="-1">Risk-Free</router-link>
		</nav>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
	name: 'Navigation',
}
</script>
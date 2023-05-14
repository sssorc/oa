<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
	components: {
        Navigation
    },
	data() {
		return {
			showMobileNav: false,
		}
	},
	watch: {
		$route() {
			this.showMobileNav = false;
		},
	},
}
</script>

<template>
	<div v-if="$route.name !== 'devig'" id="app" :class="$route.name">
        <header class="masthead text-center">
            <div class="logo flex-center">hedge calculators</div>
            <nav>
				<RouterLink to="/arb" class="flex-center">Arbitrage</RouterLink>
				<RouterLink to="/free-bet" class="flex-center">Free bet</RouterLink>
				<RouterLink to="/risk-free" class="flex-center">Risk-free</RouterLink>
			</nav>
        </header>
        <RouterView />
        <div class="footer flex-right"><a href="https://twitter.com/ssorc" target="_blank">feedback</a></div>
    </div>
	<RouterView v-else />
</template>
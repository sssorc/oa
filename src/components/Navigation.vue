<template>
	<header class="masthead text-center">
		<div class="logo flex-center">hedge calculators</div>
		<nav>
			<RouterLink :class="{'router-link-active': $route.fullPath == '/arb' }" to="/arb" class="flex-center">Arbitrage</RouterLink>
			<RouterLink :class="{'router-link-active': $route.fullPath == '/free-bet' }" to="/free-bet" class="flex-center">Free bet</RouterLink>
			<RouterLink :class="{'router-link-active': $route.fullPath == '/risk-free' }" to="/risk-free" class="flex-center">Risk-free</RouterLink>
			<RouterLink :class="{'router-link-active': $route.fullPath == '/devig' }" to="/devig" class="flex-center">Devig</RouterLink>
		</nav>
	</header>
</template>

<script>
export default {
	name: 'Navigation',
}
</script>
<template>
	<header class="masthead text-center">
		<div class="logo flex-center">hedge calculators</div>
		<nav>
			<RouterLink to="/arb" class="flex-center">Arbitrage</RouterLink>
			<RouterLink to="/free-bet" class="flex-center">Free bet</RouterLink>
			<RouterLink to="/risk-free" class="flex-center">Risk-free</RouterLink>
		</nav>
	</header>
</template>

<script>
export default {
	name: 'Navigation',
}
</script>
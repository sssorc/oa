<script setup>
import NavigationItem from './NavigationItem.vue';
</script>

<template>
	<header class="border-b-5 border-slate-200 text-center lg:pl-8 lg:flex">
		<div class="hidden lg:flex items-center justify-center text-xl font-bold lg:mr-[200px]">hedge calculators</div>
		<nav class="flex flex-1">
			<NavigationItem to="/arb" border-color="#4CAF50">Arbitrage</NavigationItem>
			<NavigationItem to="/free-bet" border-color="#2196F3">Free bet</NavigationItem>
			<NavigationItem to="/risk-free" border-color="#9C27B0">Risk-free</NavigationItem>
			<NavigationItem to="/devig" border-color="#de5916">Devig</NavigationItem>
		</nav>
	</header>
</template>

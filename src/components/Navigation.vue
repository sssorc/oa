<script setup>
import NavigationItem from './NavigationItem.vue';
</script>

<template>
    <header class="mx-auto max-w-7xl px-5 pt-8">
        <div class="flex items-center justify-between">
            <div class="hidden items-center justify-center text-xl font-bold lg:mr-[200px] lg:flex">hedge calculators</div>
            <nav class="flex gap-2 font-mono">
                <NavigationItem to="/arb">Arbitrage</NavigationItem>
                <NavigationItem to="/free-bet">Free bet</NavigationItem>
                <NavigationItem to="/risk-free">Risk-free</NavigationItem>
                <NavigationItem to="/devig">Devig</NavigationItem>
            </nav>
        </div>
        <hr class="border-space mt-6" />
    </header>
</template>

<script setup>
import LandingLink from '@/components/LandingLink.vue';
</script>

<template>
    <div>
        <section class="relative mx-auto w-full max-w-4xl px-5 pb-8 pt-12 sm:pt-16">
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-8">
                <LandingLink to="/arbitrage">
                    <p>get bet size for
						<div class="flex items-end gap-2">
							<strong class="font-mono text-2xl sm:text-3xl">Arbitrage</strong>
							or
							<strong class="font-mono text-2xl sm:text-3xl">Hedge</strong>
						</div>
					</p>
                </LandingLink>
                <LandingLink to="/bonus-bet">
                    <p>convert a <strong class="block font-mono text-2xl sm:text-3xl">Bonus Bet</strong></p>
                </LandingLink>
                <LandingLink to="/risk-free">
                    <p>hedge a <strong class="block font-mono text-2xl sm:text-3xl">Risk-Free Bet</strong></p>
                </LandingLink>
                <LandingLink to="/devig">
                    <p>calculate EV with a <strong class="block font-mono text-2xl sm:text-3xl">Devig</strong></p>
                </LandingLink>
            </div>
        </section>
    </div>
</template>

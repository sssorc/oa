<script setup>
import LandingLink from '@/components/ui/LandingLink.vue';
</script>

<template>
    <div>
        <section class="relative mx-auto w-full max-w-4xl px-5 pt-12 pb-8 sm:pt-16">
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-8">
                <LandingLink to="/arbitrage-calculator">
                    <p>
                        get bet size for
                        <span class="flex items-end gap-x-2 gap-y-1 sm:max-md:flex-col sm:max-md:items-center">
                            <strong class="font-mono text-2xl sm:text-3xl">Arbitrage</strong>
                            or
                            <strong class="font-mono text-2xl sm:text-3xl">Hedge</strong>
                        </span>
                    </p>
                </LandingLink>
                <LandingLink to="/bonus-bet-calculator">
                    <p>convert a <strong class="block font-mono text-2xl sm:text-3xl">Bonus Bet</strong></p>
                </LandingLink>
                <LandingLink to="/risk-free-bet-calculator">
                    <p>hedge a <strong class="block font-mono text-2xl sm:text-3xl">Risk-Free Bet</strong></p>
                </LandingLink>
                <LandingLink to="/devig-calculator">
                    <p>calculate EV with a <strong class="block font-mono text-2xl sm:text-3xl">Devig</strong></p>
                </LandingLink>
            </div>
        </section>
    </div>
</template>

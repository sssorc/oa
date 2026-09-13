<script setup>
import { useHead } from '@unhead/vue';
import LandingLink from '@/components/ui/LandingLink.vue';
import { usePageTitle, organization, siteUrl } from '@/composables/usePageTitle';

const description = 'Free sports betting calculators with no clutter: hedge and arbitrage bet sizing, bonus bet and risk-free bet conversion, and devig EV. Plus legal sportsbooks by state.';

usePageTitle('HedgeCalc: Free Hedge, Arbitrage & Devig Calculators', description, {
    fullTitle: true,
    schema: {
        '@type': 'WebPage',
        name: 'HedgeCalc',
        description,
        url: `${siteUrl}/`,
        publisher: organization,
    },
});

useHead({
    script: [
        {
            type: 'application/ld+json',
            key: 'site-schema',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'HedgeCalc',
                url: `${siteUrl}/`,
                publisher: organization,
            }),
        },
    ],
});
</script>

<template>
    <div>
        <section class="relative mx-auto w-full max-w-4xl px-5 pt-12 pb-8 sm:pt-16">
            <h1 class="mb-6 font-mono text-xl sm:mb-8">Free sports betting calculators</h1>
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

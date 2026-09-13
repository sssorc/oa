<script setup>
import { useHead } from '@unhead/vue';
import AppHeader from '@/components/core/AppHeader.vue';
import AppFooter from '@/components/core/AppFooter.vue';
import { usePageTitle, organization, siteUrl } from '@/composables/usePageTitle';

// Defaults for any page that doesn't set its own
usePageTitle('Sports Betting Calculators');

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
    <div class="flex min-h-screen flex-col">
        <AppHeader />
        <RouterView />
        <AppFooter />
    </div>
</template>

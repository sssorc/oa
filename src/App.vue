<script setup>
import AppHeader from '@/components/core/AppHeader.vue';
import AppFooter from '@/components/core/AppFooter.vue';
import { usePageTitle } from '@/composables/usePageTitle';

// Defaults for any page that doesn't set its own
usePageTitle('Sports Betting Calculators');
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <AppHeader />
        <RouterView />
        <AppFooter />
    </div>
</template>

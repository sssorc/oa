<script setup>
import { useHead } from '@unhead/vue';
import BackButton from '@/components/ui/BackButton.vue';

useHead({
    title: 'Page Not Found',
    titleTemplate: '%s | HedgeCalc',
    meta: [{ name: 'robots', content: 'noindex' }],
});
</script>

<template>
    <div class="mx-auto w-full max-w-4xl px-5 py-12">
        <h1 class="mb-4 text-3xl font-bold">Page not found</h1>
        <p class="mb-8">That page doesn't exist or has moved.</p>
        <BackButton to="/">Back to calculators</BackButton>
    </div>
</template>

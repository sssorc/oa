<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import KnowledgeLink from '@/components/knowledge/KnowledgeLink.vue';

// Set page title
usePageTitle('Knowledge Base');
</script>

<template>
    <div class="mx-auto w-full max-w-4xl px-5 py-12">
        <h1 class="mb-8 text-3xl font-bold">Sports Betting Knowledge Base</h1>

        <div class="grid gap-4 lg:gap-8">
            <KnowledgeLink to="/knowledge/when-to-hedge">When should I hedge a bet?</KnowledgeLink>
            <KnowledgeLink to="/knowledge/what-is-positive-ev">What is positive EV?</KnowledgeLink>
        </div>
    </div>
</template>

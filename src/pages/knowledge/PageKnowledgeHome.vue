<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import KnowledgeLink from '@/components/knowledge/KnowledgeLink.vue';

// Set page title
usePageTitle(
    '+EV Sports Betting Knowledge Base',
    'Plain-English answers about +EV betting: what positive EV and devigs are, when to hedge or cash out, zero holds, and legal sportsbooks by state.',
    {
        breadcrumbs: [{ name: 'Knowledge Base', path: '/knowledge' }],
    }
);
</script>

<template>
    <div class="mx-auto w-full max-w-4xl px-5 py-12">
        <h1 class="mb-4 text-3xl font-bold">Sports Betting Knowledge Base</h1>
        <p class="mb-8">Short, plain-English answers to the questions that come up when you start betting for expected value.</p>

        <div class="grid gap-4 lg:gap-6">
            <KnowledgeLink to="/knowledge/when-to-hedge">When should I hedge a bet?</KnowledgeLink>
            <KnowledgeLink to="/knowledge/when-to-cash-out">When should I cash out a bet?</KnowledgeLink>
            <KnowledgeLink to="/knowledge/what-is-positive-ev">What is positive expected value (+EV)?</KnowledgeLink>
            <KnowledgeLink to="/knowledge/what-is-a-zero-hold">What is a zero hold?</KnowledgeLink>
            <KnowledgeLink to="/knowledge/what-is-a-devig">What is a devig?</KnowledgeLink>
            <KnowledgeLink to="/knowledge/why-hedging-lowers-ev">Why does hedging lower EV?</KnowledgeLink>
            <KnowledgeLink to="/sportsbooks">What sportsbooks are available in my state?</KnowledgeLink>
        </div>
    </div>
</template>

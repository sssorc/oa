<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import KnowledgeLink from '@/components/knowledge/KnowledgeLink.vue';

// Set page title
usePageTitle('Sports Betting Knowledge Base', 'Beginner-friendly explanations of key topics and terms related to sports betting that are necessary to be a profitable bettor.');
</script>

<template>
    <div class="mx-auto w-full max-w-4xl px-5 py-12">
        <h1 class="mb-8 text-3xl font-bold">Sports Betting Knowledge Base</h1>

        <div class="grid gap-4 lg:gap-6">
            <KnowledgeLink to="/knowledge/when-to-hedge">When should I hedge a bet?</KnowledgeLink>
            <KnowledgeLink to="/knowledge/when-to-cash-out">When should I cash out a bet?</KnowledgeLink>
            <KnowledgeLink to="/knowledge/what-is-positive-ev">What is positive expected value (+EV)?</KnowledgeLink>
            <KnowledgeLink to="/knowledge/what-is-a-zero-hold">What is a zero hold?</KnowledgeLink>
            <KnowledgeLink to="/knowledge/what-is-a-devig">What is a devig?</KnowledgeLink>
            <KnowledgeLink to="/sportsbooks">What sportsbooks are available in my state?</KnowledgeLink>
        </div>
    </div>
</template>

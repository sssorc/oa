<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import { RouterLink } from 'vue-router';
import KnowledgeArticle from '@/components/knowledge/KnowledgeArticle.vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

// Set page title
usePageTitle(
    'What is a Zero Hold?',
    'Discover what a zero hold market is in sports betting. Learn how to identify zero hold opportunities and use them to your advantage for risk-free betting and promotional requirements.'
);
</script>

<template>
    <KnowledgeArticle>
        <KnowledgeHeader>What is a zero hold?</KnowledgeHeader>
        <p>A 'zero hold' is a market where you're able to bet on all outcomes without losing money to the 'hold' (or 'juice' or 'vig')</p>
        <p>In two sided markets, these are easy to spot because both numbers will add to zero. An example:</p>
        <p><strong>DraftKings</strong><br />Nikola Jokic over 29.5 points (+120)</p>
        <p><strong>FanDuel</strong><br />Nikola Jokic under 29.5 points (-120)</p>
        <p>
            If you plugged this into the <router-link to="/arbitrage?stakeA=100&oddsA=120&oddsB=-120">arbitrage calculator</router-link>, you'd see that for any bet made on the over, there's an amount
            you can place on the under to bring your net winnings to $0. With the right stake, the amount won can always cancel out the amount lost.
        </p>
        <p>Betting both sides of a zero hold is a way to wager your money without actually 'spending' it. It can help you satisfy playthrough or promotion requirements without any risk.</p>
    </KnowledgeArticle>
</template>

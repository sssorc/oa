<script setup>
import { usePageTitle, articleSchema } from '@/composables/usePageTitle';
import { RouterLink } from 'vue-router';
import KnowledgeArticle from '@/components/knowledge/KnowledgeArticle.vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

// Set page title
const description = 'A zero hold is a market where you can bet every side without losing money to the vig. Learn how to spot one and use it to clear promo playthrough risk-free.';
const publishedAt = '2025-05-16';
const updatedAt = '2026-09-12';
const image = '/og/what-is-a-zero-hold.png';
usePageTitle('What Is a Zero Hold in Sports Betting?', description, {
    ogType: 'article',
    image,
    schema: articleSchema('What is a zero hold?', description, '/knowledge/what-is-a-zero-hold', { datePublished: publishedAt, dateModified: updatedAt, image }),
    breadcrumbs: [
        { name: 'Knowledge Base', path: '/knowledge' },
        { name: 'What is a zero hold?', path: '/knowledge/what-is-a-zero-hold' },
    ],
});
</script>

<template>
    <KnowledgeArticle>
        <KnowledgeHeader :published-at="publishedAt" :updated-at="updatedAt">What is a zero hold?</KnowledgeHeader>
        <p>A 'zero hold' is a market where you're able to bet on all outcomes without losing money to the 'hold' (or 'juice' or 'vig').</p>
        <p>In two sided markets, these are easy to spot because the two odds will add up to zero. An example:</p>
        <p><strong>DraftKings</strong><br />Nikola Jokic over 29.5 points (+120)</p>
        <p><strong>FanDuel</strong><br />Nikola Jokic under 29.5 points (-120)</p>
        <p>
            If you plugged this into the <router-link to="/arbitrage-calculator?stakeA=100&oddsA=120&oddsB=-120">arbitrage calculator</router-link>, you'd see that for any bet made on the over,
            there's an amount you can place on the under to bring your net winnings to $0. With the right stake, the amount won can always cancel out the amount lost.
        </p>
        <p>Betting both sides of a zero hold is a way to wager your money without actually 'spending' it. It can help you satisfy playthrough or promotion requirements without any risk.</p>
    </KnowledgeArticle>
</template>

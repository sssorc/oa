<script setup>
import { usePageTitle, articleSchema } from '@/composables/usePageTitle';
import { RouterLink } from 'vue-router';
import KnowledgeArticle from '@/components/knowledge/KnowledgeArticle.vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

// Set page title
const description = 'Hedging a +EV bet usually costs you money long term. Learn the specific situations where hedging does make sense, from bankroll limits to line movement.';
const publishedAt = '2025-05-16';
const updatedAt = '2026-09-12';
const image = '/og/when-to-hedge.png';
usePageTitle('When Should You Hedge a Bet?', description, {
    ogType: 'article',
    image,
    schema: articleSchema('When should I hedge a bet?', description, '/knowledge/when-to-hedge', { datePublished: publishedAt, dateModified: updatedAt, image }),
    breadcrumbs: [
        { name: 'Knowledge Base', path: '/knowledge' },
        { name: 'When should I hedge a bet?', path: '/knowledge/when-to-hedge' },
    ],
});
</script>

<template>
    <KnowledgeArticle>
        <KnowledgeHeader :published-at="publishedAt" :updated-at="updatedAt">When should I hedge a bet?</KnowledgeHeader>
        <p>The short answer is: usually never.</p>
        <p>
            If you're placing <router-link to="/knowledge/what-is-positive-ev">positive EV bets</router-link>, you will - in the long run - be more profitable if you don't hedge. This is because the
            hedge is usually a negative EV bet. You are sacrificing EV and in return getting lower variance.
        </p>
        <p>That said, here are some examples where hedging your bet may make sense.</p>

        <h2>When it makes sense to hedge</h2>
        <ul>
            <li>You're building a bankroll and don't have the liquidity to handle variance</li>
            <li>Lines have moved and your hedge bet is actually +EV now</li>
            <li>You're placing a zero hold bet to qualify for a bet-and-get promo</li>
            <li>A boost maximum is above your quarter Kelly, and you want to hedge out some of the risk while maxing the promo</li>
            <li>You accidentally bet too much and can't cash out at full value</li>
        </ul>
        <p>
            If any of these apply, you can use the <router-link to="/hedge-calculator">hedge calculator</router-link> to figure out your hedge amount. Before you do, see
            <router-link to="/knowledge/why-hedging-lowers-ev">why hedging lowers EV</router-link>.
        </p>
    </KnowledgeArticle>
</template>

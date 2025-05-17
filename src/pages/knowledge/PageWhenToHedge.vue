<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import { RouterLink } from 'vue-router';
import KnowledgeArticle from '@/components/knowledge/KnowledgeArticle.vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

// Set page title
usePageTitle('When Should I Hedge a Bet?');
</script>

<template>
    <KnowledgeArticle>
        <KnowledgeHeader>When should I hedge a bet?</KnowledgeHeader>
        <p>The short answer is: usually never.</p>
        <p>
            If you're placing <router-link to="/knowledge/what-is-positive-ev">positive EV bets</router-link>, you will - in the long run - be more profitable if you don't hedge. This is because the
            hedge is usually a negative EV bet. You are sacrificing EV and in return getting lower variance.
        </p>
        <p></p>
        <p>That said, here are some examples where hedging your bet may make sense.</p>

        <h2>When it makes sense to hedge</h2>
        <ul>
            <li>You're building a bankroll and don't have the liquidity to handle variance</li>
            <li>Lines have moved and your hedge bet is actually +EV now</li>
            <li>You're placing a zero hold bet to quality for bet-and-get promo</li>
            <li>A boost maximum is above your quarter kelly, and you want to hedge out some of the risk while maxing the promo</li>
            <li>You accidentally bet too much and can't cashout at full value</li>
        </ul>
        <p>If any of these apply, you can use the <router-link to="/arbitrage">arbitrage calculator</router-link> to figure out your hedge amount.</p>
    </KnowledgeArticle>
</template>

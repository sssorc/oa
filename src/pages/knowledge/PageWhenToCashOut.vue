<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import { RouterLink, routerViewLocationKey } from 'vue-router';
import KnowledgeArticle from '@/components/knowledge/KnowledgeArticle.vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

// Set page title
usePageTitle(
    'When Should I cash out a bet?',
    'Learn when it makes sense to hedge your sports bets. Understand the pros and cons of hedging, including bankroll management, EV considerations, and promotional opportunities.'
);
</script>

<template>
    <KnowledgeArticle>
        <KnowledgeHeader>When should I cash out a bet?</KnowledgeHeader>
        <p>
            There are very few situations where it makes sense to cash out a bet. Primarily, you are sacrificing <router-link to="/knowledge/what-is-positive-ev">EV</router-link> by cashing out
            instead of letting your bets ride. Secondly, if you still wish to cash out, you will almost always net a higher amount if you hedge your bet insted of cashing out.
        </p>
        <p>
            If you still want to cash out of a two-way market, before doing so, first find the best line available for the other side and plug the numbers into the
            <router-link to="/arbitrage">arbitrage calculator</router-link>. Compare this number to the amount you would gain by cashing out.
        </p>

        <h2>When to cash out</h2>
        <ul>
            <li>The bet you've placed is no longer +EV, and can be cashed out at full value</li>
            <li>You've placed a bet accidentally</li>
            <li>You've bet on a premade boost whose odds have increased, and can cash out at full value and re-bet at the higher odds</li>
        </ul>
    </KnowledgeArticle>
</template>

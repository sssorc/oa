<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import { RouterLink } from 'vue-router';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

// Set page title
usePageTitle('What is Positive EV?');
</script>

<template>
    <article class="prose mx-auto w-full max-w-4xl px-5 py-16">
        <KnowledgeHeader>What is positive EV?</KnowledgeHeader>
        <p>Every bet has an expected value (EV) based on the odds and the implied probability of hitting. When this value is positive, it's a +EV bet</p>
        <h2>Coin flip example</h2>
        <p>
            Consider a coin flip where you can bet a dollar on heads or tails at +100. You win $1 if you're right and lose $1 if you're wrong. The expected value of this bet is $0, because over an
            infinite amount of bets, your wins and losses will exactly cancel out. +100 is the fair value of a bet that hits 50% of the time.
        </p>
        <p>
            Now imagine the same bet at +110. You win $1.10 if you guess correctly, but still only lose $1 if wrong. Your wins are going to make up for your losses, and then some. The expected value
            of this bet is 0.05. You can plug these numbers into the <a href="https://hedgecalc.com/devig?finalOdds=110&legOdds=100">devig calculator</a> to see it's a 5% EV bet.
        </p>
        <p>
            Conversely, imagine the odds were instead -110. You risk $1 to win only $0.90. The expected value of this bet is <em>negative</em>, and thus is a bad bet. The payout is not high enough for
            how often it wins. Over time you would expect to lose 5 cents for every $1 bet you made. This is how sportsbooks make their money, and why most people are losing bettors.
        </p>
    </article>
</template>

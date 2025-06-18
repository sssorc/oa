<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import { RouterLink } from 'vue-router';
import KnowledgeArticle from '@/components/knowledge/KnowledgeArticle.vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

// Set page title
usePageTitle('What is Positive EV?', 'Understand positive expected value (EV) in sports betting. Learn how to calculate EV, identify +EV opportunities, and make profitable betting decisions.');
</script>

<template>
    <KnowledgeArticle>
        <KnowledgeHeader>What is positive EV?</KnowledgeHeader>
        <p>
            Every bet has an expected value (EV) based on the odds and the implied probability of hitting. When this value is positive for a bet, it's said to be "+EV". The formula for calculating EV
            is:
        </p>
        <p class="bg-pale-blue/30 border-jet/10 border p-4 text-sm">(Amount won per bet &times; probability of winning) – (Amount lost per bet &times; probability of losing)</p>
        <p>+EV bets = good</p>
        <p>-EV bets = bad</p>

        <h2>Coin flip example</h2>
        <p>
            Consider a coin flip where you can bet a dollar on heads or tails at +100. You win $1 if you're right and lose $1 if you're wrong. The expected value of this bet is $0, because over an
            infinite amount of bets, your wins and losses will exactly cancel out. +100 is the fair value of a bet that hits 50% of the time.
        </p>
        <p>
            Now imagine the same bet at +110. You win $1.10 if you guess correctly, but still only lose $1 if wrong. Your wins are going to make up for your losses, and then some. The expected value
            of this bet is 0.05. You can plug these numbers into the <router-link to="/devig-calculator?finalOdds=110&legOdds=100">devig calculator</router-link> to see it's a 5% EV bet.
        </p>
        <p>Using the formula:</p>
        <p>EV = (1.1 &times; 0.5) - (1 &times; 0.5)</p>
        <p>EV = 0.55 - 0.5</p>
        <p>EV = 0.05</p>
        <p>Across many bets, you can expect to win $0.05 (or 5%) for every $1 wagered.</p>
        <p>
            Conversely, imagine the odds were instead -110. You risk $1 to win only $0.90. The expected value of this bet is <em>negative</em>, and thus is a bad bet. The payout is not high enough for
            how often it wins. Over time you would expect to lose 5 cents for every $1 bet you made. This is how sportsbooks make their money, and why most people are losing bettors.
        </p>
    </KnowledgeArticle>
</template>

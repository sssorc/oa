<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import { RouterLink } from 'vue-router';
import KnowledgeArticle from '@/components/knowledge/KnowledgeArticle.vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

// Set page title
usePageTitle('Why does hedging lower EV?', 'Hedging your bets will reduce variance, but at the cost of lowering your long term expected value.');
</script>

<template>
    <KnowledgeArticle>
        <KnowledgeHeader>Why does hedging lower EV?</KnowledgeHeader>
        <p>
            Hedging bets will reduce your variance, or the up and down fluctiations of your bankroll, but doing so will lower your long term expected value. Below is a simplified example to illustrate
            this.
        </p>
        <p>
            Suppose each day you get a 30% profit boost and use it on a three leg parlay, where each leg is -110/-110. For simplicity, we'll assume the fair value of each leg is +100, and we stake $10
            on each bet. We can look at the the expected results after 1,000 days with different strategies.
        </p>

        <h2>Strategy 1: No hedging</h2>
        <p>Since the chance of winning each leg is 50%, the probability of all three hitting is 12.5%</p>
        <p class="bg-pale-blue/30 border-jet/10 border p-4 text-sm">0.5 &times; 0.5 &times; 0.5 = 0.125</p>
        <p>The parlay builds to +595 pre-boost, and is +774 after the boost. Our profit on each win is $77.40</p>
        <p class="bg-pale-blue/30 border-jet/10 border p-4 text-sm">
            Profit = ($10 &times; 774) / 100<br />
            <span class="invisible">Profit</span> = $7,740 / 100<br />
            <span class="invisible">Profit</span> = $77.40
        </p>
        <p>We can then find the total expected profit by multiplying our $77.40 by the amount of bets we expect to win, and subtracting $10 for the days we expect to lose.</p>
        <p class="bg-pale-blue/30 border-jet/10 border p-4 text-sm">
            Total profit = (1,000 &times; 0.125 &times; $77.4) + (1,000 &times; 0.875 &times; -$10)<br />
            <span class="invisible">Total profit</span> = (125 &times; $77.4) + (875 &times; -$10)<br />
            <span class="invisible">Total profit</span> = $9,675 + -$8,750<br />
            <span class="invisible">Total profit</span> = $925
        </p>
        <p>
            The total profit is <strong>$925</strong> for an ROI of 9.25%. The
            <router-link to="/devig-calculator?finalOdds=595&legOdds=100%2C100%2C100&boost=30">devig calculator</router-link> confirms this by showing that is is a 9.2% EV bet.
        </p>

        <h2>Strategy 2: Hedge the last leg</h2>
        <p>Now let's calculate the ROI if we hedge every parlay that reaches its final leg with a -110 bet.</p>
        <p>25% of bets will make it to the last leg:</p>
        <p class="bg-pale-blue/30 border-jet/10 border p-4 text-sm">0.5 &times; 0.5 = 0.25</p>
        <p>
            Of those 25%, the <router-link to="/arbitrage-calculator?stakeA=10&oddsA=774&oddsB=-110">arbitrage calculator</router-link> shows that we can lock in roughly $31.6 of profit with a $46
            wager on a -110 hedge line. So:
        </p>
        <p class="bg-pale-blue/30 border-jet/10 border p-4 text-sm">
            Total profit = (1,000 &times; 0.25 &times; $31.6) + (1,000 &times; 0.75 &times; -$10)<br />
            <span class="invisible">Total profit</span> = (250 &times; $31.6) + (750 &times; -$10)<br />
            <span class="invisible">Total profit</span> = $7,900 - $7,500<br />
            <span class="invisible">Total profit</span> = $400
        </p>
        <p>The total profit is <strong>$400</strong>, which is significantly less than the unhedged strategy.</p>
        <h2>Conclusion</h2>
        <p>Why does this happen? When you hedge the last leg in this scenario, you're trading a 50% chance to win $77.4 for a 100% chance to win $31.6</p>
        <p class="bg-pale-blue/30 border-jet/10 border p-4 text-sm">
            Unhedged EV = 0.5 &times; $77.4 - 0.5 &times; $10<br />
            <span class="invisible">Unheged EV</span> = $38.7 - $5<br />
            <span class="invisible">Unheged EV</span> = $33.7
        </p>
        <p class="bg-pale-blue/30 border-jet/10 border p-4 text-sm">
            Hedged EV = 1 &times; $31.6<br />
            <span class="invisible">Hedged EV</span> = $31.6
        </p>
        <p>
            So while you smooth out variance with hedging, you are forfeiting $2.1 in expected value on each of those 250 parlays that make it to the last leg. $2.1 &times; 250 =
            <strong>$525</strong>, which is the difference in profit between the two strategies above.
        </p>
    </KnowledgeArticle>
</template>
875 losses -8,750 8,400 7,500

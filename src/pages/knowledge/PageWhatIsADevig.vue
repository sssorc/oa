<script setup>
import { usePageTitle, articleSchema } from '@/composables/usePageTitle';
import { RouterLink } from 'vue-router';
import KnowledgeArticle from '@/components/knowledge/KnowledgeArticle.vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

// Set page title
const description = 'A devig removes the sportsbook vig to find the fair odds of a bet. Learn the devig methods, which odds to use, and see a worked parlay example.';
const publishedAt = '2025-05-21';
const updatedAt = '2026-09-12';
const image = '/og/what-is-a-devig.png';
usePageTitle('What Is a Devig? Finding Fair Odds in Sports Betting', description, {
    ogType: 'article',
    image,
    schema: articleSchema('What is a devig?', description, '/knowledge/what-is-a-devig', { datePublished: publishedAt, dateModified: updatedAt, image }),
    breadcrumbs: [
        { name: 'Knowledge Base', path: '/knowledge' },
        { name: 'What is a devig?', path: '/knowledge/what-is-a-devig' },
    ],
});
</script>

<template>
    <KnowledgeArticle>
        <KnowledgeHeader :published-at="publishedAt" :updated-at="updatedAt">What is a devig?</KnowledgeHeader>
        <p>
            In sports betting, a 'devig' is the process of finding the fair odds for a bet by removing the sportsbook's 'vig' or 'juice'. There are several methods of devigging including
            Multiplicative, Additive, Shin, and Power. For simplicity and the best results, the <router-link to="/devig-calculator">devig calculator</router-link> will use all of these methods and
            return the most conservative (i.e. highest) result. The term 'devig' is also used as shorthand to mean a 'devig result'.
        </p>
        <p>
            Getting the fair odds is important so that you can compare it to the odds you're offered for any given bet. With these two numbers, you can calculate the
            <router-link to="/knowledge/what-is-positive-ev">expected value</router-link> of the bet, and thus the amount you should stake on it. The devig calculator will do all of this and show you
            the results.
        </p>
        <p>
            A devig is done with the relevant legs from either a sportsbook that is sharp in that market, or from a market average of the legs. For example, Pinnacle is sharp for NFL money lines. If
            you wanted to devig a bet on the Ravens to beat the Steelers, your inputs would be the odds for the Ravens and the odds for the Steelers that Pinnacle offers. More details and examples for
            devig inputs can be found on the <router-link to="/devig-calculator">devig calculator</router-link> page.
        </p>
        <h2>A practical example of a simple devig</h2>
        <p>Suppose you want to know if this WNBA boost is a good bet:</p>
        <img src="@/assets/images/devig-1.webp" alt="Screenshot of a Bet365 WNBA moneyline parlay boost" width="560" height="424" />
        <p>If we consider Pinnacle sharp for WNBA money lines, we would use its odds for each of the three moneyline bets as our leg input.</p>
        <img src="@/assets/images/devig-2.webp" alt="Screenshot of WNBA lines on Pinnacle" width="1280" height="484" loading="lazy" />
        <p>
            A devig for this bet would look <router-link to="/devig-calculator?finalOdds=171&legOdds=-627%2F479%2C-222%2F186%2C-205%2F173">like this</router-link>. We can see that the fair odds were
            calculated to be +179. Since we're only offered +171, this makes the <router-link to="/knowledge/what-is-positive-ev">expected value</router-link> negative, and you would know
            <strong>not</strong> to place this bet.
        </p>
    </KnowledgeArticle>
</template>

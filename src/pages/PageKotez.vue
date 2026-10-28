<script setup>
import { usePageTitle, absoluteUrl } from '@/composables/usePageTitle';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';
import WeeklyWinnersTable from '@/components/promo/WeeklyWinnersTable.vue';

const season = 2026;
const description = `Weekly DraftKings King of the End Zone winners for the ${season} NFL season: eligible games, prize pot, winning player, yards, and payout.`;
usePageTitle(`DraftKings King of the End Zone Winners (${season})`, description, {
    breadcrumbs: [{ name: 'DraftKings King of the End Zone Winners', path: '/kotez' }],
    schema: {
        '@type': 'WebPage',
        name: `DraftKings King of the End Zone Winners (${season} NFL Season)`,
        description,
        url: absoluteUrl('/kotez'),
    },
});

const weeks = [
    {
        week: 1,
        eligibleGames: 'NE vs SEA',
        pot: '$5M',
        winner: 'Jaxon Smith-Njigba',
        yards: 45,
        payout: '$113',
        odds: '+135',
    },
    {
        week: 2,
        eligibleGames: 'DET vs BUF',
        pot: '$2M',
        winner: 'Josh Palmer',
        yards: '43',
        payout: '$286',
        odds: '+550',
    },
    {
        week: 3,
        eligibleGames: 'PHI vs CHI',
        pot: '$2M',
        winner: 'Kalif Raymond',
        yards: 41,
        payout: '$477',
        odds: '+550',
    },
    {
        week: 4,
        eligibleGames: 'ATL vs NO',
        pot: '$2M',
        winner: 'Bijan Robinson',
        yards: 59,
        payout: '$77',
        odds: '-210',
    },
    {
        week: 5,
        eligibleGames: 'BUF vs LAR',
        pot: '$2M',
        winner: 'James Cook',
        yards: 17,
        payout: '$147',
        odds: '-110',
    },
    {
        week: 6,
        eligibleGames: 'WAS vs SF',
        pot: '$2M',
        winner: 'George Kittle',
        yards: 11,
        payout: '$69',
        odds: '+105',
    },
    {
        week: 7,
        eligibleGames: 'DAL vs PHI',
        pot: '$2M',
        winner: 'George Pickens',
        yards: 21,
        payout: '$66',
        odds: '+175',
    },
];
</script>

<template>
    <article class="mx-auto w-full max-w-4xl px-5 py-12">
        <div class="prose">
            <KnowledgeHeader>DraftKings King of the End Zone Winners ({{ season }})</KnowledgeHeader>
            <p>Weekly tracker for the DraftKings King of the End Zone promo winners. Win a share of the pot if your player scores the longest touchdown.</p>
            <p>Also see this season's <RouterLink to="/slatebreaker">Slatebreaker winners</RouterLink>.</p>
        </div>

        <section class="mt-8">
            <WeeklyWinnersTable :weeks="weeks" caption="King of the End Zone weekly winners" stat-label="Yards" stat-key="yards" />
        </section>
    </article>
</template>

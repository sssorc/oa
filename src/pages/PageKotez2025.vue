<script setup>
import { usePageTitle, absoluteUrl } from '@/composables/usePageTitle';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';
import WeeklyWinnersTable from '@/components/promo/WeeklyWinnersTable.vue';

const season = 2025;
const description = `Weekly DraftKings King of the End Zone winners for the ${season} NFL season: eligible games, prize pot, winning player, yards, and payout.`;
usePageTitle(`DraftKings King of the End Zone Winners (${season})`, description, {
    breadcrumbs: [
        { name: 'DraftKings King of the End Zone Winners', path: '/kotez' },
        { name: `${season} Season`, path: '/kotez/2025' },
    ],
    schema: {
        '@type': 'WebPage',
        name: `DraftKings King of the End Zone Winners (${season} NFL Season)`,
        description,
        url: absoluteUrl('/kotez/2025'),
    },
});

// Sourced from DraftKings Network trackers and DraftKings Sportsbook social posts.
// Payouts are only listed where the per-bettor amount was confirmed.
const weeks = [
    {
        week: 3,
        eligibleGames: 'BAL vs DET',
        pot: '$2M',
        winner: 'David Montgomery',
        yards: 31,
        payout: '-',
    },
    {
        week: 5,
        eligibleGames: 'SF vs LAR',
        pot: '$2M',
        winner: 'Kyren Williams',
        yards: 14,
        payout: '$226',
    },
    {
        week: 7,
        eligibleGames: 'TB vs DET, HOU vs SEA',
        pot: '$2M',
        winner: 'Jahmyr Gibbs',
        yards: 78,
        payout: '$172',
    },
    {
        week: 13,
        eligibleGames: 'GB vs DET, KC vs DAL, CIN vs BAL',
        pot: '$2M',
        winner: 'Christian Watson',
        yards: 51,
        payout: '$153',
    },
    {
        week: 13,
        eligibleGames: 'NYG vs NE',
        pot: '$2M',
        winner: 'Patriots D/ST (Marcus Jones)',
        yards: 94,
        payout: '-',
    },
    {
        week: 16,
        eligibleGames: 'SF vs IND',
        pot: '$2M',
        winner: '49ers D/ST (Dee Winters)',
        yards: 75,
        payout: '-',
    },
    {
        week: 17,
        eligibleGames: 'CHI vs SF',
        pot: '$2M',
        winner: 'Jauan Jennings',
        yards: 38,
        payout: '$106',
    },
    {
        week: 'Wild Card',
        eligibleGames: 'LAR vs CAR, GB vs CHI',
        pot: '$3M',
        winner: 'DJ Moore',
        yards: 25,
        payout: '$337',
    },
    {
        week: 'Divisional',
        eligibleGames: 'BUF vs DEN, SF vs SEA',
        pot: '$3M',
        winner: 'Rashid Shaheed / Seahawks D/ST',
        yards: 95,
        payout: '-',
    },
    {
        week: 'Super Bowl',
        eligibleGames: 'SEA vs NE',
        pot: '$4M',
        winner: 'Seahawks D/ST (Uchenna Nwosu)',
        yards: 45,
        payout: '$183',
    },
];
</script>

<template>
    <article class="mx-auto w-full max-w-4xl px-5 py-12">
        <div class="prose">
            <KnowledgeHeader>DraftKings King of the End Zone Winners ({{ season }})</KnowledgeHeader>
            <p>Results from the DraftKings King of the End Zone promo during the {{ season }} NFL season. Win a share of the pot if your player scores the longest touchdown.</p>
            <p>See the <RouterLink to="/kotez">current season's winners</RouterLink>.</p>
        </div>

        <section class="mt-8">
            <WeeklyWinnersTable :weeks="weeks" caption="King of the End Zone weekly winners, 2025 season" stat-label="Yards" stat-key="yards" />
        </section>
    </article>
</template>

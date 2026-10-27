<script setup>
import { usePageTitle, absoluteUrl } from '@/composables/usePageTitle';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';
import WeeklyWinnersTable from '@/components/promo/WeeklyWinnersTable.vue';

const season = 2026;
const description = `DraftKings King of the Court results for the ${season} NBA season: date, eligible games, prize pot, winner, points plus rebounds plus assists, and payout.`;
usePageTitle(`DraftKings King of the Court Winners (${season})`, description, {
    breadcrumbs: [{ name: 'DraftKings King of the Court Winners', path: '/king-of-the-court' }],
    schema: {
        '@type': 'WebPage',
        name: `DraftKings King of the Court Winners (${season} NBA Season)`,
        description,
        url: absoluteUrl('/king-of-the-court'),
    },
});

const dates = [
    {
        date: '10/21',
        eligibleGames: '-',
        pot: '$5M',
        winner: 'Anthony Edwards / Ty Jerome',
        pra: 45,
        payout: '$824',
    },
    {
        date: '10/27',
        eligibleGames: '-',
        pot: '$1M',
        winner: '-',
        pra: '-',
        payout: '-',
    },
];
</script>

<template>
    <article class="w-full py-12">
        <section class="px-6">
            <div class="prose mx-auto max-w-4xl">
                <KnowledgeHeader>DraftKings King of the Court Winners ({{ season }})</KnowledgeHeader>
                <p>Track each King of the Court date, eligible games, prize pot, winning player, PRA, and payout. PRA is points plus rebounds plus assists.</p>
                <p>Also see <RouterLink to="/kotez">King of the End Zone winners</RouterLink>.</p>
            </div>
        </section>

        <section class="mt-8 px-6">
            <div class="mx-auto max-w-4xl">
                <WeeklyWinnersTable
                    :weeks="dates"
                    caption="King of the Court winners, 2026 season"
                    first-column-label="Date"
                    first-column-key="date"
                    stat-label="PRA"
                    stat-key="pra"
                />
            </div>
        </section>
    </article>
</template>

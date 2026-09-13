<script setup>
import { usePageTitle, absoluteUrl } from '@/composables/usePageTitle';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';
import WeeklyWinnersTable from '@/components/promo/WeeklyWinnersTable.vue';

const season = 2026;
const description = `Weekly DraftKings Slatebreaker winners for the ${season} NFL season: eligible games, prize pot, winning player, time, and payout.`;
usePageTitle(`DraftKings Slatebreaker Winners (${season})`, description, {
    breadcrumbs: [{ name: 'DraftKings Slatebreaker Winners', path: '/slatebreaker' }],
    schema: {
        '@type': 'WebPage',
        name: `DraftKings Slatebreaker Winners (${season} NFL Season)`,
        description,
        url: absoluteUrl('/slatebreaker'),
    },
});

const weeks = [
    {
        week: 1,
        eligibleGames: '1pm Sunday games',
        pot: '$2M',
        winner: 'Chuba Hubbard',
        time: '1Q 11:33',
        payout: '$7.3K',
    },
];
</script>

<template>
    <article class="mx-auto w-full max-w-4xl px-5 py-12">
        <div class="prose">
            <KnowledgeHeader>DraftKings Slatebreaker Winners ({{ season }})</KnowledgeHeader>
            <p>Weekly tracker for the DraftKings Slatebreaker promo winners. Win a share of the pot if your player scores the fastest touchdown.</p>
            <p>Also see this season's <RouterLink to="/kotez">King of the End Zone winners</RouterLink>.</p>
        </div>

        <section class="mt-8">
            <WeeklyWinnersTable :weeks="weeks" caption="Slatebreaker weekly winners" stat-label="Time" stat-key="time" />
        </section>
    </article>
</template>

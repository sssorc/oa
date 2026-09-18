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
    },
    {
        week: 2,
        eligibleGames: 'DET vs BUF',
        pot: '$2M',
        winner: 'Josh Palmer',
        yards: '43',
        payout: '$286',
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

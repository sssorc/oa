<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

usePageTitle('King of the End Zone', 'Track weekly results for the DraftKings King of the End Zone promo: eligible games, pot, winner, and payout.');

const weeks = [
    {
        week: 1,
        eligibleGames: 'NE vs SEA',
        pot: '$5M',
        winner: '-',
        payout: '-',
    },
];
</script>

<template>
    <article class="mx-auto w-full max-w-4xl px-5 py-12">
        <div class="prose">
            <KnowledgeHeader>King of the End Zone</KnowledgeHeader>
            <p>Weekly tracker for the DraftKings King of the End Zone promo.</p>
        </div>

        <section class="mt-8">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <caption class="sr-only">King of the End Zone weekly results</caption>
                    <thead>
                        <tr class="border-jet border-b font-mono dark:border-gray-400">
                            <th scope="col" class="py-3 pr-4 text-right font-bold">Week</th>
                            <th scope="col" class="px-4 py-3 text-left font-bold">Eligible games</th>
                            <th scope="col" class="px-4 py-3 text-right font-bold">Pot</th>
                            <th scope="col" class="px-4 py-3 text-left font-bold">Winner</th>
                            <th scope="col" class="py-3 pl-4 text-right font-bold">Payout</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in weeks" :key="row.week" class="border-pale-blue/70 border-b dark:border-gray-700">
                            <td class="font-numbers py-3 pr-4 text-right">{{ row.week }}</td>
                            <td class="px-4 py-3">{{ row.eligibleGames }}</td>
                            <td class="font-numbers px-4 py-3 text-right">{{ row.pot }}</td>
                            <td class="px-4 py-3" :class="{ 'text-space dark:text-gray-400': row.winner === '-' }">{{ row.winner }}</td>
                            <td class="font-numbers py-3 pl-4 text-right" :class="{ 'text-space dark:text-gray-400': row.payout === '-' }">{{ row.payout }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </article>
</template>

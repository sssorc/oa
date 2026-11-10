<script setup>
import { computed } from 'vue';

const props = defineProps({
    // [{ [firstColumnKey], eligibleGames, pot, winner, payout, odds?, noPromo?, [statKey] }]
    // A week can appear more than once when DraftKings ran the promo on multiple days
    weeks: {
        type: Array,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    // The promo-specific column, e.g. "Yards" for King of the End Zone or "Time" for Slatebreaker
    statLabel: {
        type: String,
        required: true,
    },
    statKey: {
        type: String,
        required: true,
    },
    firstColumnLabel: {
        type: String,
        default: 'Week',
    },
    firstColumnKey: {
        type: String,
        default: 'week',
    },
    gamesLabel: {
        type: String,
        default: 'Eligible games',
    },
});

const showOdds = computed(() => props.weeks.some((row) => row.odds));
const muted = (value) => ({ 'text-space dark:text-gray-400': value === '-' });
</script>

<template>
    <!-- Below sm each row is a card: week and games, winner, then labeled stats and payout -->
    <table class="block w-full text-sm sm:table">
        <caption class="sr-only">{{ caption }}</caption>
        <thead class="sr-only sm:not-sr-only sm:table-header-group">
            <tr class="border-jet border-b font-mono dark:border-gray-400">
                <th scope="col" class="py-3 pr-4 text-right font-bold">{{ firstColumnLabel }}</th>
                <th scope="col" class="px-4 py-3 text-left font-bold">{{ gamesLabel }}</th>
                <th scope="col" class="px-4 py-3 text-right font-bold">Pot</th>
                <th scope="col" class="px-4 py-3 text-left font-bold">Winner</th>
                <th v-if="showOdds" scope="col" class="px-4 py-3 text-right font-bold">Odds</th>
                <th scope="col" class="px-4 py-3 text-right font-bold">{{ statLabel }}</th>
                <th scope="col" class="py-3 pl-4 text-right font-bold">Payout</th>
            </tr>
        </thead>
        <tbody class="grid gap-3 sm:table-row-group">
            <tr
                v-for="row in weeks"
                :key="`${row[firstColumnKey]}-${row.eligibleGames}`"
                class="border-pale-blue/70 grid gap-x-4 gap-y-3 rounded border p-4 sm:table-row sm:rounded-none sm:border-0 sm:border-b sm:p-0 dark:border-gray-700"
                :class="showOdds ? 'grid-cols-2' : 'grid-cols-3'"
            >
                <td
                    v-if="row.noPromo"
                    class="font-numbers text-space order-1 block font-bold sm:table-cell sm:py-3 sm:pr-4 sm:text-right sm:font-normal sm:before:content-none dark:text-gray-400"
                    :class="firstColumnKey === 'week' && typeof row.week === 'number' && `before:content-['Week_']`"
                >
                    {{ row[firstColumnKey] }}
                </td>
                <td v-if="row.noPromo" :colspan="showOdds ? 6 : 5" class="order-2 col-span-full block sm:table-cell sm:py-3 sm:pl-4">
                    <div class="text-pale-blue flex h-7 items-center rounded bg-[repeating-linear-gradient(45deg,currentColor_0_1px,transparent_1px_7px)] px-2.5 dark:text-gray-600">
                        <span class="text-space bg-white pr-2 font-mono text-xs dark:bg-gray-900 dark:text-gray-400">{{ row.eligibleGames }}</span>
                    </div>
                </td>
                <td
                    v-if="!row.noPromo"
                    class="font-numbers order-1 block font-bold sm:table-cell sm:py-3 sm:pr-4 sm:text-right sm:font-normal sm:before:content-none"
                    :class="firstColumnKey === 'week' && typeof row.week === 'number' && `before:content-['Week_']`"
                >
                    {{ row[firstColumnKey] }}
                </td>
                <td v-if="!row.noPromo" class="text-space order-2 block text-right sm:table-cell sm:px-4 sm:py-3 sm:text-left sm:text-inherit dark:text-gray-400 sm:dark:text-inherit" :class="showOdds ? 'col-span-1' : 'col-span-2'">
                    {{ row.eligibleGames }}
                </td>
                <td
                    v-if="!row.noPromo"
                    data-label="Pot"
                    class="font-numbers order-6 block text-center before:block before:font-mono before:text-xs before:text-gray-500 before:content-[attr(data-label)] sm:table-cell sm:px-4 sm:py-3 sm:text-right sm:before:content-none dark:before:text-gray-400"
                >
                    {{ row.pot }}
                </td>
                <td v-if="!row.noPromo" class="order-3 block text-base font-bold sm:table-cell sm:px-4 sm:py-3 sm:text-sm sm:font-normal" :class="[muted(row.winner), showOdds ? 'col-span-2' : 'col-span-3']">
                    {{ row.winner }}
                </td>
                <td
                    v-if="showOdds && !row.noPromo"
                    data-label="Odds"
                    class="font-numbers order-4 block before:block before:font-mono before:text-xs before:text-gray-500 before:content-[attr(data-label)] sm:table-cell sm:px-4 sm:py-3 sm:text-right sm:before:content-none dark:before:text-gray-400"
                    :class="muted(row.odds || '-')"
                >
                    {{ row.odds || '-' }}
                </td>
                <td
                    v-if="!row.noPromo"
                    :data-label="statLabel"
                    class="font-numbers order-5 block before:block before:font-mono before:text-xs before:text-gray-500 before:content-[attr(data-label)] sm:table-cell sm:px-4 sm:py-3 sm:text-right sm:before:content-none dark:before:text-gray-400"
                    :class="muted(row[statKey])"
                >
                    {{ row[statKey] }}
                </td>
                <td
                    v-if="!row.noPromo"
                    data-label="Payout"
                    class="font-numbers order-7 block text-right before:block before:font-mono before:text-xs before:text-gray-500 before:content-[attr(data-label)] sm:table-cell sm:py-3 sm:pl-4 sm:before:content-none dark:before:text-gray-400"
                    :class="muted(row.payout)"
                >
                    {{ row.payout }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

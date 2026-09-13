<script setup>
defineProps({
    // [{ week, eligibleGames, pot, winner, payout, [statKey] }]
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
});

const muted = (value) => ({ 'text-space dark:text-gray-400': value === '-' });
</script>

<template>
    <!-- Below sm each row is a card: week and games, winner, then labeled yards/time, pot, and payout -->
    <table class="block w-full text-sm sm:table">
        <caption class="sr-only">{{ caption }}</caption>
        <thead class="sr-only sm:not-sr-only sm:table-header-group">
            <tr class="border-jet border-b font-mono dark:border-gray-400">
                <th scope="col" class="py-3 pr-4 text-right font-bold">Week</th>
                <th scope="col" class="px-4 py-3 text-left font-bold">Eligible games</th>
                <th scope="col" class="px-4 py-3 text-right font-bold">Pot</th>
                <th scope="col" class="px-4 py-3 text-left font-bold">Winner</th>
                <th scope="col" class="px-4 py-3 text-right font-bold">{{ statLabel }}</th>
                <th scope="col" class="py-3 pl-4 text-right font-bold">Payout</th>
            </tr>
        </thead>
        <tbody class="grid gap-3 sm:table-row-group">
            <tr
                v-for="row in weeks"
                :key="row.week"
                class="border-pale-blue/70 grid grid-cols-3 gap-x-4 gap-y-3 rounded border p-4 sm:table-row sm:rounded-none sm:border-0 sm:border-b sm:p-0 dark:border-gray-700"
            >
                <td class="font-numbers order-1 block font-bold before:content-['Week_'] sm:table-cell sm:py-3 sm:pr-4 sm:text-right sm:font-normal sm:before:content-none">
                    {{ row.week }}
                </td>
                <td class="text-space order-2 col-span-2 block text-right sm:table-cell sm:px-4 sm:py-3 sm:text-left sm:text-inherit dark:text-gray-400 sm:dark:text-inherit">
                    {{ row.eligibleGames }}
                </td>
                <td
                    data-label="Pot"
                    class="font-numbers order-5 block text-center before:block before:font-mono before:text-xs before:text-gray-500 before:content-[attr(data-label)] sm:table-cell sm:px-4 sm:py-3 sm:text-right sm:before:content-none dark:before:text-gray-400"
                >
                    {{ row.pot }}
                </td>
                <td class="order-3 col-span-3 block text-base font-bold sm:table-cell sm:px-4 sm:py-3 sm:text-sm sm:font-normal" :class="muted(row.winner)">
                    {{ row.winner }}
                </td>
                <td
                    :data-label="statLabel"
                    class="font-numbers order-4 block before:block before:font-mono before:text-xs before:text-gray-500 before:content-[attr(data-label)] sm:table-cell sm:px-4 sm:py-3 sm:text-right sm:before:content-none dark:before:text-gray-400"
                    :class="muted(row[statKey])"
                >
                    {{ row[statKey] }}
                </td>
                <td
                    data-label="Payout"
                    class="font-numbers order-6 block text-right before:block before:font-mono before:text-xs before:text-gray-500 before:content-[attr(data-label)] sm:table-cell sm:py-3 sm:pl-4 sm:before:content-none dark:before:text-gray-400"
                    :class="muted(row.payout)"
                >
                    {{ row.payout }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

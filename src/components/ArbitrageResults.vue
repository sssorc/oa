<script setup>
import { computed } from 'vue';
import CopyUrlButton from './CopyUrlButton.vue';
import { trackUrlCopy } from '@/utils/analytics';

const props = defineProps({
    results: {
        type: [Object, Boolean],
        required: true,
    },
});

const roi = computed(() => {
    if (!props.results) return 0;

    // For three-way arbitrage, use the average profit
    const profit = props.results.oddsC ? (props.results.profitA + props.results.profitB + props.results.profitC) / 3 : props.results.profitA;

    return (profit / totalStake.value) * 100;
});

const totalStake = computed(() => {
    if (!props.results) return 0;
    return props.results.stakeA + props.results.stakeB + (props.results.stakeC || 0);
});

const backgroundColor = computed(() => {
    if (roi.value >= 0) {
        return 'from-green/40 to-ice-blue/40 dark:from-ice-blue dark:to-pale-blue';
    } else {
        return 'bg-pink/20 dark:bg-gray-300';
    }
});

const roiColor = computed(() => {
    if (roi.value >= 0) {
        return 'text-jet';
    } else {
        return 'text-red';
    }
});

const borderColor = computed(() => {
    if (roi.value >= 0) {
        return 'border-jet';
    } else {
        return 'border-red';
    }
});

const shareUrl = computed(() => {
    if (!props.results) return window.location.href;

    const baseUrl = window.location.origin + '/arbitrage';
    const { oddsA, oddsB, oddsC, stakeA } = props.results;

    const params = new URLSearchParams();
    if (stakeA) params.set('stakeA', stakeA);
    if (oddsA) params.set('oddsA', oddsA);
    if (oddsB) params.set('oddsB', oddsB);
    if (oddsC) params.set('oddsC', oddsC);

    return `${baseUrl}?${params.toString()}`;
});

function formatUSD(number) {
    let dollarUS = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return dollarUS.format(number).replace('.00', '');
}

function formatOdds(odds) {
    return odds.toString().startsWith('+') ? odds : Number(odds) > 0 ? `+${odds}` : odds;
}
</script>

<template>
    <div v-if="results" :class="results.oddsC ? 'max-w-[500px] md:min-w-[340px]' : 'max-w-[420px] md:min-w-[300px]'">
        <div :class="borderColor" class="dark:text-jet relative border font-mono shadow-md">
            <div :class="backgroundColor" class="relative z-20 bg-linear-65 p-6">
                <div class="flex flex-wrap items-start justify-between gap-6">
                    <div class="text-left">
                        <div class="text-jet font-mono text-sm">ROI</div>
                        <div :class="roiColor" class="mt-1 flex items-end text-4xl font-bold">
                            <div class="font-numbers tracking-tight">{{ roi.toFixed(2) }}</div>
                            <span class="ml-1 pb-1 text-2xl">%</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-end">
                        <div class="text-left">
                            <div class="text-jet font-mono text-sm">Total Stake</div>
                            <div class="font-numbers mt-1 text-3xl font-semibold">{{ formatUSD(totalStake) }}</div>
                        </div>
                    </div>
                </div>
                <hr class="border-space/40 mt-8 border-t" />
                <div class="mt-8 flex items-start justify-between gap-4">
                    <div>
                        <div class="font-mono text-sm">Bet A ({{ formatOdds(results.oddsA) }})</div>
                        <div class="font-numbers mt-1 text-3xl font-bold">{{ formatUSD(results.stakeA) }}</div>
                    </div>
                    <div>
                        <div class="font-mono text-sm">Bet B ({{ formatOdds(results.oddsB) }})</div>
                        <div class="font-numbers decoration-pink mt-1 text-3xl font-bold underline decoration-4 underline-offset-2">{{ formatUSD(results.stakeB) }}</div>
                    </div>
                    <div v-if="results.oddsC">
                        <div class="font-mono text-sm">Bet C ({{ formatOdds(results.oddsC) }})</div>
                        <div class="font-numbers decoration-pink mt-1 text-3xl font-bold underline decoration-4 underline-offset-2">{{ formatUSD(results.stakeC) }}</div>
                    </div>
                </div>

                <hr class="border-space/40 mt-8 border-t" />
                <div class="mt-8 flex items-start justify-between gap-4">
                    <div>
                        <div class="font-mono text-sm">{{ formatUSD(results.payoutA) }} payout</div>
                        <div :class="{ 'text-red': results.profitA < 0 }" class="font-numbers mt-1 text-2xl font-bold">
                            {{ formatUSD(results.profitA) }}
                        </div>
                    </div>
                    <div>
                        <div class="font-mono text-sm">{{ formatUSD(results.payoutB) }} payout</div>
                        <div :class="{ 'text-red': results.profitB < 0 }" class="font-numbers mt-1 text-2xl font-bold">
                            {{ formatUSD(results.profitB) }}
                        </div>
                    </div>
                    <div v-if="results.oddsC">
                        <div class="font-mono text-sm">{{ formatUSD(results.payoutC) }} payout</div>
                        <div :class="{ 'text-red': results.profitC < 0 }" class="font-numbers mt-1 text-2xl font-bold">
                            {{ formatUSD(results.profitC) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-2">
            <CopyUrlButton :content="shareUrl" @click="trackUrlCopy('arbitrage')" />
        </div>
    </div>
</template>

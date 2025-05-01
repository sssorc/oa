<script setup>
import { computed } from 'vue';
import CopyUrlButton from './CopyUrlButton.vue';

const props = defineProps({
    result: {
        type: [Object, Boolean],
        required: true,
    },
});

const roi = computed(() => {
    if (!props.result) return 0;
    return props.result.percent;
});

const totalStake = computed(() => {
    if (!props.result) return 0;
    return props.result.stakeB;
});

const backgroundColor = computed(() => {
    if (roi.value >= 70) {
        return 'from-green/40 to-ice-blue/40';
    } else {
        return 'bg-pink/20';
    }
});

const roiColor = computed(() => {
    if (roi.value >= 70) {
        return 'text-jet';
    } else {
        return 'text-red';
    }
});

const borderColor = computed(() => {
    if (roi.value >= 70) {
        return 'border-jet';
    } else {
        return 'border-red';
    }
});

const shareUrl = computed(() => {
    if (!props.result) return window.location.href;

    const baseUrl = window.location.origin + window.location.pathname;
    const { oddsA, oddsB, stakeA } = props.result;

    const params = new URLSearchParams();
    if (oddsA) params.set('oddsa', oddsA);
    if (oddsB) params.set('oddsb', oddsB);
    if (stakeA) params.set('stakea', stakeA);

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
    return Number(odds) > 0 ? `+${odds}` : odds;
}
</script>

<template>
    <div v-if="result" class="max-w-[420px] md:min-w-[300px]">
        <div :class="borderColor" class="relative border font-mono shadow-md">
            <div :class="backgroundColor" class="relative z-20 bg-linear-65 p-6">
                <div class="flex flex-wrap items-start justify-between gap-6">
                    <div class="text-left">
                        <div class="text-jet font-mono text-sm">Conversion</div>
                        <div :class="roiColor" class="mt-1 flex items-end text-4xl font-bold">
                            <div class="font-numbers tracking-tight">{{ roi.toFixed(2) }}</div>
                            <span class="ml-1 pb-1 text-2xl">%</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-end">
                        <div class="text-left">
                            <div class="text-jet font-mono text-sm">Hedge Amount</div>
                            <div class="font-numbers mt-1 text-3xl font-semibold">{{ formatUSD(totalStake) }}</div>
                        </div>
                    </div>
                </div>
                <hr class="border-space/40 mt-8 border-t" />
                <div class="mt-8 flex items-start justify-between gap-4">
                    <div>
                        <div class="font-mono text-sm">Bet A ({{ formatOdds(result.oddsA) }})</div>
                        <div class="font-numbers mt-1 text-3xl font-bold">{{ formatUSD(result.stakeA) }}</div>
                        <div class="font-mono text-sm text-gray-600">bonus bet</div>
                    </div>
                    <div>
                        <div class="font-mono text-sm">Bet B ({{ formatOdds(result.oddsB) }})</div>
                        <div class="font-numbers mt-1 text-3xl font-bold">{{ formatUSD(result.stakeB) }}</div>
                        <div class="font-mono text-sm text-gray-600">hedge</div>
                    </div>
                </div>

                <hr class="border-space/40 mt-8 border-t" />
                <div class="mt-8 flex items-start justify-between gap-4">
                    <div>
                        <div class="font-mono text-sm">{{ formatUSD(result.payoutA) }} payout</div>
                        <div :class="{ 'text-red': result.profitA < 0 }" class="font-numbers mt-1 text-2xl font-bold">
                            {{ formatUSD(result.profitA) }}
                        </div>
                    </div>
                    <div>
                        <div class="font-mono text-sm">{{ formatUSD(result.payoutB) }} payout</div>
                        <div :class="{ 'text-red': result.profitB < 0 }" class="font-numbers mt-1 text-2xl font-bold">
                            {{ formatUSD(result.profitB) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-2">
            <CopyUrlButton :content="shareUrl" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import CopyUrlButton from './CopyUrlButton.vue';

const props = defineProps({
    play: {
        type: [Object, Boolean],
        required: true,
    },
    betA: String,
    betB: String,
});

const roi = computed(() => {
    if (!props.play) return 0;
    return props.play.percent;
});

const totalStake = computed(() => {
    if (!props.play) return 0;
    return props.play.stakeB;
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
    if (!props.play) return window.location.href;

    const baseUrl = window.location.origin + window.location.pathname;
    const { oddsA, oddsB } = props.play;

    const params = new URLSearchParams();
    if (oddsA) params.set('oddsa', oddsA);
    if (oddsB) params.set('oddsb', oddsB);

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
    <div v-if="play" class="max-w-[420px] md:min-w-[300px]">
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
                            <div class="text-jet font-mono text-sm">Total Stake</div>
                            <div class="font-numbers mt-1 text-3xl font-semibold">{{ formatUSD(totalStake) }}</div>
                        </div>
                    </div>
                </div>
                <hr class="border-space/40 mt-8 border-t" />
                <div class="mt-8 flex items-start justify-between gap-4">
                    <div>
                        <div class="font-mono text-sm">{{ betA }} ({{ formatOdds(play.oddsA) }})</div>
                        <div class="font-numbers mt-1 text-3xl font-bold">{{ formatUSD(play.stakeA) }}</div>
                        <div class="font-mono text-sm text-gray-600">free bet</div>
                    </div>
                    <div>
                        <div class="font-mono text-sm">{{ betB }} ({{ formatOdds(play.oddsB) }})</div>
                        <div class="font-numbers mt-1 text-3xl font-bold">{{ formatUSD(play.stakeB) }}</div>
                        <div class="font-mono text-sm text-gray-600">stake</div>
                    </div>
                </div>

                <hr class="border-space/40 mt-8 border-t" />
                <div class="mt-8 flex items-start justify-between gap-4">
                    <div>
                        <div class="font-mono text-sm">{{ formatUSD(play.payoutA) }} payout</div>
                        <div :class="{ 'text-red': play.profitA < 0 }" class="font-numbers mt-1 text-2xl font-bold">
                            {{ formatUSD(play.profitA) }}
                        </div>
                    </div>
                    <div>
                        <div class="font-mono text-sm">{{ formatUSD(play.payoutB) }} payout</div>
                        <div :class="{ 'text-red': play.profitB < 0 }" class="font-numbers mt-1 text-2xl font-bold">
                            {{ formatUSD(play.profitB) }}
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
